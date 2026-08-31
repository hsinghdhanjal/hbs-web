import Link from "next/link";
import { CONTACT as CONTACT_DEFAULT, NAV_LINKS, SERVICE_AREAS } from "@/data/site";

export default function Footer({ contact = CONTACT_DEFAULT }) {
  const CONTACT = contact;
  return (
    <footer
      data-testid="site-footer"
      className="bg-[#1E1E1E] text-[#F8F7F4] relative overflow-hidden"
    >
      <div className="hab-container pt-24 md:pt-32 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-10">
          <div className="md:col-span-6">
            <p className="hab-overline text-[#C9A66B]">Harsimran · Punjab</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-6 leading-[1.05]">
              Building<br />
              <span className="italic text-[#C9A66B]">enduring</span> spaces<br />
              across Punjab.
            </h2>
            <Link
              href="/contact"
              data-testid="footer-consult-cta"
              className="hab-btn-ghost-light mt-10"
            >
              Start a Project
            </Link>
          </div>

          <div className="md:col-span-2">
            <p className="hab-overline text-[#D9D6D0]">Navigate</p>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className="hab-link text-sm text-[#F8F7F4]/85 hover:text-[#C9A66B]"
                    data-testid={`footer-nav-${l.label.toLowerCase()}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="hab-overline text-[#D9D6D0]">Service Areas</p>
            <ul className="mt-6 space-y-3 text-sm text-[#F8F7F4]/85">
              {SERVICE_AREAS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="hab-overline text-[#D9D6D0]">Contact</p>
            <ul className="mt-6 space-y-3 text-sm text-[#F8F7F4]/85">
              <li>
                <a
                  href={`tel:${CONTACT.phoneE164}`}
                  className="hab-link"
                  data-testid="footer-phone"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hab-link"
                  data-testid="footer-email"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>{CONTACT.city}</li>
              <li className="text-[#F8F7F4]/55">{CONTACT.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-[#F8F7F4]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-[#F8F7F4]/55 tracking-[0.18em] uppercase">
          <p>© {new Date().getFullYear()} Harsimran Architects & Builders</p>
          <p>harsimranbuilders.in · All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
