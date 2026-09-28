import { after, NextRequest, NextResponse } from "next/server";
import { verifySignature, type IncomingMessage, type WebhookPayload } from "@/lib/whatsapp/cloud-api";
import { handleIncomingMessage } from "@/lib/whatsapp/bot";

// Meta WhatsApp Cloud API webhook.
// Configure in Meta App Dashboard → WhatsApp → Configuration:
//   Callback URL: https://<your-domain>/api/whatsapp/webhook
//   Verify token: value of WHATSAPP_VERIFY_TOKEN
//   Subscribe to the "messages" field.

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && challenge && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const jobs: { message: IncomingMessage; name?: string }[] = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      for (const message of value?.messages ?? []) {
        const name = value?.contacts?.find((c) => c.wa_id === message.from)?.profile?.name;
        jobs.push({ message, name });
      }
    }
  }

  // Acknowledge immediately (Meta retries slow webhooks); reply after the response.
  after(async () => {
    for (const job of jobs) {
      try {
        await handleIncomingMessage(job.message, job.name);
      } catch (e) {
        console.error("WhatsApp message handling failed:", e);
      }
    }
  });

  return NextResponse.json({ received: true });
}
