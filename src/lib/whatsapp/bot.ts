import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getColleges, getScholarships } from "@/lib/content";
import { buildReply, MENU_TEXT, type SiteData } from "./replies";

// Handles one incoming WhatsApp message (delivered by the Baileys bridge in
// /whatsapp-bot): logs it, creates/assigns the CRM lead, and returns the
// rule-based replies to send. No AI is involved.

function adminClient(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// Site data is cached per server instance and refreshed hourly (same as ISR).
let siteCache: { data: SiteData; at: number } | null = null;
async function siteData(): Promise<SiteData> {
  if (siteCache && Date.now() - siteCache.at < 60 * 60 * 1000) return siteCache.data;
  const [colleges, scholarships] = await Promise.all([
    getColleges().catch(() => []),
    getScholarships().catch(() => []),
  ]);
  siteCache = { data: { colleges, scholarships }, at: Date.now() };
  return siteCache.data;
}

export interface IncomingWhatsApp {
  messageId: string;
  /** WhatsApp chat id, e.g. 919876543210@s.whatsapp.net or 1234@lid */
  chatId: string;
  /** Phone digits with country code when WhatsApp exposes it, else null. */
  phone: string | null;
  name: string | null;
  text: string | null;
}

interface Contact {
  wa_id: string;
  name: string | null;
  lead_id: string | null;
  bot_paused: boolean;
}

function leadPhone(msg: IncomingWhatsApp): string {
  const digits = (msg.phone ?? "").replace(/\D/g, "");
  if (!digits) return `WhatsApp ${msg.chatId.split("@")[0]}`; // number hidden by WhatsApp privacy
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : `+${digits}`;
}

async function pickAssignee(db: SupabaseClient): Promise<{ id: string; full_name: string } | null> {
  const { data: agents } = await db
    .from("profiles")
    .select("id, full_name")
    .in("role", ["lead", "telecaller", "counselor"])
    .eq("is_active", true)
    .order("id");
  if (!agents?.length) return null;

  // Round-robin by today's (IST) WhatsApp leads, same approach as Meta leads.
  const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000);
  const dayStartIst = new Date(
    Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate()) - 5.5 * 3600 * 1000,
  );
  const { data: todays } = await db
    .from("leads")
    .select("assigned_to")
    .eq("source", "whatsapp")
    .gte("assigned_at", dayStartIst.toISOString())
    .not("assigned_to", "is", null);

  const counts = new Map<string, number>(agents.map((a) => [a.id, 0]));
  for (const l of todays ?? []) {
    if (counts.has(l.assigned_to)) counts.set(l.assigned_to, (counts.get(l.assigned_to) ?? 0) + 1);
  }
  return agents.reduce((best, a) => ((counts.get(a.id) ?? 0) < (counts.get(best.id) ?? 0) ? a : best));
}

async function ensureContactAndLead(db: SupabaseClient, msg: IncomingWhatsApp): Promise<{ contact: Contact; isNew: boolean }> {
  const { data: existing } = await db.from("whatsapp_contacts").select("*").eq("wa_id", msg.chatId).maybeSingle();
  if (existing?.lead_id) return { contact: existing as Contact, isNew: false };

  const phone = leadPhone(msg);
  let leadId: string | null = null;

  // Re-use a lead that already exists for this number (website form, Meta ad, etc.).
  const { data: lead } = msg.phone
    ? await db
        .from("leads")
        .select("id")
        .or(`phone.eq.${phone},phone.eq.+91${phone},phone.eq.91${phone},phone.eq.+${msg.phone}`)
        .limit(1)
        .maybeSingle()
    : { data: null };

  if (lead) {
    leadId = lead.id;
  } else {
    const assignee = await pickAssignee(db).catch(() => null);
    const fullName = msg.name?.trim() || "WhatsApp Lead";
    const { data: inserted, error } = await db
      .from("leads")
      .insert({
        full_name: fullName,
        phone,
        source: "whatsapp",
        status: "new",
        assigned_to: assignee?.id ?? null,
        assigned_at: assignee ? new Date().toISOString() : null,
      })
      .select("id")
      .single();
    if (error) console.error("WhatsApp lead insert failed:", error.message);
    leadId = inserted?.id ?? null;

    if (leadId) {
      await db.from("lead_activities").insert({
        lead_id: leadId,
        activity_type: "created",
        new_value: assignee ? `WhatsApp lead auto-assigned to ${assignee.full_name}` : "new (WhatsApp)",
      });
      if (assignee) {
        await db.from("notifications").insert({
          title: "New WhatsApp Lead assigned",
          message: `${fullName} (${phone}) ne WhatsApp pe message kiya hai — follow up karo!`,
          type: "info",
          target_user_id: assignee.id,
        });
      }
    }
  }

  const contact: Contact = {
    wa_id: msg.chatId,
    name: msg.name ?? existing?.name ?? null,
    lead_id: leadId,
    bot_paused: existing?.bot_paused ?? false,
  };
  await db.from("whatsapp_contacts").upsert({ ...contact, last_message_at: new Date().toISOString() });
  return { contact, isNew: !existing };
}

async function handoff(db: SupabaseClient, contact: Contact, lastMessage: string) {
  await db.from("whatsapp_contacts").update({ bot_paused: true }).eq("wa_id", contact.wa_id);
  if (!contact.lead_id) return;

  const { data: lead } = await db.from("leads").select("assigned_to, full_name, phone").eq("id", contact.lead_id).single();
  await db.from("lead_activities").insert({
    lead_id: contact.lead_id,
    activity_type: "note_added",
    note: `WhatsApp: counsellor requested. Last message: "${lastMessage.slice(0, 200)}"`,
  });
  await db.from("notifications").insert({
    title: "WhatsApp lead needs a counsellor",
    message: `${lead?.full_name ?? "Lead"} (${lead?.phone ?? contact.wa_id}) counsellor se baat karna chahta hai — abhi call karo!`,
    type: "warning",
    ...(lead?.assigned_to ? { target_user_id: lead.assigned_to } : {}),
  });
}

/** Returns the messages to send back (empty = stay silent). */
export async function handleIncoming(msg: IncomingWhatsApp): Promise<string[]> {
  const db = adminClient();

  // Store inbound first; the unique message id makes duplicate deliveries no-ops.
  const { data: stored, error: storeError } = await db
    .from("whatsapp_messages")
    .upsert(
      { wa_message_id: msg.messageId, wa_id: msg.chatId, direction: "in", body: msg.text ?? "[media]" },
      { onConflict: "wa_message_id", ignoreDuplicates: true },
    )
    .select("id");
  if (storeError) throw new Error(`WhatsApp message store failed: ${storeError.message}`);
  if (!stored?.length) return [];

  const { contact, isNew } = await ensureContactAndLead(db, msg);
  await db.from("whatsapp_contacts").update({ last_message_at: new Date().toISOString() }).eq("wa_id", msg.chatId);
  if (contact.bot_paused) return []; // a counsellor has taken over this chat

  const reply = buildReply(msg.text, await siteData(), msg.name ?? undefined);
  const replies = [reply.text];
  // First-time chatters always get the menu so they know what the bot can do.
  if (reply.menu || (isNew && !reply.handoff)) replies.push(MENU_TEXT);

  await db.from("whatsapp_messages").insert(
    replies.map((body, i) => ({ wa_message_id: `out-${msg.messageId}-${i}`, wa_id: msg.chatId, direction: "out", body })),
  );
  if (reply.handoff) await handoff(db, contact, msg.text ?? "");
  return replies;
}
