"use client";

import { useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Loader2, Lock } from "lucide-react";
import { signInAction } from "@/actions/auth";

export default function LoginForm() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/admin";
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const submit = (formData) => {
    setError("");
    formData.append("next", nextPath);
    startTransition(async () => {
      const result = await signInAction(formData);
      // signInAction redirects on success; only reaches here on error.
      if (result && !result.ok) setError(result.error || "Sign in failed.");
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="border border-[#1E1E1E] bg-white p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 bg-[#C9A66B] border border-[#1E1E1E] flex items-center justify-center">
              <Lock size={16} />
            </span>
            <div>
              <p className="hab-overline text-[#C9A66B]">Admin</p>
              <h1 className="font-display text-3xl leading-none text-[#1E1E1E]">Sign in</h1>
            </div>
          </div>

          <form action={submit} className="space-y-5">
            <label className="block">
              <span className="hab-overline font-bold">Email</span>
              <input
                required
                type="email"
                name="email"
                data-testid="admin-email-input"
                className="mt-2 w-full border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
                placeholder="you@harsimranbuilders.in"
              />
            </label>
            <label className="block">
              <span className="hab-overline font-bold">Password</span>
              <input
                required
                type="password"
                name="password"
                minLength={6}
                data-testid="admin-password-input"
                className="mt-2 w-full border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
                placeholder="Your password"
              />
            </label>

            {error && (
              <p data-testid="admin-auth-error" className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
                {error}
              </p>
            )}

            <button type="submit" disabled={pending} data-testid="admin-submit-btn" className="hab-btn-primary w-full justify-center disabled:opacity-60">
              {pending ? (<><Loader2 size={16} className="animate-spin" /> Please wait…</>) : (<>Sign in <ArrowUpRight size={16} /></>)}
            </button>
          </form>

          <div className="border-t border-[#E5E2DC] mt-6 pt-4 flex items-center justify-between text-xs hab-overline">
            <span className="text-[#5A5A5A]">Admin access is invite-only.</span>
            <Link href="/" className="hab-link text-[#1E1E1E]/70">Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
