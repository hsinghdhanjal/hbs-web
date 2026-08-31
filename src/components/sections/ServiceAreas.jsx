import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { SERVICE_AREAS } from "@/data/site";
import { MapPin } from "lucide-react";

const NOTES = {
  Amritsar: "Heritage, commercial, residential and institutional work across the city.",
  "Dera Beas": "Residential, institutional and industrial projects in and around Dera Beas.",
  Gurdaspur: "Residential, factory and approval-led builds across Gurdaspur district.",
};

export default function ServiceAreas() {
  return (
    <section
      data-testid="service-areas-section"
      className="bg-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel>Service Areas</SectionLabel>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-[#1E1E1E] leading-[1.05] tracking-tight">
                Rooted in Punjab.<br />
                <span className="italic text-[#C9A66B]">On the ground</span>, every week.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[#3A3A3A] leading-relaxed">
              We work where we can show up — in person, on site, on time. Our
              practice is concentrated across three Punjab regions, allowing
              hands-on supervision throughout construction.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5E2DC] border border-[#E5E2DC]">
          {SERVICE_AREAS.map((area, i) => (
            <Reveal
              key={area}
              delay={i}
              className="bg-[#F8F7F4] p-8 md:p-12 group"
              data-testid={`service-area-${area.toLowerCase().replace(" ", "-")}`}
            >
              <MapPin size={22} strokeWidth={1.25} className="text-[#C9A66B]" />
              <h3 className="mt-6 font-display text-3xl md:text-4xl text-[#1E1E1E]">
                {area}
              </h3>
              <p className="mt-4 text-[#3A3A3A] leading-relaxed">{NOTES[area]}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
