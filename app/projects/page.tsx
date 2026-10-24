import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { getPortfolioContent, published } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/projects" }, title: "Projects", description: "Computer vision, multimodal AI, reinforcement learning, and applied AI projects by Prachi Sharma." };
export const revalidate = 60;

export default async function ProjectsPage() {
  const content = await getPortfolioContent();
  const projects = published(content.projects);
  return <><PageIntro eyebrow="PROJECTS" title="Exploring ideas through code and experiments." description="Computer vision, multimodal understanding, reinforcement learning, and applied AI." /><section className="section"><div className="shell"><div className="project-grid">{projects.map((project, index) => <Reveal key={project.id} delay={(index % 2) * .05}><ProjectCard project={project} index={index} /></Reveal>)}</div></div></section></>;
}
