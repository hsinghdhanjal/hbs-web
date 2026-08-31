import { supabase } from "@/lib/supabase/client";

// Fields accepted by the public consultation form. Empty values are stripped
// by the caller before this runs.
const ALLOWED_FIELDS = [
  "name",
  "phone",
  "email",
  "location",
  "project_type",
  "message",
];

export async function submitConsultation(payload) {
  const row = {};
  for (const key of ALLOWED_FIELDS) {
    if (payload[key] != null && payload[key] !== "") {
      row[key] = payload[key];
    }
  }

  // Deliberately no `.select()` here: the anon role can INSERT but has no
  // SELECT policy on this table (by design — a site visitor shouldn't be
  // able to read other people's submitted consultations). Asking Postgres
  // to return the inserted row (RETURNING) requires a passing SELECT
  // policy too, so `.select()` would fail RLS even though the insert
  // itself is allowed. The form doesn't use the returned row anyway.
  const { error } = await supabase.from("consultations").insert(row);

  if (error) {
    throw new Error(error.message || "Could not save consultation");
  }
}
