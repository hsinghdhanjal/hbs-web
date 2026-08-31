import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "site-images";

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(supabase, base, ignoreId) {
  let slug = base || "project";
  let n = 2;
  for (;;) {
    let query = supabase.from("projects").select("id").eq("slug", slug);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return slug;
    slug = `${base}-${n++}`;
  }
}

/** Admin — every project, published or not, in curated order. */
export async function listProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Public site — published projects only, in curated order. */
export async function listPublishedProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProject(input) {
  const supabase = await createClient();
  const { data: maxRow } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? 0) + 10;

  const baseSlug = slugify(input.slug?.trim() || input.name);
  const slug = await uniqueSlug(supabase, baseSlug);

  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug,
      name: input.name.trim(),
      category: input.category?.trim() || null,
      location: input.location?.trim() || null,
      year: input.year?.trim() || null,
      scope: input.scope?.trim() || null,
      summary: input.summary?.trim() || null,
      published: input.published ?? true,
      sort_order: nextSortOrder,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(id, patch) {
  const supabase = await createClient();
  const clean = { ...patch };
  if (clean.slug !== undefined) {
    clean.slug = await uniqueSlug(supabase, slugify(clean.slug || ""), id);
  }
  const { data, error } = await supabase.from("projects").update(clean).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProject(id) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("projects").select("storage_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (existing?.storage_path) {
    const admin = createAdminClient();
    const rw = admin ?? supabase;
    await rw.storage.from(BUCKET).remove([existing.storage_path]).catch(() => undefined);
  }
}

/** Swap sort_order with the previous/next project so the list re-orders by one place. */
export async function moveProject(id, direction) {
  const rows = await listProjects();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Project not found.");
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return; // already at the edge

  const a = rows[idx];
  const b = rows[swapIdx];
  const supabase = await createClient();
  const { error: e1 } = await supabase.from("projects").update({ sort_order: b.sort_order }).eq("id", a.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", b.id);
  if (e2) throw new Error(e2.message);
}

/**
 * Upload a file to storage under `site-images/projects/<project-id>/<uuid>.<ext>`,
 * update the project row with the storage_path + image_url, and delete the
 * previously-stored file (if any).
 */
export async function uploadProjectImage({ id, file }) {
  const admin = createAdminClient();
  const supabase = await createClient();
  const rw = admin ?? supabase;

  const { data: existing, error: exErr } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (exErr) throw new Error(exErr.message);
  if (!existing) throw new Error("Project not found.");

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `projects/${id}/${filename}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await rw.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

  const { data: pub } = rw.storage.from(BUCKET).getPublicUrl(path);
  const imageUrl = pub.publicUrl;

  const { data: updated, error: updErr } = await supabase
    .from("projects")
    .update({ storage_path: path, image_url: imageUrl })
    .eq("id", id)
    .select("*")
    .single();
  if (updErr) {
    await rw.storage.from(BUCKET).remove([path]);
    throw new Error(updErr.message);
  }

  if (existing.storage_path && existing.storage_path !== path) {
    await rw.storage.from(BUCKET).remove([existing.storage_path]).catch(() => undefined);
  }

  return updated;
}
