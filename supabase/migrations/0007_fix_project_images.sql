-- Fix orphaned Site Images CMS slots for projects.
--
-- The Site Images editor (/admin/cms) was seeded with `project-<slug>` slots
-- (see 0003_site_images.sql) intended to hold each project's photo. But the
-- public site's Projects section actually reads `projects.image_url` — a
-- completely separate field, managed by its own uploader on /admin/projects.
-- The `project-<slug>` slots in site_images were never read by any page, so
-- uploads made there silently never appeared on the live site.
--
-- This migration:
--   1. Copies any already-uploaded `project-<slug>` image over to the real
--      projects.image_url / storage_path columns, so existing uploads show
--      up immediately.
--   2. Removes the orphaned `project-<slug>` slots from site_images —
--      project photos are edited from /admin/projects going forward.
-- Apply via the Supabase SQL editor. Idempotent, safe to re-run.

update public.projects p
set image_url = si.public_url,
    storage_path = si.storage_path
from public.site_images si
where si.slot_key = 'project-' || p.slug
  and si.public_url is not null;

delete from public.site_images where slot_key like 'project-%';
