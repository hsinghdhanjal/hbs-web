"use client";
import { useState, useEffect } from "react";
import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { TESTIMONIALS } from "@/data/site";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";

export default function Testimonials({ reviews }) {
  const list = reviews && reviews.length > 0 ? reviews : TESTIMONIALS;
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % list.length), 7000);
    return () => clearInterval(id);
  }, [list.length]);
  const t = list[i % list.length];
  return (
    <section
      data-testid="testimonials-section"
      className="bg-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container">
        <Reveal>
          <SectionLabel>Voices</SectionLabel>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <Reveal delay={1} className="lg:col-span-1">
            <Quote size={48} strokeWidth={1} className="text-[#C9A66B]" />
          </Reveal>
          <div className="lg:col-span-10">
            <Reveal key={i} delay={0}>
              <blockquote
                data-testid="testimonial-quote"
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1E1E1E] leading-[1.15] tracking-tight"
              >
                {t.quote}
              </blockquote>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
                <p className="hab-overline text-[#1E1E1E]">{t.name}</p>
                <span className="w-1 h-1 rounded-full bg-[#C9A66B]" />
                <p className="hab-overline text-[#5A5A5A]">{t.project}</p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-[#E5E2DC] pt-6">
          <div className="flex items-center gap-3">
            {list.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Show testimonial ${idx + 1}`}
                data-testid={`testimonial-dot-${idx}`}
                className={`h-px transition-all duration-500 ${
                  idx === i ? "w-12 bg-[#1E1E1E]" : "w-6 bg-[#D9D6D0]"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              data-testid="testimonial-prev"
              onClick={() =>
                setI((v) => (v - 1 + list.length) % list.length)
              }
              className="w-11 h-11 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-[#F8F7F4] transition-colors"
              aria-label="Previous"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              data-testid="testimonial-next"
              onClick={() => setI((v) => (v + 1) % list.length)}
              className="w-11 h-11 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-[#F8F7F4] transition-colors"
              aria-label="Next"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
