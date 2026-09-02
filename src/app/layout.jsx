import "./globals.css";
import { Manrope, Playfair_Display } from "next/font/google";

import ToasterProvider from "@/components/layout/ToasterProvider";
import { SITE_URL, ORG_NAME, SEO_KEYWORDS } from "@/data/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const DEFAULT_TITLE =
  "Harsimran Architects & Builders — Designed for Living. Built for Generations.";
const DEFAULT_DESCRIPTION =
  "Premium architecture, construction and turnkey project leadership across Amritsar, Dera Beas and Gurdaspur. 70+ residential, commercial, industrial and heritage projects delivered with intelligent design and trusted execution.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${ORG_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: ORG_NAME, url: SITE_URL }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: ORG_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport = {
  themeColor: "#1E1E1E",
};

// Deliberately minimal: this is the single root layout shared by both the
// public (site) route group (Navbar/Footer) and /admin (AdminNav) — those
// live in their own nested layouts so the two headers never both render.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
