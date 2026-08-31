import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";

export default function PageHeader({ overline, title, lead }) {
  return (
    <section className="pt-36 md:pt-44 pb-20 md:pb-28 bg-[#F8F7F4]">
      <div className="hab-container grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8">
          <Reveal>
            <SectionLabel>{overline}</SectionLabel>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl text-[#1E1E1E] leading-[1.02] tracking-tight">
              {title}
            </h1>
          </Reveal>
        </div>
        {lead && (
          <Reveal delay={2} className="lg:col-span-4">
            <p className="text-[#3A3A3A] leading-relaxed">{lead}</p>
          </Reveal>
        )}
      </div>
      <div className="hab-container mt-16">
        <div className="hab-divider" />
      </div>
    </section>
  );
}
