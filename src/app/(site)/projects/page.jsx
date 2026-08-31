import PageHeader from "@/components/ui-bits/PageHeader";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ContactCTA from "@/components/sections/ContactCTA";
import { listPublishedProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects — Harsimran Architects & Builders",
  description:
    "A curated selection of 70+ projects across Amritsar, Dera Beas and Gurdaspur — commercial complexes, heritage projects, retail interiors, factories and premium residences.",
};

async function getProjects() {
  try {
    return await listPublishedProjects();
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main data-testid="projects-page">
      <PageHeader
        overline="Projects · Selected Work"
        title={
          <>
            70+ delivered.<br />
            <span className="italic text-[#C9A66B]">Quietly built.</span>
          </>
        }
        lead="A curated selection from our work across Amritsar, Dera Beas and Gurdaspur — spanning commercial complexes, heritage projects, retail interiors, factories and premium residences."
      />
      <FeaturedProjects projects={projects} />
      <ContactCTA />
    </main>
  );
}
