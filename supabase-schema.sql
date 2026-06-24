-- Run this in your Supabase project: SQL Editor -> New query -> paste -> Run.
create table if not exists public.subscriptions (
  id                    text primary key,          -- Stripe subscription id (sub_...)
  user_id               text,                       -- our app user id
  customer_id           text,                       -- Stripe customer id (cus_...)
  status                text not null,              -- active | trialing | past_due | canceled | ...
  price_id              text,                       -- which tier (Group / Premium)
  current_period_end    timestamptz,
  cancel_at_period_end  boolean default false,
  updated_at            timestamptz default now()
);

-- RLS on: only the owner can read their own subscription from the client.
-- The webhook writes with the service-role key, which bypasses RLS.
alter table public.subscriptions enable row level security;

create policy "users read own subscription"
  on public.subscriptions for select
  using (auth.uid()::text = user_id);
