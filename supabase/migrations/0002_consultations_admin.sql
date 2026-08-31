-- Admin management for consultations (the public "enquiry" form).
-- Adds a status workflow + internal notes, and opens up read/update/delete
-- to authenticated users (the admin) — previously only anon insert existed.
-- Idempotent, safe to re-run. Apply via the Supabase SQL editor.

alter table public.consultations
  add column if not exists status text not null default 'new'
    check (status in ('new', 'contacted', 'archived')),
  add column if not exists admin_notes text;

create index if not exists consultations_created_at_idx on public.consultations (created_at desc);
create index if not exists consultations_status_idx     on public.consultations (status);

drop policy if exists "authenticated can read consultations"   on public.consultations;
drop policy if exists "authenticated can update consultations" on public.consultations;
drop policy if exists "authenticated can delete consultations" on public.consultations;

create policy "authenticated can read consultations"   on public.consultations for select to authenticated using (true);
create policy "authenticated can update consultations" on public.consultations for update to authenticated using (true) with check (true);
create policy "authenticated can delete consultations" on public.consultations for delete to authenticated using (true);
