"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { submitConsultation } from "@/lib/consultations";
import { SERVICES } from "@/data/site";

const PROJECT_TYPES = [
  "Architectural Design",
  "Residential Construction",
  "Commercial Construction",
  "Turnkey Project",
  "Interior Design",
  "Renovation",
  "Industrial Project",
  "Government Approvals",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,20}$/;

const VALIDATORS = {
  name: (v) => {
    if (!v.trim()) return "Please enter your name.";
    if (v.trim().length < 2) return "Name looks too short.";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Please enter your phone number.";
    if (!PHONE_RE.test(v.trim())) return "Enter a valid phone number.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Please enter your email address.";
    if (!EMAIL_RE.test(v.trim())) return "Enter a valid email address.";
    return "";
  },
  location: (v) => {
    if (!v.trim()) return "Please enter your location.";
    return "";
  },
  project_type: (v) => {
    if (!v) return "Please select a project type.";
    return "";
  },
  message: (v) => {
    if (!v.trim()) return "Please tell us a little about your project.";
    if (v.trim().length < 10) return "Please add a few more details (at least 10 characters).";
    return "";
  },
};

const FIELDS = ["name", "phone", "email", "location", "project_type", "message"];

// Hoisted to module scope: defining this inside ConsultationForm would give
// it a fresh identity on every keystroke's re-render, causing React to
// remount the input (and drop focus) after each character typed.
function Field({ id, k, label, error, children }) {
  return (
    <div>
      <label className="hab-overline text-[#5A5A5A]" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          data-testid={`form-error-${k.replace("_", "-")}`}
          className="mt-2 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function ConsultationForm({ compact = false }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    project_type: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    if (touched[k]) {
      setErrors((prev) => ({ ...prev, [k]: VALIDATORS[k](value) }));
    }
  };

  const onBlur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((prev) => ({ ...prev, [k]: VALIDATORS[k](form[k]) }));
  };

  const validateAll = () => {
    const next = {};
    for (const k of FIELDS) {
      next[k] = VALIDATORS[k](form[k]);
    }
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateAll();
    setErrors(nextErrors);
    setTouched(Object.fromEntries(FIELDS.map((k) => [k, true])));

    const firstInvalid = FIELDS.find((k) => nextErrors[k]);
    if (firstInvalid) {
      toast.error("Please fix the highlighted fields.");
      document.getElementById(`cn-${firstInvalid.replace("_", "-")}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await submitConsultation(form);
      setDone(true);
      toast.success("Thank you — we'll reach out within one business day.");
      setForm({
        name: "",
        phone: "",
        email: "",
        location: "",
        project_type: "",
        message: "",
      });
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error(err);
      toast.error("Could not send right now. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        data-testid="consultation-success"
        className="border border-[#1E1E1E] p-10 md:p-12 bg-[#F8F7F4]"
      >
        <p className="hab-overline text-[#C9A66B]">Request Received</p>
        <h3 className="mt-4 font-display text-3xl md:text-4xl text-[#1E1E1E] leading-tight">
          Thank you.<br />
          <span className="italic">We&apos;ll be in touch shortly.</span>
        </h3>
        <p className="mt-4 text-[#3A3A3A] leading-relaxed">
          A senior team member will contact you within one business day to
          schedule your consultation.
        </p>
        <button
          onClick={() => setDone(false)}
          data-testid="consultation-reset"
          className="hab-link mt-8 text-sm tracking-[0.2em] uppercase font-medium text-[#1E1E1E]"
        >
          Send Another Request
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full bg-transparent border-b px-0 py-3 text-base text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none transition-colors duration-300";
  const inputState = (k) =>
    errors[k] ? "border-red-600 focus:border-red-600" : "border-[#1E1E1E]/30 focus:border-[#C9A66B]";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-testid="consultation-form"
      className={`${compact ? "" : "border border-[#1E1E1E] p-8 md:p-12 bg-[#F8F7F4]"}`}
    >
      {!compact && (
        <>
          <p className="hab-overline text-[#C9A66B]">Request Consultation</p>
          <h3 className="mt-4 font-display text-3xl md:text-4xl text-[#1E1E1E] leading-tight">
            Let&apos;s discuss<br />
            <span className="italic">your project.</span>
          </h3>
        </>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
        <Field id="cn-name" k="name" label="Name" error={errors.name}>
          <input
            id="cn-name"
            data-testid="form-name"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cn-name-error" : undefined}
            value={form.name}
            onChange={update("name")}
            onBlur={onBlur("name")}
            className={`${inputBase} ${inputState("name")}`}
            placeholder="Your full name"
          />
        </Field>

        <Field id="cn-phone" k="phone" label="Phone" error={errors.phone}>
          <input
            id="cn-phone"
            data-testid="form-phone"
            required
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "cn-phone-error" : undefined}
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            onBlur={onBlur("phone")}
            className={`${inputBase} ${inputState("phone")}`}
            placeholder="+91 98XXX XXXXX"
          />
        </Field>

        <Field id="cn-email" k="email" label="Email" error={errors.email}>
          <input
            id="cn-email"
            data-testid="form-email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cn-email-error" : undefined}
            type="email"
            value={form.email}
            onChange={update("email")}
            onBlur={onBlur("email")}
            className={`${inputBase} ${inputState("email")}`}
            placeholder="you@example.com"
          />
        </Field>

        <Field id="cn-location" k="location" label="Location" error={errors.location}>
          <input
            id="cn-location"
            data-testid="form-location"
            required
            aria-required="true"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "cn-location-error" : undefined}
            value={form.location}
            onChange={update("location")}
            onBlur={onBlur("location")}
            className={`${inputBase} ${inputState("location")}`}
            placeholder="Amritsar / Dera Beas / Gurdaspur"
          />
        </Field>

        <div className="md:col-span-2">
          <Field id="cn-project-type" k="project_type" label="Project Type" error={errors.project_type}>
            <select
              id="cn-project-type"
              data-testid="form-project-type"
              required
              aria-required="true"
              aria-invalid={!!errors.project_type}
              aria-describedby={errors.project_type ? "cn-project-type-error" : undefined}
              value={form.project_type}
              onChange={update("project_type")}
              onBlur={onBlur("project_type")}
              className={`${inputBase} ${inputState("project_type")} appearance-none cursor-pointer`}
            >
              <option value="">Select a service</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field id="cn-message" k="message" label="Message" error={errors.message}>
            <textarea
              id="cn-message"
              data-testid="form-message"
              required
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "cn-message-error" : undefined}
              rows={3}
              value={form.message}
              onChange={update("message")}
              onBlur={onBlur("message")}
              className={`${inputBase} ${inputState("message")} resize-none`}
              placeholder="Tell us a little about your project"
            />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        data-testid="form-submit"
        className="hab-btn-primary mt-10 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            Request Consultation
            <ArrowRight size={16} strokeWidth={1.5} />
          </>
        )}
      </button>

      <p className="mt-6 text-xs text-[#5A5A5A] leading-relaxed max-w-md">
        By submitting, you agree to be contacted by our team regarding your
        project. We respect your privacy and never share your information.
        {SERVICES.length ? "" : ""}
      </p>
    </form>
  );
}
