"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { clearImageForSlot, renameImageSlot, uploadImageForSlot } from "@/lib/images";
import { formatMB, isAllowedUpload, maxBytesForSlot, slotAllowsVideo } from "@/lib/media-limits";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/cms");
}

export async function uploadImageAction(formData) {
  try {
    await requireAuth();
    const slotKey = String(formData.get("slot_key") || "").trim();
    const file = formData.get("file");
    if (!slotKey) return { ok: false, error: "Missing slot key." };
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Please select a file." };

    const maxBytes = maxBytesForSlot(slotKey);
    if (file.size > maxBytes) return { ok: false, error: `File too large — ${formatMB(maxBytes)} max.` };
    if (!isAllowedUpload(file, slotKey)) {
      return {
        ok: false,
        error: slotAllowsVideo(slotKey) ? "Only image files or MP4 video are allowed." : "Only image files are allowed.",
      };
    }

    const data = await uploadImageForSlot({ slotKey, file });
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed." };
  }
}

export async function deleteImageAction(slotKey) {
  try {
    await requireAuth();
    const data = await clearImageForSlot(slotKey);
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed." };
  }
}

export async function renameImageAction(slotKey, label) {
  try {
    await requireAuth();
    const trimmed = label.trim();
    if (!trimmed) return { ok: false, error: "Label cannot be empty." };
    const data = await renameImageSlot(slotKey, trimmed);
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Rename failed." };
  }
}
