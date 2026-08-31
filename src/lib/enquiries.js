import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only reads/writes against public.consultations (the public
 * enquiry/contact form table). Auth enforced by requireAuth() in the
 * calling action + RLS policies from 0002_consultations_admin.sql.
 */

export async function listEnquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateEnquiryStatus(id, status) {
  const supabase = await createClient();
  const { error } = await supabase.from("consultations").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateEnquiryNotes(id, adminNotes) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("consultations")
    .update({ admin_notes: adminNotes })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEnquiry(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("consultations").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
