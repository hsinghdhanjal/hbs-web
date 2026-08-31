import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { HERO, STATS } from "@/data/site";

export default function IntroBlock() {
  return (
    <section
      data-testid="intro-block-section"
      className="relative bg-[#F8F7F4] py-24 md:py-36 overflow-hidden"
    >
      <div className="hab-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel>{HERO.overline}</SectionLabel>
            </Reveal>

            <Reveal delay={1}>
              <h2
                data-testid="hero-headline"
                className="mt-8 font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[1.02] tracking-tighter text-[#1E1E1E]"
              >
                Designed for Living.{" "}
                <br />
                <span className="italic text-[#C9A66B]">Built</span> for Generations.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-6 space-y-8">
            <Reveal delay={2}>
              <p className="text-base md:text-lg text-[#3A3A3A] leading-relaxed">
                {HERO.subtitle}
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  data-testid="hero-cta-primary"
                  className="hab-btn-primary"
                >
                  Request Site Consultation
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/projects"
                  data-testid="hero-cta-secondary"
                  className="hab-btn-secondary"
                >
                  View Projects
                </Link>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="flex items-center gap-4 pt-2 text-[#5A5A5A]">
                <span className="hab-overline text-[0.6rem]">Practice across</span>
                <span className="h-px flex-1 bg-[#E5E2DC]" />
                <span className="hab-overline text-[#1E1E1E] text-[0.65rem]">
                  Amritsar · Dera Beas · Gurdaspur
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E5E2DC] border border-[#E5E2DC]">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i}
              className="bg-[#F8F7F4] p-6 md:p-8"
              data-testid={`intro-stat-${i}`}
            >
              <p className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1E1E1E] leading-none tracking-tight">
                {s.value}
              </p>
              <p className="mt-4 hab-overline text-[#5A5A5A]">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
