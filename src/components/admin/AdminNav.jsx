"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ImagePlus, Star, Building2, UserCog, LogOut, Menu, X } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Enquiries", icon: LayoutDashboard, testid: "adminnav-enquiries" },
  { href: "/admin/projects", label: "Projects", icon: Building2, testid: "adminnav-projects" },
  { href: "/admin/cms", label: "Site Images", icon: ImagePlus, testid: "adminnav-cms" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, testid: "adminnav-reviews" },
  { href: "/admin/profile", label: "Edit Profile", icon: UserCog, testid: "adminnav-profile" },
];

export default function AdminNav({ email }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="bg-[#1E1E1E] text-[#F8F7F4] border-b border-[#C9A66B]">
      <div className="hab-container flex items-center justify-between gap-3 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C9A66B] text-[#1E1E1E] flex items-center justify-center font-display text-lg">H</div>
          <span className="font-display text-lg tracking-tight">HAB ADMIN</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                data-testid={l.testid}
                className={cn(
                  "flex items-center gap-2 hab-overline px-3 py-2 transition-colors",
                  isActive(l.href) ? "bg-[#C9A66B] text-[#1E1E1E]" : "text-[#F8F7F4] hover:bg-white/10",
                )}
              >
                <Icon size={14} />
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right cluster */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="hab-overline text-[#F8F7F4]/60" data-testid="adminnav-email">
            {email}
          </span>
          <form action={signOutAction}>
            <button type="submit" data-testid="adminnav-signout" className="flex items-center gap-2 border border-white/40 hover:border-[#C9A66B] hover:text-[#C9A66B] px-3 py-2 hab-overline">
              <LogOut size={12} /> Sign out
            </button>
          </form>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle admin menu"
          aria-expanded={open}
          data-testid="adminnav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex items-center justify-center w-10 h-10 text-[#F8F7F4]"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="lg:hidden border-t border-white/10" data-testid="adminnav-mobile-menu">
          <div className="hab-container py-4 flex flex-col gap-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  data-testid={`mobile-${l.testid}`}
                  className={cn(
                    "flex items-center gap-3 hab-overline px-3 py-3 transition-colors",
                    isActive(l.href) ? "bg-[#C9A66B] text-[#1E1E1E]" : "text-[#F8F7F4] hover:bg-white/10",
                  )}
                >
                  <Icon size={16} />
                  {l.label}
                </Link>
              );
            })}

            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-3">
              <span className="hab-overline text-[#F8F7F4]/60 truncate" data-testid="adminnav-mobile-email">
                {email}
              </span>
              <form action={signOutAction}>
                <button type="submit" data-testid="mobile-adminnav-signout" className="flex items-center justify-center gap-2 w-full border border-white/40 hover:border-[#C9A66B] hover:text-[#C9A66B] px-3 py-3 hab-overline whitespace-nowrap">
                  <LogOut size={12} /> Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
