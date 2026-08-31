"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ImagePlus, Star, Building2, UserCog, LogOut } from "lucide-react";
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
  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <header className="bg-[#1E1E1E] text-[#F8F7F4] border-b border-[#C9A66B]">
      <div className="hab-container flex flex-col md:flex-row md:items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-6 flex-wrap">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C9A66B] text-[#1E1E1E] flex items-center justify-center font-display text-lg">H</div>
            <span className="font-display text-lg tracking-tight">HAB ADMIN</span>
          </Link>
          <nav className="flex items-center gap-1">
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
        </div>

        <div className="flex items-center gap-3">
          <span className="hab-overline text-[#F8F7F4]/60 hidden sm:inline" data-testid="adminnav-email">
            {email}
          </span>
          <form action={signOutAction}>
            <button type="submit" data-testid="adminnav-signout" className="flex items-center gap-2 border border-white/40 hover:border-[#C9A66B] hover:text-[#C9A66B] px-3 py-2 hab-overline">
              <LogOut size={12} /> Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
