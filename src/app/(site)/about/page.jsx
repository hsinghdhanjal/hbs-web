import PageHeader from "@/components/ui-bits/PageHeader";
import FounderMessage from "@/components/sections/FounderMessage";
import Philosophy from "@/components/sections/Philosophy";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ServiceAreas from "@/components/sections/ServiceAreas";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata = {
  title: "About",
  description:
    "About Harsimran Architects & Builders (HBS) — a premium architecture and construction practice rooted in Punjab, known for integrity, government approval expertise and the courage to take on projects others avoid.",
  keywords: [
    "About Harsimran Architects and Builders",
    "Harsimran Builders company",
    "HBS Amritsar about",
  ],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main data-testid="about-page">
      <PageHeader
        overline="About · Practice"
        title={
          <>
            A Punjab practice<br />
            built on <span className="italic text-[#C9A66B]">trust.</span>
          </>
        }
        lead="Harsimran Architects & Builders is a premium architecture and construction practice rooted in Punjab — known for integrity, government approval expertise and the courage to take on projects others avoid."
      />
      <FounderMessage />
      <Philosophy />
      <WhyChooseUs />
      <ServiceAreas />
      <ContactCTA />
    </main>
  );
}
