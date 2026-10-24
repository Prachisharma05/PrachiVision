import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ContentCard } from "@/components/content-card";
import { getPortfolioContent, published } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/updates" }, title: "Updates", description: "Recent project, research, and learning updates from Prachi Sharma." };
export const revalidate = 60;

export default async function UpdatesPage() {
  const updates = published((await getPortfolioContent()).updates);
  return <><PageIntro eyebrow="LATEST UPDATES" title="Progress is a sequence, not a single launch." description="A chronological record of new builds, achievements, research progress, and learning milestones." /><section className="section"><div className="shell"><div className="content-grid">{updates.map((item) => <ContentCard key={item.id} item={item} href={`/updates/${item.slug}`} />)}</div></div></section></>;
}
