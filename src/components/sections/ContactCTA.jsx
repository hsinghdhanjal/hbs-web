import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { SERVICE_AREAS } from "@/data/site";
import { getContact } from "@/lib/settings";
import ConsultationForm from "./ConsultationForm";

export default async function ContactCTA() {
  const CONTACT = await getContact();
  return (
    <section
      data-testid="contact-cta-section"
      id="contact"
      className="bg-[#1E1E1E] text-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionLabel light>Start a Project</SectionLabel>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Let&apos;s build<br />
              your <span className="italic text-[#C9A66B]">legacy.</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-8 text-[#F8F7F4]/75 leading-relaxed max-w-md">
              Whether you have detailed drawings or only a piece of land, the
              best place to start is a quiet conversation. Share a few details and
              a senior team member will be in touch.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-12 space-y-6">
              <div>
                <p className="hab-overline text-[#F8F7F4]/60">Call</p>
                <a
                  href={`tel:${CONTACT.phoneE164}`}
                  data-testid="contact-cta-phone"
                  className="font-display text-2xl md:text-3xl text-[#F8F7F4] hab-link"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="hab-overline text-[#F8F7F4]/60">Email</p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  data-testid="contact-cta-email"
                  className="font-display text-2xl md:text-3xl text-[#F8F7F4] hab-link"
                >
                  {CONTACT.email}
                </a>
              </div>
              <div>
                <p className="hab-overline text-[#F8F7F4]/60">Service Areas</p>
                <p className="mt-2 text-[#F8F7F4]/85">
                  {SERVICE_AREAS.join(" · ")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={2}>
            <div className="bg-[#F8F7F4] text-[#1E1E1E] p-2">
              <ConsultationForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
