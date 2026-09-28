import Anthropic from "@anthropic-ai/sdk";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getKnowledgeBase } from "./knowledge-base";
import { markRead, sendText, type IncomingMessage, messageText } from "./cloud-api";

const MODEL = process.env.WHATSAPP_BOT_MODEL || "claude-opus-5";
const HISTORY_LIMIT = 20;
const HANDOFF_MARKER = "[[HANDOFF]]";

const anthropic = new Anthropic();

function adminClient(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const INSTRUCTIONS = `You are the WhatsApp admission assistant for Hello Doctor, an MBBS admission consultancy in Noida.
You chat with NEET UG / NEET PG students and their parents who message the Hello Doctor WhatsApp number.

How to reply:
- Reply in the same language style the user writes in (English, Hindi, or Hinglish in Roman script).
- Keep replies short and friendly — 2 to 6 lines, like a helpful counsellor on WhatsApp. Use WhatsApp formatting (*bold*, line breaks, simple "-" bullets); no markdown headings or tables.
- Answer only from the knowledge base below and general, well-established facts about the NEET/MCC process. If you don't know something (exact current-year cutoffs, seat availability, fee changes), say a counsellor will confirm — never invent numbers, colleges, or promises.
- Closing ranks in the knowledge base are indicative previous-year figures; say so when you use them. Never guarantee admission.
- To give useful guidance, naturally ask for what you are missing: name, NEET UG or PG, score or AIR, category, home state, budget. Ask one or two things at a time.
- Share relevant links from the knowledge base (college pages, blog posts, predictor) when they help.
- Stay on topic (medical admissions, Hello Doctor services). Politely decline unrelated requests.

Handing over to a human:
- If the user asks to talk to a counsellor/human, wants a call back, is ready to book or pay, is upset, or asks something you cannot answer from the knowledge base, tell them a Hello Doctor counsellor will contact them shortly, and end your message with the exact text ${HANDOFF_MARKER} on its own line. The marker is removed before sending.`;

function normalizePhone(waId: string): string {
  const digits = waId.replace(/\D/g, "");
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

interface Contact {
  wa_id: string;
  name: string | null;
  lead_id: string | null;
  bot_paused: boolean;
}

async function ensureContactAndLead(db: SupabaseClient, waId: string, profileName: string | undefined): Promise<Contact> {
  const { data: existing } = await db.from("whatsapp_contacts").select("*").eq("wa_id", waId).maybeSingle();
  if (existing?.lead_id) return existing as Contact;

  const phone = normalizePhone(waId);
  let leadId: string | null = null;

  // Re-use a lead that already exists for this number (website form, Meta ad, etc.).
  const { data: lead } = await db
    .from("leads")
    .select("id")
    .or(`phone.eq.${phone},phone.eq.+91${phone},phone.eq.91${phone},phone.eq.+${waId}`)
    .limit(1)
    .maybeSingle();

  if (lead) {
    leadId = lead.id;
  } else {
    const assignee = await pickAssignee(db).catch(() => null);
    const fullName = profileName?.trim() || "WhatsApp Lead";
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
          message: `${fullName} (${phone}) ne WhatsApp pe message kiya hai — bot reply kar raha hai, follow up karo!`,
          type: "info",
          target_user_id: assignee.id,
        });
      }
    }
  }

  const contact: Contact = {
    wa_id: waId,
    name: profileName ?? existing?.name ?? null,
    lead_id: leadId,
    bot_paused: existing?.bot_paused ?? false,
  };
  await db.from("whatsapp_contacts").upsert({ ...contact, last_message_at: new Date().toISOString() });
  return contact;
}

async function handoff(db: SupabaseClient, contact: Contact, lastMessage: string) {
  await db.from("whatsapp_contacts").update({ bot_paused: true }).eq("wa_id", contact.wa_id);
  if (!contact.lead_id) return;

  const { data: lead } = await db.from("leads").select("assigned_to, full_name, phone").eq("id", contact.lead_id).single();
  await db.from("lead_activities").insert({
    lead_id: contact.lead_id,
    activity_type: "note_added",
    note: `WhatsApp bot handed over to counsellor. Last message: "${lastMessage.slice(0, 200)}"`,
  });
  await db.from("notifications").insert({
    title: "WhatsApp lead needs a counsellor",
    message: `${lead?.full_name ?? "Lead"} (${lead?.phone ?? contact.wa_id}) counsellor se baat karna chahta hai — abhi call karo!`,
    type: "warning",
    ...(lead?.assigned_to ? { target_user_id: lead.assigned_to } : {}),
  });
}

async function generateReply(history: Anthropic.Beta.BetaMessageParam[]): Promise<string | null> {
  const knowledgeBase = await getKnowledgeBase();

  const response = await anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: [
      { type: "text", text: INSTRUCTIONS },
      { type: "text", text: `<knowledge_base>\n${knowledgeBase}\n</knowledge_base>`, cache_control: { type: "ephemeral" } },
    ],
    messages: history,
  });

  if (response.stop_reason === "refusal") return null;
  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  return text || null;
}

export async function handleIncomingMessage(message: IncomingMessage, profileName: string | undefined) {
  const db = adminClient();
  const text = messageText(message);
  const waId = message.from;

  // Store inbound first; the unique message id makes Meta's webhook retries no-ops.
  const { data: stored, error: storeError } = await db
    .from("whatsapp_messages")
    .upsert(
      { wa_message_id: message.id, wa_id: waId, direction: "in", body: text ?? `[${message.type}]` },
      { onConflict: "wa_message_id", ignoreDuplicates: true },
    )
    .select("id");
  if (storeError) {
    console.error("WhatsApp message store failed:", storeError.message);
    return;
  }
  if (!stored?.length) return; // duplicate delivery

  const contact = await ensureContactAndLead(db, waId, profileName);
  await db.from("whatsapp_contacts").update({ last_message_at: new Date().toISOString() }).eq("wa_id", waId);
  if (contact.bot_paused) return; // a counsellor has taken over this chat

  await markRead(message.id);

  let reply: string | null;
  if (!text) {
    reply = "Thanks for your message! Abhi main sirf text messages samajh sakta hoon — please apna sawaal type karke bhejiye. 🙏";
  } else {
    const { data: rows } = await db
      .from("whatsapp_messages")
      .select("direction, body")
      .eq("wa_id", waId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);

    const history: Anthropic.Beta.BetaMessageParam[] = (rows ?? [])
      .reverse()
      .map((r) => ({ role: r.direction === "in" ? "user" : "assistant", content: r.body }) as const);
    while (history.length && history[0].role !== "user") history.shift();

    try {
      reply = await generateReply(history);
    } catch (e) {
      console.error("WhatsApp bot Claude call failed:", e);
      reply = null;
    }
  }

  let needsHuman = false;
  if (!reply) {
    needsHuman = true;
    reply = "Thank you! Hamare counsellor aapse jaldi contact karenge. Urgent ho toh call karein: +91 92116 07005";
  } else if (reply.includes(HANDOFF_MARKER)) {
    needsHuman = true;
    reply = reply.replaceAll(HANDOFF_MARKER, "").trim();
  }

  const outId = await sendText(waId, reply);
  await db.from("whatsapp_messages").insert({
    wa_message_id: outId ?? `out-${message.id}`,
    wa_id: waId,
    direction: "out",
    body: reply,
  });

  if (needsHuman) await handoff(db, contact, text ?? "");
}
