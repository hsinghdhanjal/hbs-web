import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getContact } from "@/lib/settings";

export const metadata = {
  title: "Page not found — Harsimran Architects & Builders",
};

// Rendered directly under the root layout for any unmatched route (bypassing
// the (site) group's layout), so it brings its own Navbar/Footer to match.
export default async function NotFound() {
  const contact = await getContact();

  return (
    <>
      <Navbar contact={contact} />
      <main
        data-testid="not-found-page"
        className="min-h-[70vh] flex items-center"
      >
        <div className="hab-container py-32 text-center">
          <p className="hab-overline text-[#C9A66B]">Error · 404</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl text-[#1E1E1E] leading-[1.05]">
            This page<br />
            <span className="italic text-[#C9A66B]">was not built.</span>
          </h1>
          <p className="mt-6 text-[#3A3A3A] leading-relaxed max-w-md mx-auto">
            The page you are looking for doesn&apos;t exist or has moved. Let&apos;s
            get you back to solid ground.
          </p>
          <Link href="/" className="hab-btn-primary mt-10">
            Return Home
          </Link>
        </div>
      </main>
      <Footer contact={contact} />
    </>
  );
}
