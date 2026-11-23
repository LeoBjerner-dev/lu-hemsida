-- Only accounts listed in admin_users may read the answers.
-- This keeps the answers private even if someone manages to create an account
-- (for example if sign ups are switched back on by mistake).

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- The API never needs this table directly; the policy below reads it as the table owner.
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Signed-in users can read responses" on public.date_responses;
drop policy if exists "Admins can read responses" on public.date_responses;
create policy "Admins can read responses"
  on public.date_responses
  for select
  to authenticated
  using ((select public.is_admin()));

-- Add the admin after creating the user in Supabase (Authentication > Users):
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'you@example.com';
