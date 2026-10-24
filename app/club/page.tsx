import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { MediaGallery } from "@/components/media-gallery";
import { getPortfolioContent } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/club" }, title: "Club" };
export default async function ClubPage() {
 const { club } = await getPortfolioContent();
 return <><PageIntro eyebrow="CLUB & COMMUNITY" title={club.enabled ? club.name : "Club & community"} description={club.enabled ? club.summary : undefined} />{club.enabled && <section className="section"><div className="shell case-layout">{(club.role || club.links.length > 0) && <aside className="case-aside">{club.role && <h2>{club.role}</h2>}<div className="link-panel">{club.links.map(l => <a className="button secondary" href={l.url} target="_blank" rel="noreferrer" key={l.id}>{l.label}</a>)}</div></aside>}<div className="prose-large">{club.description && <p>{club.description}</p>}<MediaGallery media={club.media} /></div></div></section>}</>;
}
