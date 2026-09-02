import PageHeader from "@/components/ui-bits/PageHeader";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata = {
  title: "Contact",
  description:
    "Contact Harsimran Architects & Builders (Harsimran Builders) in Amritsar. Share a few details about your project — a senior team member will be in touch within one business day to schedule a site consultation.",
  keywords: [
    "Contact Harsimran Builders",
    "Harsimran Architects and Builders contact",
    "architects in Amritsar phone number",
  ],
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main data-testid="contact-page">
      <PageHeader
        overline="Contact · Consultation"
        title={
          <>
            Start a quiet<br />
            <span className="italic text-[#C9A66B]">conversation.</span>
          </>
        }
        lead="Share a few details about your project. A senior team member will be in touch within one business day to schedule a site consultation."
      />
      <ContactCTA />
    </main>
  );
}
