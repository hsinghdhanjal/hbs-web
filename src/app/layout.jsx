import "./globals.css";
import { Manrope, Playfair_Display } from "next/font/google";

import ToasterProvider from "@/components/layout/ToasterProvider";

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

export const metadata = {
  title:
    "Harsimran Architects & Builders — Designed for Living. Built for Generations.",
  description:
    "Premium architecture, construction and turnkey project leadership across Amritsar, Dera Beas and Gurdaspur. 70+ residential, commercial, industrial and heritage projects delivered with intelligent design and trusted execution.",
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
