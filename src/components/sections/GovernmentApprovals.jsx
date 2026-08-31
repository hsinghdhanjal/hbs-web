import Link from "next/link";
import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { Check } from "lucide-react";

const APPROVALS = [
  "Building Plan Sanctions",
  "Change of Land Use (CLU)",
  "NOC — Fire, Pollution, Aviation",
  "Completion & Occupancy Certificates",
  "Heritage & Institutional Liaison",
  "Industrial & Factory Approvals",
];

export default function GovernmentApprovals() {
  return (
    <section
      data-testid="government-approvals-section"
      className="bg-[#D9D6D0] py-24 md:py-36"
    >
      <div className="hab-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel>Government Approval Expertise</SectionLabel>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-[#1E1E1E] leading-[1.05] tracking-tight">
              The paperwork<br />
              that quietly<br />
              <span className="italic text-[#8B6E3D]">decides</span> a project.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-8 text-[#3A3A3A] leading-relaxed">
              From plan sanction to completion certificate, we manage the
              statutory dimension of construction with the same discipline we
              apply on site. The result: projects that move forward, not paperwork
              that sits still.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <Link
              href="/contact"
              data-testid="approvals-cta"
              className="hab-btn-primary mt-10"
            >
              Speak To Our Approvals Lead
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1E1E1E]/15 border border-[#1E1E1E]/15">
            {APPROVALS.map((a, i) => (
              <Reveal
                key={a}
                delay={i}
                className="bg-[#D9D6D0] p-6 md:p-7 flex items-start gap-4 hover:bg-[#F8F7F4] transition-colors duration-500"
              >
                <span className="mt-1 flex items-center justify-center w-7 h-7 border border-[#1E1E1E] text-[#1E1E1E] shrink-0">
                  <Check size={14} strokeWidth={2} />
                </span>
                <div>
                  <p className="font-display text-lg md:text-xl text-[#1E1E1E] leading-snug">
                    {a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
