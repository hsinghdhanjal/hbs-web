import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";

export default function FounderMessage() {
  return (
    <section
      data-testid="founder-section"
      className="bg-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionLabel>A Note From The Founder</SectionLabel>
          </Reveal>
          <Reveal delay={1} className="mt-8">
            <p className="font-display text-2xl md:text-3xl leading-snug text-[#1E1E1E]">
              &ldquo;We are builders known not only for creating spaces — but for solving the
              challenges others avoid.&rdquo;
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 space-y-6 text-[#3A3A3A] text-base md:text-lg leading-relaxed">
          <Reveal delay={2}>
            <p>
              Eighteen years of practice across Punjab has taught us that a great
              building is not made on paper — it is made on site. In the discipline of
              specification. In the patience of approvals. In the small detailing decisions
              no client will ever see.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <p>
              We take pride in the projects that arrive with complications — heritage
              constraints, regulatory complexity, tight sites, ageing structures. These
              are the projects that define a practice. And these are the projects we
              quietly love.
            </p>
          </Reveal>
          <Reveal delay={4}>
            <div className="pt-6 mt-2 border-t border-[#E5E2DC] flex items-end justify-between">
              <div>
                <p className="font-display text-xl text-[#1E1E1E] italic">
                  — The Founder
                </p>
                <p className="hab-overline mt-2">Harsimran Architects & Builders</p>
              </div>
              <p className="hab-overline hidden md:block">
                Amritsar · Dera Beas · Gurdaspur
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
