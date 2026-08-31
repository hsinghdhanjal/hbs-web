import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { PHILOSOPHY } from "@/data/site";

export default function Philosophy() {
  return (
    <section
      data-testid="philosophy-section"
      className="bg-[#1E1E1E] text-[#F8F7F4] py-24 md:py-36 relative overflow-hidden"
    >
      <div className="hab-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel light>Our Philosophy</SectionLabel>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                Six quiet principles<br />
                behind every project<br />
                <span className="italic text-[#C9A66B]">we deliver.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={2}>
              <p className="text-[#F8F7F4]/75 leading-relaxed">
                We don&apos;t chase trends. We design and build for the long arc —
                buildings that age with grace, adapt with life, and demand less
                of you over time.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#F8F7F4]/10 border border-[#F8F7F4]/10">
          {PHILOSOPHY.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i}
              className="bg-[#1E1E1E] p-8 md:p-10 group relative"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[#C9A66B] text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl text-[#F8F7F4]">{p.title}</h3>
              </div>
              <p className="mt-5 text-[#F8F7F4]/70 leading-relaxed text-sm md:text-base">
                {p.body}
              </p>
              <div className="absolute left-0 right-0 bottom-0 h-px bg-[#C9A66B] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
