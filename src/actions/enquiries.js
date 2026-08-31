"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { deleteEnquiry, listEnquiries, updateEnquiryNotes, updateEnquiryStatus } from "@/lib/enquiries";

/** Admin-only — list all enquiries. */
export async function listEnquiriesAction() {
  try {
    await requireAuth();
    const data = await listEnquiries();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load enquiries." };
  }
}

/** Admin-only — update the status field. */
export async function updateEnquiryStatusAction(id, status) {
  try {
    await requireAuth();
    await updateEnquiryStatus(id, status);
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update status." };
  }
}

/** Admin-only — update internal admin notes (never shown to the customer). */
export async function updateEnquiryNotesAction(id, adminNotes) {
  try {
    await requireAuth();
    await updateEnquiryNotes(id, adminNotes);
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save notes." };
  }
}

/** Admin-only — delete an enquiry. */
export async function deleteEnquiryAction(id) {
  try {
    await requireAuth();
    await deleteEnquiry(id);
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete." };
  }
}
