import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { getPortfolioContent, published } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { OrbitArt } from "@/components/orbit-art";

export const metadata = { alternates: { canonical: "/" } };
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const c = await getPortfolioContent();
  const featured = published(c.projects).filter(p => p.featured);
  const latest = published(c.updates)[0];
  return <>
    <section className="hero"><div className="shell">
      <div className="hero-grid"><Reveal className="hero-copy">
        {c.profile.eyebrow && <span className="eyebrow">{c.profile.eyebrow}</span>}
        {c.profile.heroTitle && <h1 className="display">{c.profile.heroTitle.split("\n").map((line, i) => <span key={i} className={i ? "gradient-text" : ""}>{line}</span>)}</h1>}
        {c.profile.introduction && <p>{c.profile.introduction}</p>}
        <div className="hero-actions">{published(c.projects).length > 0 && <Link className="button" href="/projects">Explore my work <ArrowUpRight size={17} /></Link>}{c.profile.resumeUrl && <a className="button secondary" href={c.profile.resumeUrl} target="_blank" rel="noreferrer">Download résumé <Download size={16} /></a>}</div>
        {c.profile.availability && <span className="availability">{c.profile.availability}</span>}
      </Reveal><OrbitArt /></div>
      <div className="hero-bottom"><a href="#explore">A little further into my world <ArrowDown size={14} /></a><span>Perception <i /> Language <i /> Learning</span></div>
    </div></section>
    {latest && <section className="latest-strip"><div className="shell latest-inner"><span className="eyebrow">FIELD NOTES</span><p>{latest.title}{latest.summary && ` — ${latest.summary}`}</p><Link href={`/updates/${latest.slug}`}>Read update <ArrowUpRight size={15} /></Link></div></section>}
    <div id="explore" />
    {featured.length > 0 && <section className="section"><div className="shell"><Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>Ideas, put into motion.</h2></div><Link className="text-link" href="/projects">All projects <ArrowUpRight size={16} /></Link></Reveal><div className="project-grid">{featured.map((project, index) => <Reveal key={project.id} delay={index % 2 * .08}><ProjectCard project={project} index={index} /></Reveal>)}</div></div></section>}
    {c.skills.length > 0 && <section className="section section-tint"><div className="shell"><Reveal className="section-heading"><div><span className="eyebrow">02 / AREAS OF EXPLORATION</span><h2>Different paths.<br /><span className="muted-heading">Connected questions.</span></h2></div></Reveal><div className="domain-grid">{c.skills.map((group, index) => <Reveal key={group.id} className="domain-card" delay={index * .05}><span className="number">0{index + 1} <span aria-hidden="true">✦</span></span><div>{group.title && <h3>{group.title}</h3>}{group.description && <p>{group.description}</p>}</div></Reveal>)}</div></div></section>}
    {(c.about.heading || c.about.paragraphs.length > 0) && <section className="section"><div className="shell home-about"><Reveal><span className="eyebrow">03 / THE PERSON BEHIND THE PROJECTS</span>{c.about.heading && <h2>{c.about.heading}</h2>}<Link className="text-link" href="/about">Get to know me <ArrowUpRight size={17} /></Link></Reveal><Reveal className="prose-large" delay={.08}>{c.about.paragraphs.slice(0, 2).map(p => <p key={p}>{p}</p>)}</Reveal></div></section>}
  </>;
}
