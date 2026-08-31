"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { updateSettings } from "@/lib/settings";

export async function updateSettingsAction(patch) {
  try {
    await requireAuth();
    if (!patch.email?.trim()) {
      return { ok: false, error: "Email is required." };
    }
    const data = await updateSettings(patch);
    revalidatePath("/", "layout");
    revalidatePath("/admin/profile");
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save profile." };
  }
}
