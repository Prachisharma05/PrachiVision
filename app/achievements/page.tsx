import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ContentCard } from "@/components/content-card";
import { getPortfolioContent, published } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/achievements" }, title: "Achievements", description: "Certifications, events, awards, and learning milestones from Prachi Sharma." };
export const revalidate = 60;

export default async function AchievementsPage() {
  const content = await getPortfolioContent();
  const certificates = published(content.certificates);
  const events = published(content.events);
  return <><PageIntro eyebrow="ACHIEVEMENTS" title="Learning documented. Milestones made visible." description="Certifications, awards, organized events, and the evidence behind continuous technical growth." />
    {certificates.length > 0 && <section className="section"><div className="shell"><div className="section-heading"><div><span className="eyebrow">CERTIFICATIONS</span><h2>Formal learning and technical foundations.</h2></div></div><div className="content-grid">{certificates.map((item) => <ContentCard item={item} href={`/achievements/${item.slug}`} key={item.id} />)}</div></div></section>}
    {events.length > 0 && <section className="section section-tint"><div className="shell"><div className="section-heading"><div><span className="eyebrow">EVENTS & AWARDS</span><h2>Community work and recognized outcomes.</h2></div></div>{events.length ? <div className="content-grid">{events.map((item) => <ContentCard item={item} href={`/achievements/${item.slug}`} key={item.id} />)}</div> : null}</div></section>}
  </>;
}
