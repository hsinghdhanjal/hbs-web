import { createClient } from "@/lib/supabase/server";

/** Admin — every review, published or not, in curated order. */
export async function listReviews() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Public site — published reviews only, in curated order. */
export async function listPublishedReviews() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createReview(input) {
  const supabase = await createClient();
  const { data: maxRow } = await supabase
    .from("reviews")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? 0) + 10;

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      author: input.author.trim(),
      role: input.role?.trim() || null,
      quote: input.quote.trim(),
      rating: input.rating,
      published: input.published ?? true,
      sort_order: nextSortOrder,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateReview(id, patch) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reviews").update(patch).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteReview(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Swap sort_order with the previous/next review so the list re-orders by one place. */
export async function moveReview(id, direction) {
  const rows = await listReviews();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Review not found.");
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return; // already at the edge

  const a = rows[idx];
  const b = rows[swapIdx];
  const supabase = await createClient();
  const { error: e1 } = await supabase.from("reviews").update({ sort_order: b.sort_order }).eq("id", a.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase.from("reviews").update({ sort_order: a.sort_order }).eq("id", b.id);
  if (e2) throw new Error(e2.message);
}
