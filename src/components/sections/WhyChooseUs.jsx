import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { WHY_US } from "@/data/site";

export default function WhyChooseUs() {
  return (
    <section
      data-testid="why-us-section"
      className="bg-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container">
        <Reveal>
          <SectionLabel>Why Clients Choose Us</SectionLabel>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6 mb-16 items-end">
          <Reveal delay={1} className="lg:col-span-7">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1E1E1E] leading-[1.05] tracking-tight">
              Hired for the<br />
              <span className="italic text-[#C9A66B]">hard ones.</span><br />
              Retained for the rest.
            </h2>
          </Reveal>
          <Reveal delay={2} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[#3A3A3A] leading-relaxed">
              Our clients often come to us with the projects others have
              declined — and stay with us for everything that follows.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E5E2DC] border border-[#E5E2DC]">
          {WHY_US.map((w, i) => (
            <Reveal
              key={w.title}
              delay={i}
              className="bg-[#F8F7F4] p-8 md:p-12 group"
            >
              <span className="font-display text-[#C9A66B] text-2xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-2xl md:text-3xl text-[#1E1E1E] leading-tight">
                {w.title}
              </h3>
              <p className="mt-4 text-[#3A3A3A] leading-relaxed">{w.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
