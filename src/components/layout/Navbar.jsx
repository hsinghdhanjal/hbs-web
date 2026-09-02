"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { NAV_LINKS, CONTACT as CONTACT_DEFAULT } from "@/data/site";

export default function Navbar({ contact = CONTACT_DEFAULT }) {
  const CONTACT = contact;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onDarkHero = isHome && !scrolled;
  const linkBase = onDarkHero ? "text-[#F8F7F4]" : "text-[#1E1E1E]";
  const subdued = onDarkHero ? "text-[#F8F7F4]/85" : "text-[#1E1E1E]";

  // Scroll-spy: highlight whichever nav link's section is currently passing
  // through a thin band near the top of the viewport. Every page ends with
  // the Contact section, so "Contact" lights up as you scroll into it no
  // matter which route you're on. Falls back to the plain route match
  // (below) until a tracked section first comes into view.
  const isActiveLink = (to) =>
    activeSection ? NAV_LINKS.find((l) => l.sectionId === activeSection)?.to === to : to === "/" ? pathname === "/" : pathname === to;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setActiveSection(null);
    const ids = NAV_LINKS.map((l) => l.sectionId).filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveSection(topmost.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waHref = `https://wa.me/${CONTACT.whatsappE164}?text=${encodeURIComponent(
    CONTACT.whatsappMessage
  )}`;

  return (
    <header
      data-testid="site-navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-[#F8F7F4]/95 backdrop-blur-xl border-b border-[#E5E2DC]"
          : "bg-transparent"
      }`}
    >
      <div className="hab-container flex items-center justify-between h-16 md:h-20 lg:h-24">
        {/* Logo — compact monogram on mobile, full on larger screens */}
        <Link
          href="/"
          data-testid="navbar-logo"
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 leading-none ${
            open ? "text-[#1E1E1E]" : linkBase
          }`}
        >
          <span className="font-display text-xl md:text-2xl tracking-tight md:hidden">
            <span className="italic">H</span>A
            <span className="italic text-[#C9A66B]">B</span>
          </span>
          <span className="hidden md:flex md:flex-col leading-none">
            <span className="font-display text-xl md:text-2xl">Harsimran</span>
            <span
              className={`hab-overline mt-1 text-[0.6rem] ${
                open ? "text-[#5A5A5A]" : onDarkHero ? "text-[#F8F7F4]/70" : ""
              }`}
            >
              Architects & Builders
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={`hab-link text-[0.78rem] tracking-[0.22em] uppercase font-medium ${
                isActiveLink(l.to) ? "text-[#C9A66B]" : linkBase
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right cluster */}
        <div className="hidden lg:flex items-center gap-6">
          <a
            href={`tel:${CONTACT.phoneE164}`}
            data-testid="navbar-call-link"
            className={`flex items-center gap-2 text-[0.78rem] tracking-[0.18em] uppercase hover:text-[#C9A66B] transition-colors ${subdued}`}
          >
            <Phone size={14} strokeWidth={1.5} />
            {CONTACT.phoneDisplay}
          </a>
          <Link
            href="/contact"
            data-testid="navbar-consult-cta"
            className={
              onDarkHero
                ? "hab-btn-primary bg-[#C9A66B] text-[#1E1E1E] border-[#C9A66B] hover:bg-[#F8F7F4] hover:text-[#1E1E1E] hover:border-[#F8F7F4]"
                : "hab-btn-primary"
            }
          >
            Consult
          </Link>
        </div>

        {/* Mobile right cluster — quick-call + hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <a
            href={`tel:${CONTACT.phoneE164}`}
            aria-label="Call us"
            data-testid="navbar-mobile-call"
            className={`flex items-center justify-center w-10 h-10 ${
              open ? "text-[#1E1E1E]" : linkBase
            }`}
          >
            <Phone size={18} strokeWidth={1.5} />
          </a>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            data-testid="navbar-mobile-toggle"
            onClick={() => setOpen((v) => !v)}
            className={`flex items-center justify-center w-10 h-10 ${
              open ? "text-[#1E1E1E]" : linkBase
            }`}
          >
            {open ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down sheet */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-16 bg-[#F8F7F4] border-t border-[#E5E2DC] transition-opacity duration-500 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ height: "calc(100vh - 64px)", height: "calc(100svh - 64px)" }}
        data-testid="navbar-mobile-menu"
      >
        <div className="hab-container h-full overflow-y-auto py-10 flex flex-col">
          <p className="hab-overline text-[#C9A66B]">Navigate</p>
          <nav className="mt-6 flex flex-col">
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.to}
                href={l.to}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                className={`font-display text-[2.25rem] leading-[1.2] py-3 border-b border-[#E5E2DC] flex items-center justify-between transition-colors ${
                  isActiveLink(l.to) ? "text-[#C9A66B]" : "text-[#1E1E1E]"
                }`}
              >
                <span>{l.label}</span>
                <span className="hab-overline text-[#5A5A5A] text-[0.6rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10 grid grid-cols-1 gap-4">
            <Link
              href="/contact"
              data-testid="mobile-consult-cta"
              className="hab-btn-primary justify-center"
            >
              Request Consultation
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${CONTACT.phoneE164}`}
                data-testid="mobile-call-link"
                className="hab-btn-secondary justify-center"
              >
                <Phone size={14} strokeWidth={1.5} />
                Call
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="mobile-whatsapp-link"
                className="hab-btn-secondary justify-center"
              >
                <MessageCircle size={14} strokeWidth={1.5} />
                WhatsApp
              </a>
            </div>
            <p className="hab-overline text-[#5A5A5A] mt-4">
              {CONTACT.phoneDisplay}
            </p>
            <p className="text-sm text-[#5A5A5A] -mt-3">{CONTACT.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
