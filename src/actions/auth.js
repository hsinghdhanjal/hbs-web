"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin sign-in with email/password. There is NO public sign-up route —
 * admins are provisioned manually in Supabase Dashboard → Authentication → Users.
 */
export async function signInAction(formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/admin");

  if (!email || !password) {
    return { ok: false, error: "Email and password required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin", "layout");
  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
