-- Luana's answers to the date invitation.
-- Anonymous visitors (Luana) may only INSERT. Only signed-in users (Leo) may SELECT.
-- Nobody can UPDATE or DELETE through the API.

create table if not exists public.date_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null,
  time_preference text not null check (time_preference in ('lunch', 'dinner')),
  food text not null check (food in ('fish', 'meat', 'surprise')),
  drinks text not null check (drinks in ('red_wine', 'white_wine', 'cava', 'cocktail', 'no_alcohol')),
  dessert text not null check (dessert in ('yes', 'share', 'no')),
  allergies text not null default '' check (char_length(allergies) <= 600),
  dress_code text not null check (dress_code in ('elegant', 'casual', 'surprise')),
  message text not null default '' check (char_length(message) <= 600)
);

create index if not exists date_responses_created_at_idx on public.date_responses (created_at desc);

alter table public.date_responses enable row level security;

-- Table privileges: start from nothing, then grant only what each role needs.
-- RLS policies below are the second lock on the same door.
revoke all on public.date_responses from anon, authenticated;
grant insert on public.date_responses to anon;
grant select on public.date_responses to authenticated;

drop policy if exists "Anyone can submit a response" on public.date_responses;
create policy "Anyone can submit a response"
  on public.date_responses
  for insert
  to anon
  with check (true);

drop policy if exists "Signed-in users can read responses" on public.date_responses;
create policy "Signed-in users can read responses"
  on public.date_responses
  for select
  to authenticated
  using (true);

-- No UPDATE or DELETE policies: with RLS on, both are denied for everyone using the API.
