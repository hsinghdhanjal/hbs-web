import Hero from "@/components/sections/Hero";
import IntroBlock from "@/components/sections/IntroBlock";
import FounderMessage from "@/components/sections/FounderMessage";
import Philosophy from "@/components/sections/Philosophy";
import ServicesGrid from "@/components/sections/ServicesGrid";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import GovernmentApprovals from "@/components/sections/GovernmentApprovals";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ProcessSection from "@/components/sections/ProcessSection";
import Testimonials from "@/components/sections/Testimonials";
import ServiceAreas from "@/components/sections/ServiceAreas";
import ContactCTA from "@/components/sections/ContactCTA";
import { getImageMap } from "@/lib/images";
import { listPublishedReviews } from "@/lib/reviews";
import { listPublishedProjects } from "@/lib/projects";

export const metadata = {
  alternates: { canonical: "/" },
};

// Site Images CMS, Reviews and Projects are optional — the site must render
// its hardcoded defaults untouched if Supabase isn't configured yet or the
// tables are empty.
async function getCmsData() {
  try {
    const [imageMap, reviews, projects] = await Promise.all([
      getImageMap(),
      listPublishedReviews(),
      listPublishedProjects(),
    ]);
    return {
      imageMap,
      reviews: reviews.map((r) => ({ quote: r.quote, name: r.author, project: r.role })),
      projects,
    };
  } catch {
    return { imageMap: {}, reviews: [], projects: [] };
  }
}

export default async function HomePage() {
  const { imageMap, reviews, projects } = await getCmsData();
  const heroRow = imageMap["hero-image"];
  const heroMedia = heroRow?.public_url ? { url: heroRow.public_url, mimeType: heroRow.mime_type } : null;

  return (
    <main data-testid="home-page">
      <Hero heroMedia={heroMedia} />
      <IntroBlock />
      <FounderMessage />
      <Philosophy />
      <ServicesGrid />
      <FeaturedProjects projects={projects} />
      <GovernmentApprovals />
      <WhyChooseUs />
      <ProcessSection />
      <Testimonials reviews={reviews} />
      <ServiceAreas />
      <ContactCTA />
    </main>
  );
}
