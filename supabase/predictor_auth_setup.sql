-- NEET predictor: pay-once account unlock via Razorpay.
--
-- A public visitor creates a normal Supabase Auth account (auth.users), pays
-- once through Razorpay, and their full predictor report (college names,
-- fees, closing ranks) stays unlocked from then on. Separate from the CRM's
-- own `payments` ledger (crm_setup.sql, which is a manual fee-record for
-- enrolled students) — these are public self-serve transactions.
--
-- Rows here are only ever written by the service-role key, from
-- src/app/api/predictor/{create-order,verify-payment}/route.ts. Signed-in
-- users may only read their own rows.

create table if not exists predictor_orders (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  amount_paise integer not null,
  exam text not null check (exam in ('ug', 'pg')),
  created_at timestamptz not null default now()
);

create table if not exists predictor_unlocks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  razorpay_order_id text not null,
  razorpay_payment_id text not null,
  amount_paise integer not null,
  unlocked_at timestamptz not null default now()
);

alter table predictor_orders enable row level security;
alter table predictor_unlocks enable row level security;

drop policy if exists "user reads own orders" on predictor_orders;
create policy "user reads own orders" on predictor_orders
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "user reads own unlock" on predictor_unlocks;
create policy "user reads own unlock" on predictor_unlocks
  for select to authenticated using (auth.uid() = user_id);

-- No insert/update policy is granted here on purpose: the anon and
-- authenticated roles can only SELECT. Writes happen exclusively through the
-- service-role key after a verified Razorpay signature.
