-- Site Settings (contact + address details) — admin-managed singleton row,
-- editable from /admin/profile ("Edit Profile"). Previously the hardcoded
-- CONTACT object in src/data/site.js.
-- Idempotent, safe to re-run. Apply via the Supabase SQL editor.
-- Depends on public.set_updated_at() from 0003_site_images.sql.

create table if not exists public.site_settings (
  id                int primary key default 1,
  phone_display     text not null default '',
  phone_e164        text not null default '',
  whatsapp_e164     text not null default '',
  whatsapp_message  text not null default '',
  email             text not null default '',
  address           text not null default '',
  hours             text not null default '',
  updated_at        timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

alter table public.site_settings enable row level security;

drop policy if exists "anon can read site settings"           on public.site_settings;
drop policy if exists "authenticated can read site settings"  on public.site_settings;
drop policy if exists "authenticated can update site settings" on public.site_settings;

-- Public site needs to read contact details (anon) — phone, email, address, hours.
create policy "anon can read site settings"           on public.site_settings for select to anon           using (true);
create policy "authenticated can read site settings"  on public.site_settings for select to authenticated  using (true);
create policy "authenticated can update site settings" on public.site_settings for update to authenticated  using (id = 1) with check (id = 1);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute procedure public.set_updated_at();

-- Seed the single settings row from the previously-hardcoded CONTACT object
-- in src/data/site.js, once, so the site keeps showing the same details.
insert into public.site_settings (id, phone_display, phone_e164, whatsapp_e164, whatsapp_message, email, address, hours) values
  (1, '+91 98XX XXX XXX', '+919800000000', '919800000000',
   'Hello Harsimran Architects & Builders, I would like to discuss a project.',
   'contact@harsimranbuilders.in', 'Amritsar, Punjab — India', 'Mon — Sat · 10:00 — 19:00')
on conflict (id) do nothing;
