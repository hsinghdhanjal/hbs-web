import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/ui-bits/Reveal";
import { PROJECTS as FALLBACK_PROJECTS } from "@/data/site";

// Asymmetric bento grid layout per project index (cycles for longer lists)
const LAYOUT = [
  "lg:col-span-7 lg:row-span-2 aspect-[4/5] lg:aspect-auto",
  "lg:col-span-5 aspect-[4/3]",
  "lg:col-span-5 aspect-[4/3]",
  "lg:col-span-6 aspect-[4/3]",
  "lg:col-span-6 aspect-[4/3]",
];

export default function FeaturedProjects({ projects }) {
  const list = projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;
  return (
    <section
      id="projects"
      data-testid="featured-projects-section"
      className="bg-[#F8F7F4] py-24 md:py-36"
    >
      <div className="hab-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel>Featured Projects</SectionLabel>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#1E1E1E]">
                Built. Approved.<br />
                <span className="italic text-[#C9A66B]">Lived in.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={2}>
              <p className="text-[#3A3A3A] leading-relaxed">
                A small selection from 70+ delivered projects across commercial,
                residential, heritage and industrial work in Punjab.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <Link
                href="/projects"
                data-testid="projects-view-all"
                className="hab-link mt-6 inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase font-medium text-[#1E1E1E]"
              >
                View All Projects <ArrowUpRight size={16} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {list.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={i}
              className={`${LAYOUT[i % LAYOUT.length]} relative group overflow-hidden bg-[#1E1E1E]`}
              data-testid={`project-card-${p.slug}`}
            >
              <img
                src={p.image_url || p.image}
                alt={p.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/30 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 text-[#F8F7F4]">
                <div className="flex items-start justify-between">
                  <span className="hab-overline text-[#C9A66B]">{p.category}</span>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.25}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl lg:text-4xl leading-tight">
                    {p.name}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-[0.18em] uppercase text-[#F8F7F4]/75">
                    <span>{p.location}</span>
                    <span className="w-1 h-1 bg-[#C9A66B] rounded-full" />
                    <span>{p.year}</span>
                    <span className="w-1 h-1 bg-[#C9A66B] rounded-full hidden md:inline-block" />
                    <span className="hidden md:inline">{p.scope}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
