git branch -M main-- Reviews (client testimonials) — admin-managed, shown on the public site.
-- Previously a hardcoded TESTIMONIALS array in src/data/site.js; this makes
-- it editable from /admin/reviews without a code deploy.
-- Idempotent, safe to re-run. Apply via the Supabase SQL editor.
-- Depends on public.set_updated_at() from 0003_site_images.sql.

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  author      text not null,
  role        text,
  quote       text not null,
  rating      int not null default 5 check (rating between 1 and 5),
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists reviews_published_idx  on public.reviews (published);
create index if not exists reviews_sort_order_idx on public.reviews (sort_order);

alter table public.reviews enable row level security;

drop policy if exists "anon can read published reviews" on public.reviews;
drop policy if exists "authenticated can read reviews"   on public.reviews;
drop policy if exists "authenticated can insert reviews" on public.reviews;
drop policy if exists "authenticated can update reviews" on public.reviews;
drop policy if exists "authenticated can delete reviews" on public.reviews;

-- Public site only ever needs the published ones.
create policy "anon can read published reviews" on public.reviews for select to anon           using (published = true);
create policy "authenticated can read reviews"   on public.reviews for select to authenticated  using (true);
create policy "authenticated can insert reviews" on public.reviews for insert to authenticated  with check (true);
create policy "authenticated can update reviews" on public.reviews for update to authenticated  using (true) with check (true);
create policy "authenticated can delete reviews" on public.reviews for delete to authenticated  using (true);

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

-- Seed from the previously-hardcoded TESTIMONIALS array in src/data/site.js,
-- once, so the home page keeps showing the same reviews after cutting over.
do $$
begin
  if not exists (select 1 from public.reviews) then
    insert into public.reviews (author, role, quote, rating, sort_order) values
      ('Owner', 'Commercial Complex · Amritsar',
       'We came for a building and left with a long-term partner. The attention to approvals and ground execution was the difference between an idea and a working business.', 5, 10),
      ('Homeowner', 'Private Residence · Gurdaspur',
       'They took on a site others had refused. The clarity, paperwork and steady hand through every approval gave us a home that simply works — season after season.', 5, 20),
      ('Promoter', 'Industrial Facility · Dera Beas',
       'What stood out was the honesty. No padded estimates, no surprises on site. The factory was handed over ready to run.', 5, 30);
  end if;
end $$;
