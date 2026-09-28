# Hello Doctor WhatsApp Bot (Baileys)

Open-source WhatsApp Web bridge built on [Baileys](https://github.com/WhiskeySockets/Baileys).
It forwards every incoming WhatsApp chat to the website (`/api/whatsapp/incoming`),
which creates/assigns the CRM lead and returns rule-based replies (menu, NEET
predictor, college details, fees, contact, counsellor hand-off). No AI is used.

> Baileys is an unofficial WhatsApp client. Use a dedicated number, avoid bulk/spam
> messages, and keep a backup number — WhatsApp can restrict numbers that misbehave.

## One-time setup

1. **Supabase:** run `supabase/whatsapp_setup.sql` in the SQL editor.
2. **Website env (Netlify):**
   - `WHATSAPP_BOT_SECRET` — any long random string
   - `SUPABASE_SERVICE_ROLE_KEY` — if not already set
3. **Bot server** — needs a machine that stays on (VPS, Railway, Render, office PC). Node 20+.

```bash
cd whatsapp-bot
npm install
SITE_URL=https://hellodoctorindia.com WHATSAPP_BOT_SECRET=<same secret> npm start
```

4. A QR code prints in the terminal. On the business phone open
   **WhatsApp → Linked devices → Link a device** and scan it.
   The login is saved in `./auth` (set `AUTH_DIR` to change) — keep that folder on a
   persistent disk so restarts don't need a new scan.

Keep it running with `pm2 start index.js --name whatsapp-bot` (or your host's process manager).

## How chats flow

- New number → CRM lead (`source = whatsapp`), round-robin assigned, counsellor notified.
- Bot replies from website data; first message also shows the numbered menu.
- Student types "counsellor"/"call" or picks menu option 8 → bot goes silent for that
  chat (`whatsapp_contacts.bot_paused = true`) and the assigned counsellor gets an alert.
  Set `bot_paused` back to `false` to resume the bot for that chat.
- Reply rules live in `src/lib/whatsapp/replies.ts`; predictor cutoffs in
  `src/data/neet-predictor.ts`.
