"use client";

import { useState, useTransition } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { updateSettingsAction } from "@/actions/settings";
import { formatDateTime } from "@/lib/utils";

const FIELDS = [
  { key: "phone_display", label: "Phone (displayed)", placeholder: "e.g. +91 98XX XXX XXX" },
  { key: "phone_e164", label: "Phone (call / WhatsApp link, E.164)", placeholder: "e.g. +919800000000", mono: true },
  { key: "whatsapp_e164", label: "WhatsApp number (digits only)", placeholder: "e.g. 919800000000", mono: true },
  { key: "email", label: "Email", placeholder: "e.g. contact@harsimranbuilders.in" },
  { key: "address", label: "Address", placeholder: "e.g. Amritsar, Punjab — India" },
  { key: "hours", label: "Business hours", placeholder: "e.g. Mon — Sat · 10:00 — 19:00" },
];

export default function ProfileSettingsClient({ initialSettings }) {
  const [form, setForm] = useState({
    phone_display: initialSettings?.phone_display ?? "",
    phone_e164: initialSettings?.phone_e164 ?? "",
    whatsapp_e164: initialSettings?.whatsapp_e164 ?? "",
    whatsapp_message: initialSettings?.whatsapp_message ?? "",
    email: initialSettings?.email ?? "",
    address: initialSettings?.address ?? "",
    hours: initialSettings?.hours ?? "",
  });
  const [updatedAt, setUpdatedAt] = useState(initialSettings?.updated_at ?? null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (!form.email.trim()) {
      setError("Email is required.");
      setSaved(false);
      return;
    }
    setError("");
    startTransition(async () => {
      const r = await updateSettingsAction(form);
      if (r.ok && r.data) {
        setUpdatedAt(r.data.updated_at);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(r.error ?? "Failed to save profile.");
      }
    });
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F4] py-10">
      <div className="hab-container max-w-3xl">
        <div className="border-b border-[#1E1E1E] pb-6">
          <p className="hab-overline text-[#C9A66B]">Content management</p>
          <h1 className="font-display text-5xl md:text-6xl mt-2 leading-none text-[#1E1E1E]">Edit Profile</h1>
          <p className="hab-overline mt-3 text-[#5A5A5A]">
            Contact and address details shown across the site (navbar, footer, contact page).
            {updatedAt && ` Last updated ${formatDateTime(updatedAt)}.`}
          </p>
        </div>

        <div className="mt-8 bg-white border border-[#1E1E1E] p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FIELDS.map((f) => (
              <label key={f.key} className={`flex flex-col gap-2 ${f.key === "address" ? "sm:col-span-2" : ""}`}>
                <span className="hab-overline font-bold">{f.label}</span>
                <input
                  value={form[f.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  data-testid={`profile-input-${f.key}`}
                  className={`border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B] ${f.mono ? "font-mono text-sm" : ""}`}
                  placeholder={f.placeholder}
                />
              </label>
            ))}
          </div>

          <label className="flex flex-col gap-2">
            <span className="hab-overline font-bold">WhatsApp default message</span>
            <textarea
              rows={3}
              value={form.whatsapp_message}
              onChange={(e) => setForm((prev) => ({ ...prev, whatsapp_message: e.target.value }))}
              data-testid="profile-input-whatsapp_message"
              className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B] resize-y"
              placeholder="Prefilled text when a visitor taps the WhatsApp button…"
            />
          </label>

          {error && (
            <div data-testid="profile-error" className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#E5E2DC] pt-6">
            {saved ? (
              <span className="hab-overline text-[#1E1E1E] flex items-center gap-2" data-testid="profile-saved">
                <CheckCircle2 size={14} className="text-[#C9A66B]" /> Saved
              </span>
            ) : (
              <span />
            )}
            <button onClick={save} disabled={pending} data-testid="profile-save-btn" className="hab-btn-primary px-6 py-3 text-xs">
              {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
