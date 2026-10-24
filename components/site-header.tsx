"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PortfolioContent } from "@/lib/types";

const baseNav = [
  ["/", "Home"],
  ["/about", "About"],
  ["/projects", "Projects"],
  ["/research", "Research"],
  ["/achievements", "Achievements"],
  ["/updates", "Updates"],
  ["/contact", "Contact"],
] as const;

export function SiteHeader({ profile }: { profile: PortfolioContent["profile"] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const nav = [...baseNav.slice(0, 6), ["/club", "Club"] as const, ...baseNav.slice(6)];
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${profile.name} home`}>
          {profile.logoUrl && <img className="brand-logo" src={profile.logoUrl} alt="" />}
          <span className="brand-copy"><strong>{profile.name}</strong></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([href, label]) => <Link key={href} aria-current={pathname === href ? "page" : undefined} className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""} href={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          {profile.resumeUrl ? <a className="button small secondary" href={profile.resumeUrl} target="_blank" rel="noreferrer">Resume</a> : null}
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" inert={!open} className={`mobile-nav ${open ? "open" : ""}`} aria-label="Mobile navigation">
        {nav.map(([href, label]) => <Link key={href} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "active" : ""} href={href}>{label}</Link>)}
        {profile.resumeUrl ? <a href={profile.resumeUrl} target="_blank" rel="noreferrer">Download resume</a> : null}
      </nav>
    </header>
  );
}
