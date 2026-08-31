# Harsimran Architects & Builders — Web

Marketing site for Harsimran Architects & Builders, built with **Next.js (App Router)**,
Tailwind CSS, framer-motion and Supabase.

This app was migrated off the previous Create React App / Emergent setup. All
Emergent-specific tooling (visual-edits, PostHog, the Emergent badge, health-check
plugins, the FastAPI/Mongo backend) has been removed. The only backend dependency
is Supabase, used to store consultation requests submitted from the contact form.

## Stack

- Next.js 15 (App Router, JS)
- Tailwind CSS 3 + `tailwindcss-animate`
- framer-motion, lucide-react, sonner
- Supabase (`@supabase/supabase-js`)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```

Open http://localhost:3000.

## Environment variables

Set these in `.env.local` (see `.env.local.example`):

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` public key |

The site renders fine without these, but the consultation form will fail to submit
until they are configured.

## Manual steps (Supabase)

Migrations and RLS policies live in the repo, but Supabase doesn't apply them on
its own — each of these needs a manual step in your project. Skipping one is
the #1 cause of "works locally, breaks in prod" (e.g. RLS rejecting inserts, or
image uploads 404ing on a bucket that was never created).

1. **Create (or pick) a Supabase project.**
2. **Run every migration in `supabase/migrations/`, in order** (0001 → 0006) —
   either paste each file into the Supabase SQL editor, or apply them all with
   the Supabase CLI:
   ```bash
   supabase db push
   ```
   | Migration | Adds |
   | --- | --- |
   | `0001_consultations.sql` | `consultations` table — anon may **insert** (contact form), not read |
   | `0002_consultations_admin.sql` | status/notes columns + authenticated read/update/delete (admin enquiries dashboard) |
   | `0003_site_images.sql` | `site_images` table + policies (fixed image slots, e.g. the home hero) |
   | `0004_reviews.sql` | `reviews` table + policies (testimonials CMS) |
   | `0005_projects.sql` | `projects` table + policies (Projects CMS — add/edit/delete + image) |
   | `0006_site_settings.sql` | `site_settings` singleton row + policies (Edit Profile — contact/address) |

   All of these are idempotent (`create ... if not exists`, `drop policy if
   exists` then `create policy`) — safe to re-run if you're not sure whether a
   migration already applied. If you ever hit an error like *"new row violates
   row-level security policy"*, re-running the relevant migration's policy
   statements is the fix.
3. **Create the `site-images` Storage bucket** — Dashboard → Storage → New
   bucket → name it exactly `site-images` → toggle **Public bucket: ON** →
   Create. This one bucket backs **both** image features: the Site Images CMS
   (`/admin/cms`, fixed slots like the home hero) and the per-project images
   uploaded from `/admin/projects`. `0003_site_images.sql` only creates the
   `storage.objects` RLS *policies* for this bucket (public read, authenticated
   upload/update/delete) — it does not and cannot create the bucket itself, so
   this step is easy to miss. Without it, uploads fail (bucket not found).
4. **Create an admin user** — Dashboard → Authentication → Users → Add user.
   There's no public sign-up route by design; this is the only account that
   can sign in at `/admin/login` to manage enquiries, projects, images,
   reviews and the site profile.
5. **Copy the project URL and anon key into `.env.local`** (and into your
   deployment's env vars, e.g. Vercel Project Settings → Environment
   Variables). Optionally also set `SUPABASE_SERVICE_ROLE_KEY` — only needed
   so the CMS/Projects image uploads can bypass storage RLS from the server
   using the service role instead of the signed-in admin's session.

## Keeping the Supabase project awake (free tier)

Supabase's free tier auto-pauses a project after 7 days with no API activity.
`src/app/api/keepalive/route.js` runs a trivial read query against the
`consultations` table; `vercel.json` schedules Vercel Cron to hit it once a
day, which is enough to keep the project active without upgrading to Pro.

- Works out of the box once deployed to Vercel (Cron Jobs are available on
  the free Hobby plan). No action needed beyond deploying.
- Optional hardening: set a `CRON_SECRET` env var in the Vercel project —
  the route then only accepts requests carrying `Authorization: Bearer
  <CRON_SECRET>`, which is how Vercel signs its own cron invocations when
  the variable is present.
- Not deploying on Vercel? Point any external scheduler (GitHub Actions
  cron, cron-job.org, etc.) at `GET /api/keepalive` at least once every few
  days instead.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/projects` | Projects |
| `/services` | Services |
| `/about` | About |
| `/contact` | Contact |

## Project structure

```
src/
  app/                 # App Router routes + root layout + globals.css
  components/
    layout/            # Navbar, Footer, FloatingActions, ToasterProvider
    sections/          # Page sections (Hero, ConsultationForm, ...)
    ui-bits/           # Reveal (framer-motion), PageHeader
  data/site.js         # All static site content
  lib/
    supabase/client.js # Supabase browser client
    consultations.js   # submitConsultation()
    utils.js           # cn()
supabase/migrations/   # SQL schema
```
