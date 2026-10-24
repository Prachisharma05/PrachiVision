import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ContentCard } from "@/components/content-card";
import { getPortfolioContent, published } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/research" }, title: "Research", description: "Research papers, technical studies, and ongoing investigations by Prachi Sharma." };
export const revalidate = 60;

export default async function ResearchPage() {
  const content = await getPortfolioContent();
  const papers = published(content.papers);
  const researchProjects = published(content.projects).filter((item) => item.category?.toLowerCase().includes("research"));
  return <><PageIntro eyebrow="RESEARCH" title="Questions, experiments, evidence, and technical writing." description="Investigations into image restoration, multimodal representations, and adaptive learning." /><section className="section"><div className="shell">
    {papers.length ? <div className="content-grid">{papers.map((paper) => <ContentCard key={paper.id} item={paper} href={`/research/${paper.slug}`} />)}</div> : null}
    {researchProjects.length ? <div style={{ marginTop: 70 }}><div className="section-heading"><div><span className="eyebrow">RELATED STUDIES</span><h2>Research-oriented project work.</h2></div></div><div className="content-grid">{researchProjects.map((item) => <ContentCard key={item.id} item={item} href={`/projects/${item.slug}`} />)}</div></div> : null}
  </div></section></>;
}
