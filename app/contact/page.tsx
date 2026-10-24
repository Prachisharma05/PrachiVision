import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getPortfolioContent } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/contact" }, title: "Contact" };
export default async function ContactPage() {
 const { profile } = await getPortfolioContent();
 return <section className="section"><div className={`shell contact-grid ${!profile.email ? "contact-solo" : ""}`}><aside className="contact-aside"><span className="eyebrow">CONTACT</span><h1>Every connection starts<br /><span className="gradient-text">with a hello.</span></h1>
 <div className="contact-links">{profile.email && <a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={17} /></a>}{profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}<Phone size={17} /></a>}{profile.socials.map(s => <a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.label}<ArrowUpRight size={17} /></a>)}{profile.location && <div><span>{profile.location}</span><MapPin size={17} /></div>}</div></aside>{profile.email && <ContactForm email={profile.email} />}</div></section>;
}
