// Hello Doctor WhatsApp bot — Baileys (open-source WhatsApp Web client).
//
// This process keeps a WhatsApp Web session open, forwards every incoming chat
// message to the website (POST /api/whatsapp/incoming), and sends back the
// replies the website returns. Leads, reply rules and chat history all live in
// the website + Supabase; this file is only the WhatsApp transport.
//
// Env:
//   SITE_URL            e.g. https://hellodoctorindia.com
//   WHATSAPP_BOT_SECRET same value as on the website (Netlify env)
//   AUTH_DIR            where the WhatsApp login is stored (default ./auth)

import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  isJidGroup,
  isJidNewsletter,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";

const SITE_URL = (process.env.SITE_URL || "").replace(/\/$/, "");
const SECRET = process.env.WHATSAPP_BOT_SECRET;
const AUTH_DIR = process.env.AUTH_DIR || "./auth";

if (!SITE_URL || !SECRET) {
  console.error("Set SITE_URL and WHATSAPP_BOT_SECRET before starting the bot.");
  process.exit(1);
}

const logger = pino({ level: process.env.LOG_LEVEL || "warn" });

function textOf(message) {
  const m = message?.ephemeralMessage?.message ?? message?.viewOnceMessage?.message ?? message;
  return (
    m?.conversation ??
    m?.extendedTextMessage?.text ??
    m?.imageMessage?.caption ??
    m?.videoMessage?.caption ??
    m?.buttonsResponseMessage?.selectedDisplayText ??
    m?.listResponseMessage?.title ??
    null
  );
}

// WhatsApp may address chats by a privacy "LID" instead of the phone number;
// prefer whichever JID actually carries the phone number.
function phoneJid(key) {
  const candidates = [key.remoteJid, key.remoteJidAlt, key.senderPn].filter(Boolean);
  return candidates.find((j) => j.endsWith("@s.whatsapp.net")) ?? null;
}

async function askSite(payload) {
  const res = await fetch(`${SITE_URL}/api/whatsapp/incoming`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-bot-secret": SECRET },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Site responded ${res.status}: ${await res.text()}`);
  return res.json();
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, auth: state, logger, markOnlineOnConnect: false });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("\nScan this QR in WhatsApp → Linked devices → Link a device:\n");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "open") console.log("✅ WhatsApp connected");
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.error(`Logged out from WhatsApp. Delete ${AUTH_DIR} and restart to scan a new QR.`);
        process.exit(1);
      }
      console.warn(`Connection closed (${code ?? "unknown"}), reconnecting…`);
      setTimeout(start, 3000);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      const chat = msg.key.remoteJid;
      if (!chat || msg.key.fromMe) continue;
      if (isJidGroup(chat) || isJidBroadcast(chat) || isJidNewsletter(chat)) continue;
      if (!msg.message) continue;

      const jid = phoneJid(msg.key);
      const phone = jid ? jid.split("@")[0] : null;
      try {
        const { replies = [] } = await askSite({
          messageId: msg.key.id,
          chatId: chat,
          phone,
          name: msg.pushName ?? null,
          text: textOf(msg.message),
        });
        if (!replies.length) continue;
        await sock.readMessages([msg.key]);
        for (const text of replies) {
          await sock.sendPresenceUpdate("composing", chat);
          await new Promise((r) => setTimeout(r, 800));
          await sock.sendMessage(chat, { text });
        }
        await sock.sendPresenceUpdate("paused", chat);
      } catch (e) {
        console.error("Failed to handle message:", e.message);
      }
    }
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
