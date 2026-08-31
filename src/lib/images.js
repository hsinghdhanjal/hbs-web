import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "site-images";

/** Read all image slots. Runs as anon or authenticated (RLS allows both to select). */
export async function listImages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("slot_key", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fast lookup map keyed by slot_key. Used by public site pages. */
export async function getImageMap() {
  const rows = await listImages();
  const map = {};
  for (const r of rows) map[r.slot_key] = r;
  return map;
}

export async function getImage(slotKey) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_images").select("*").eq("slot_key", slotKey).maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

/**
 * Upload a file to storage under `site-images/<slot_key>/<uuid>.<ext>`,
 * update the site_images row with the storage_path + public_url,
 * and delete the previously-stored file (if any).
 *
 * Uses the service-role client for storage writes when configured, to avoid
 * RLS on storage.objects needing exact session propagation from the client.
 */
export async function uploadImageForSlot({ slotKey, file }) {
  const admin = createAdminClient();
  const supabase = await createClient();
  const rw = admin ?? supabase; // fallback to authenticated client

  const { data: existing, error: exErr } = await supabase
    .from("site_images")
    .select("*")
    .eq("slot_key", slotKey)
    .maybeSingle();
  if (exErr) throw new Error(exErr.message);
  if (!existing) throw new Error(`Unknown image slot: ${slotKey}`);

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `${slotKey}/${filename}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await rw.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

  const { data: pub } = rw.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  const patch = {
    storage_path: path,
    public_url: publicUrl,
    original_filename: file.name,
    size_bytes: file.size,
    mime_type: file.type || null,
  };

  const { data: updated, error: updErr } = await supabase
    .from("site_images")
    .update(patch)
    .eq("id", existing.id)
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

/** Detach the image from a slot (removes the file from storage, clears the metadata columns). */
export async function clearImageForSlot(slotKey) {
  const admin = createAdminClient();
  const supabase = await createClient();
  const rw = admin ?? supabase;

  const { data: existing, error: exErr } = await supabase
    .from("site_images")
    .select("*")
    .eq("slot_key", slotKey)
    .maybeSingle();
  if (exErr) throw new Error(exErr.message);
  if (!existing) throw new Error(`Unknown image slot: ${slotKey}`);

  if (existing.storage_path) {
    await rw.storage.from(BUCKET).remove([existing.storage_path]).catch(() => undefined);
  }

  const { data: updated, error: updErr } = await supabase
    .from("site_images")
    .update({
      storage_path: null,
      public_url: null,
      original_filename: null,
      size_bytes: null,
      mime_type: null,
      width: null,
      height: null,
    })
    .eq("id", existing.id)
    .select("*")
    .single();
  if (updErr) throw new Error(updErr.message);
  return updated;
}

/** Rename/change the label of an image slot (metadata only). */
export async function renameImageSlot(slotKey, label) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_images")
    .update({ label })
    .eq("slot_key", slotKey)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}
