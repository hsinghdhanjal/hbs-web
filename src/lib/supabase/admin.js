import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin client using the SERVICE ROLE key.
 * Bypasses Row Level Security. NEVER expose this to the browser.
 * Only import inside server-only files (actions/, app/, src/lib/).
 *
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is not configured — most
 * flows work fine via the regular server client + RLS.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
