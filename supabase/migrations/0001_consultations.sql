-- Consultation requests submitted from the public website.
create extension if not exists "pgcrypto";

create table if not exists public.consultations (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text not null,
  email        text,
  location     text,
  project_type text,
  message      text,
  created_at   timestamptz not null default now()
);

alter table public.consultations enable row level security;

-- Allow the public (anon key) to submit a consultation, but not to read them.
-- Reading is restricted to the service role / dashboard.
drop policy if exists "Public can submit consultations" on public.consultations;
create policy "Public can submit consultations"
  on public.consultations
  for insert
  to anon, authenticated
  with check (true);
