"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { createReview, deleteReview, moveReview, updateReview } from "@/lib/reviews";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/reviews");
}

export async function createReviewAction(input) {
  try {
    await requireAuth();
    if (!input.author?.trim() || !input.quote?.trim()) {
      return { ok: false, error: "Author and review text are required." };
    }
    const data = await createReview(input);
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create review." };
  }
}

export async function updateReviewAction(id, patch) {
  try {
    await requireAuth();
    const data = await updateReview(id, patch);
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update review." };
  }
}

export async function deleteReviewAction(id) {
  try {
    await requireAuth();
    await deleteReview(id);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete review." };
  }
}

export async function moveReviewAction(id, direction) {
  try {
    await requireAuth();
    await moveReview(id, direction);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to reorder review." };
  }
}
