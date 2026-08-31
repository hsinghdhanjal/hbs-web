import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { PROCESS } from "@/data/site";

export default function ProcessSection() {
  return (
    <section
      data-testid="process-section"
      className="bg-[#1E1E1E] text-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel light>How We Work</SectionLabel>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                A clear path<br />
                from drawing<br />
                to <span className="italic text-[#C9A66B]">handover.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={2}>
              <p className="text-[#F8F7F4]/75 leading-relaxed">
                Four stages, run in parallel where they should be — so design,
                approvals and construction protect each other&apos;s timelines.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#F8F7F4]/10 border border-[#F8F7F4]/10">
          {PROCESS.map((p, i) => (
            <Reveal
              key={p.no}
              delay={i}
              className="bg-[#1E1E1E] p-8 md:p-10 group relative"
            >
              <p className="font-display text-5xl md:text-6xl text-[#C9A66B] leading-none">
                {p.no}
              </p>
              <h3 className="mt-8 font-display text-2xl text-[#F8F7F4]">
                {p.title}
              </h3>
              <p className="mt-4 text-[#F8F7F4]/70 leading-relaxed text-sm md:text-base">
                {p.body}
              </p>
              <div className="absolute left-8 right-8 top-0 h-px bg-[#C9A66B] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
