import PageHeader from "@/components/ui-bits/PageHeader";
import { Reveal } from "@/components/ui-bits/Reveal";
import { SERVICES } from "@/data/site";
import ContactCTA from "@/components/sections/ContactCTA";
import ProcessSection from "@/components/sections/ProcessSection";

export const metadata = {
  title: "Services",
  description:
    "Architecture, construction, interiors, government approvals and project management from Harsimran Architects & Builders — one accountable team from concept to handover.",
  keywords: [
    "Harsimran Builders services",
    "architecture services Amritsar",
    "construction services Punjab",
    "turnkey construction Amritsar",
  ],
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main data-testid="services-page">
      <PageHeader
        overline="Services · Architecture & Construction"
        title={
          <>
            A full practice<br />
            under <span className="italic text-[#C9A66B]">one roof.</span>
          </>
        }
        lead="From architectural concept to handover — design, construction, interiors, approvals and project management. One team, one accountable schedule."
      />

      <section className="bg-[#F8F7F4] pb-24 md:pb-36">
        <div className="hab-container space-y-px bg-[#E5E2DC] border border-[#E5E2DC]">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i % 6}
              className="bg-[#F8F7F4] py-10 md:py-14 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 group hover:bg-white transition-colors duration-500"
              data-testid={`services-page-row-${s.id}`}
            >
              <div className="md:col-span-1 font-display text-[#C9A66B] text-2xl">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-4">
                <h2 className="font-display text-3xl md:text-4xl text-[#1E1E1E] leading-tight">
                  {s.title}
                </h2>
              </div>
              <div className="md:col-span-7 text-[#3A3A3A] leading-relaxed md:text-lg">
                {s.desc}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ProcessSection />
      <ContactCTA />
    </main>
  );
}
