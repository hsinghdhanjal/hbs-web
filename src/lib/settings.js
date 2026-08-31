import { createClient } from "@/lib/supabase/server";
import { CONTACT } from "@/data/site";

function toContactShape(row) {
  return {
    phoneDisplay: row.phone_display,
    phoneE164: row.phone_e164,
    whatsappE164: row.whatsapp_e164,
    whatsappMessage: row.whatsapp_message,
    email: row.email,
    city: row.address,
    hours: row.hours,
    updatedAt: row.updated_at,
  };
}

/** Admin — the raw settings row (snake_case columns), for the edit form. */
export async function getSettingsRow() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Public site — contact/address details shaped like the old hardcoded
 * CONTACT object in src/data/site.js, so callers don't need to change.
 * Falls back to the static defaults if Supabase isn't configured yet or
 * the settings row is missing.
 */
export async function getContact() {
  try {
    const row = await getSettingsRow();
    if (!row) return CONTACT;
    return { ...CONTACT, ...toContactShape(row) };
  } catch {
    return CONTACT;
  }
}

export async function updateSettings(patch) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").update(patch).eq("id", 1).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}
