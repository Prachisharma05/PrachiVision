import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioContent } from "@/lib/types";
export function SiteFooter({ profile }: { profile: PortfolioContent["profile"] }) {
 const hasContact = profile.email || profile.socials.length > 0 || profile.phone;
 return <footer className="site-footer"><div className="shell footer-grid"><div><span className="eyebrow">ALWAYS EXPLORING</span><h2>More questions.<br /><span className="gradient-text">New possibilities.</span></h2></div>{hasContact && <div className="footer-contact">{profile.email && <a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={16} /></a>}{profile.socials.map(s => <a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.label}<ArrowUpRight size={16} /></a>)}{profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}<ArrowUpRight size={16} /></a>}</div>}</div><div className="shell footer-bottom"><Link href="/">{profile.name}</Link><span>© {new Date().getFullYear()} · prachivision.dev</span><a href="#main-content">Back to top ↑</a></div></footer>;
}
