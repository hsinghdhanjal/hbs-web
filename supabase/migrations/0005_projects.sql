-- Projects (portfolio entries) — admin-managed, shown on the public site.
-- Previously a hardcoded PROJECTS array in src/data/site.js with images bolted
-- on via fixed site_images slots; this makes both the details AND the image
-- fully editable (and addable/removable) from /admin/projects without a
-- code deploy.
-- Idempotent, safe to re-run. Apply via the Supabase SQL editor.
-- Depends on public.set_updated_at() from 0003_site_images.sql.

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category      text,
  location      text,
  year          text,
  scope         text,
  summary       text,
  storage_path  text,
  image_url     text,
  published     boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists projects_published_idx  on public.projects (published);
create index if not exists projects_sort_order_idx on public.projects (sort_order);
create index if not exists projects_slug_idx       on public.projects (slug);

alter table public.projects enable row level security;

drop policy if exists "anon can read published projects"  on public.projects;
drop policy if exists "authenticated can read projects"    on public.projects;
drop policy if exists "authenticated can insert projects"  on public.projects;
drop policy if exists "authenticated can update projects"  on public.projects;
drop policy if exists "authenticated can delete projects"  on public.projects;

-- Public site only ever needs the published ones.
create policy "anon can read published projects" on public.projects for select to anon           using (published = true);
create policy "authenticated can read projects"   on public.projects for select to authenticated  using (true);
create policy "authenticated can insert projects" on public.projects for insert to authenticated  with check (true);
create policy "authenticated can update projects" on public.projects for update to authenticated  using (true) with check (true);
create policy "authenticated can delete projects" on public.projects for delete to authenticated  using (true);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

-- Seed from the previously-hardcoded PROJECTS array in src/data/site.js,
-- once, so the site keeps showing the same projects after cutting over.
do $$
begin
  if not exists (select 1 from public.projects) then
    insert into public.projects (slug, name, category, location, year, scope, summary, image_url, sort_order) values
      ('bhandari-shoe-company-complex', 'Bhandari Shoe Company Complex', 'Commercial Complex', 'Amritsar', '2022', 'Architecture · Structure · Façade',
       'A flagship commercial complex anchoring a heritage retail brand — designed for retail flow, brand presence and decades of low-maintenance service life.',
       'https://images.unsplash.com/photo-1621831337128-35676ca30868?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDB8fHx8MTc4MTg5MzYyNnww&ixlib=rb-4.1.0&q=85',
       10),
      ('binny-products-bagstore', 'Binny Products Bagstore', 'Retail Interior', 'Amritsar', '2023', 'Interior · Visual Merchandising',
       'A modern, material-led retail interior that lets product become the protagonist — engineered for daily wear, easy reconfiguration and a quietly premium feel.',
       'https://images.unsplash.com/photo-1511317559916-56d5ddb62563?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXRhaWwlMjBzdG9yZSUyMGludGVyaW9yfGVufDB8fHx8MTc4MTg5MzYyNnww&ixlib=rb-4.1.0&q=85',
       20),
      ('durgiana-mandir-complex', 'Durgiana Mandir Complex', 'Heritage / Institutional', 'Amritsar', '2021', 'Heritage Detailing · Approvals',
       'Heritage-sensitive construction and approvals work delivered with restraint — respecting cultural significance while meeting modern compliance.',
       'https://images.unsplash.com/photo-1561042771-abb14f50b8f4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoZXJpdGFnZSUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODE4OTM2MjZ8MA&ixlib=rb-4.1.0&q=85',
       30),
      ('life-bakery-interior', 'Life Bakery Interior', 'Hospitality Interior', 'Amritsar', '2023', 'Interior · Lighting · Joinery',
       'A warm, daylight-driven bakery environment — bespoke joinery, honest materials and a layout calibrated for service flow and customer dwell time.',
       'https://images.unsplash.com/photo-1587241321921-91a834d6d191?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWtlcnklMjBpbnRlcmlvcnxlbnwwfHx8fDE3ODE4OTM2MjZ8MA&ixlib=rb-4.1.0&q=85',
       40),
      ('gauri-shankar-factory', 'Gauri Shankar Factory', 'Industrial', 'Gurdaspur', '2020', 'Industrial Build · Approvals',
       'An industrial facility designed around workflow, future expansion and statutory compliance — delivered turnkey, from drawings to commissioning.',
       'https://images.unsplash.com/photo-1716643863806-989dd76ae093?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmR1c3RyaWFsJTIwZmFjdG9yeXxlbnwwfHx8fDE3ODE4OTM2MjZ8MA&ixlib=rb-4.1.0&q=85',
       50);
  end if;
end $$;
