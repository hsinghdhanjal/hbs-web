import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { getContact } from "@/lib/settings";
import { SITE_URL, ORG_NAME, ORG_ALT_NAMES, SERVICE_AREAS } from "@/data/site";

export default async function SiteLayout({ children }) {
  const contact = await getContact();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: ORG_NAME,
    alternateName: ORG_ALT_NAMES,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: contact.phoneE164,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Amritsar",
      addressRegion: "Punjab",
      addressCountry: "IN",
    },
    areaServed: SERVICE_AREAS,
    priceRange: "$$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar contact={contact} />
      {children}
      <Footer contact={contact} />
      <FloatingActions contact={contact} />
    </>
  );
}
