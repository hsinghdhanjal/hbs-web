import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { SERVICES } from "@/data/site";

export default function ServicesGrid() {
  return (
    <section
      data-testid="services-section"
      className="bg-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel>What We Do</SectionLabel>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#1E1E1E]">
                A complete<br />
                practice — from<br />
                <span className="italic text-[#C9A66B]">brief to handover.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={2}>
              <p className="text-[#3A3A3A] leading-relaxed">
                Architecture, construction, interiors, approvals and project
                management — engineered to work together under one
                accountable team.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <Link
                href="/services"
                data-testid="services-view-all"
                className="hab-link mt-6 inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase font-medium text-[#1E1E1E]"
              >
                Explore Services <ArrowUpRight size={16} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E2DC] border border-[#E5E2DC]">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i % 6}
              className="bg-[#F8F7F4] p-8 md:p-10 group cursor-default relative transition-colors duration-500 hover:bg-white"
              data-testid={`service-card-${s.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-[#C9A66B] text-xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.25}
                  className="text-[#1E1E1E] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                />
              </div>
              <h3 className="mt-10 font-display text-2xl md:text-[1.7rem] text-[#1E1E1E] leading-tight">
                {s.title}
              </h3>
              <p className="mt-4 text-sm md:text-base text-[#3A3A3A] leading-relaxed">
                {s.short}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
