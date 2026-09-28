-- ════════════════════════════════════════════════════════════
-- WhatsApp automation (Baileys bridge + rule-based replies)
-- Run once in Supabase SQL editor after crm_setup.sql.
-- ════════════════════════════════════════════════════════════

-- One row per WhatsApp number that has messaged us.
create table if not exists whatsapp_contacts (
  wa_id text primary key,                       -- e.g. 919876543210
  name text,
  lead_id uuid references leads(id) on delete set null,
  bot_paused boolean not null default false,    -- true = a counsellor has taken over, bot stays silent
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Full conversation log (inbound + bot replies).
create table if not exists whatsapp_messages (
  id bigserial primary key,
  wa_message_id text not null unique,           -- dedupes Meta webhook retries
  wa_id text not null,
  direction text not null check (direction in ('in', 'out')),
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_whatsapp_messages_wa_id on whatsapp_messages(wa_id, created_at desc);

-- Website API (service role) writes; CRM staff can read and pause/resume the bot.
alter table whatsapp_contacts enable row level security;
alter table whatsapp_messages enable row level security;

drop policy if exists "staff read whatsapp contacts" on whatsapp_contacts;
create policy "staff read whatsapp contacts" on whatsapp_contacts for select
  using (exists (select 1 from profiles where id = auth.uid()));

drop policy if exists "staff update whatsapp contacts" on whatsapp_contacts;
create policy "staff update whatsapp contacts" on whatsapp_contacts for update
  using (exists (select 1 from profiles where id = auth.uid()));

drop policy if exists "staff read whatsapp messages" on whatsapp_messages;
create policy "staff read whatsapp messages" on whatsapp_messages for select
  using (exists (select 1 from profiles where id = auth.uid()));
