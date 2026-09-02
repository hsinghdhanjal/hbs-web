-- Site Images CMS — admin-managed image slots for the public site.
-- Ported from Signmax's site_images setup. Idempotent, safe to re-run.
-- Apply via the Supabase SQL editor.
--
-- NOTE: the `site-images` Storage bucket itself is NOT created by this
-- migration — create it manually in Supabase Dashboard → Storage
-- (name: site-images, Public bucket: on) before uploading, then the
-- policies below will apply to it.

create table if not exists public.site_images (
  id                 uuid primary key default gen_random_uuid(),
  slot_key           text unique not null,
  label              text not null,
  location           text not null,
  page               text not null,
  sort_order         int not null default 0,
  storage_path       text,
  public_url         text,
  original_filename  text,
  size_bytes         bigint,
  mime_type          text,
  width              int,
  height             int,
  updated_at         timestamptz not null default now(),
  created_at         timestamptz not null default now()
);

create index if not exists site_images_page_idx     on public.site_images (page);
create index if not exists site_images_slot_key_idx on public.site_images (slot_key);

alter table public.site_images enable row level security;

drop policy if exists "anon can read images"            on public.site_images;
drop policy if exists "authenticated can read images"   on public.site_images;
drop policy if exists "authenticated can insert images"  on public.site_images;
drop policy if exists "authenticated can update images"  on public.site_images;
drop policy if exists "authenticated can delete images"  on public.site_images;

-- Public site needs to read image URLs (anon)
create policy "anon can read images"            on public.site_images for select to anon           using (true);
create policy "authenticated can read images"   on public.site_images for select to authenticated  using (true);
create policy "authenticated can insert images" on public.site_images for insert to authenticated  with check (true);
create policy "authenticated can update images" on public.site_images for update to authenticated  using (true) with check (true);
create policy "authenticated can delete images" on public.site_images for delete to authenticated  using (true);

-- Shared updated_at trigger fn (also reused by the reviews migration).
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_images_set_updated_at on public.site_images;
create trigger site_images_set_updated_at
  before update on public.site_images
  for each row execute procedure public.set_updated_at();

-- Seed one slot per hardcoded image currently in src/data/site.js.
-- ON CONFLICT DO NOTHING so re-running is safe.
--
-- NOTE: project photos are NOT seeded here — they're managed entirely by
-- /admin/projects (projects.image_url), which has its own uploader. See
-- 0007_fix_project_images.sql for why the earlier `project-<slug>` slots
-- were removed.
insert into public.site_images (slot_key, label, location, page, sort_order) values
  ('hero-image', 'Home Hero — Background Image', 'Home / Hero section background', 'home', 10)
on conflict (slot_key) do nothing;

-- Storage policies for the `site-images` bucket (create the bucket first — see note above).
drop policy if exists "public read site-images" on storage.objects;
create policy "public read site-images"
  on storage.objects for select
  to public
  using (bucket_id = 'site-images');

drop policy if exists "authenticated can upload site-images" on storage.objects;
create policy "authenticated can upload site-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "authenticated can update site-images" on storage.objects;
create policy "authenticated can update site-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

drop policy if exists "authenticated can delete site-images" on storage.objects;
create policy "authenticated can delete site-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');
