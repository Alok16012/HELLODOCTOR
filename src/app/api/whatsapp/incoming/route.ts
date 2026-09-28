import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { handleIncoming, type IncomingWhatsApp } from "@/lib/whatsapp/bot";

// Called by the Baileys bridge (/whatsapp-bot) for every incoming WhatsApp chat
// message. Responds with the replies the bridge should send back.

function authorized(req: NextRequest): boolean {
  const secret = process.env.WHATSAPP_BOT_SECRET;
  const given = req.headers.get("x-bot-secret");
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<IncomingWhatsApp>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.messageId || !body.chatId) {
    return NextResponse.json({ error: "messageId and chatId are required" }, { status: 400 });
  }

  try {
    const replies = await handleIncoming({
      messageId: String(body.messageId),
      chatId: String(body.chatId),
      phone: body.phone ? String(body.phone) : null,
      name: body.name ? String(body.name) : null,
      text: typeof body.text === "string" ? body.text : null,
    });
    return NextResponse.json({ replies });
  } catch (e) {
    console.error("WhatsApp incoming failed:", e);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
