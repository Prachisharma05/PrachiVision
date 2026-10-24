import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/reveal";
import { ContentCard } from "@/components/content-card";
import { getPortfolioContent, published } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/about" }, title: "About" };
export default async function AboutPage() {
 const c = await getPortfolioContent(); const education = published(c.education); const experience = published(c.experience);
 return <><PageIntro eyebrow="ABOUT ME" title={c.about.heading} description={c.profile.role} />
 {(c.about.paragraphs.length > 0 || c.profile.avatarUrl || c.about.interests.length > 0) && <section className="section"><div className="shell about-grid">
 <Reveal className="about-aside">{c.profile.avatarUrl && <div className="portrait-frame"><img src={c.profile.avatarUrl} alt={`Portrait of ${c.profile.name}`} /></div>}{c.about.interests.length > 0 && <div className="interest-panel"><span className="eyebrow">DRAWN TO</span>{c.about.interests.map((s,i) => <div key={s}><span>0{i+1}</span>{s}</div>)}</div>}</Reveal>
 <Reveal className="prose-large">{c.about.paragraphs.map(p => <p key={p}>{p}</p>)}{c.about.principles.length > 0 && <div className="principle-list">{c.about.principles.map((s,i) => <div className="principle" key={s}><span>0{i+1}</span>{s}</div>)}</div>}</Reveal></div></section>}
 {education.length > 0 && <section className="section section-tint"><div className="shell"><div className="section-heading"><div><span className="eyebrow">EDUCATION</span><h2>Foundations for exploration.</h2></div></div><div className="content-grid">{education.map(item => <ContentCard item={item} key={item.id} />)}</div></div></section>}
 {experience.length > 0 && <section className="section"><div className="shell"><div className="section-heading"><div><span className="eyebrow">EXPERIENCE</span><h2>Learning in the real world.</h2></div></div><div className="content-grid">{experience.map(item => <ContentCard item={item} key={item.id} />)}</div></div></section>}
 {c.skills.length > 0 && <section className="section"><div className="shell"><div className="section-heading"><div><span className="eyebrow">TOOLKIT</span><h2>What I work with.</h2></div></div><div className="skills-grid">{c.skills.map(g => <Reveal className="skill-group" key={g.id}>{g.title && <h3>{g.title}</h3>}{g.description && <p>{g.description}</p>}{g.skills.length > 0 && <div className="tag-list">{g.skills.map(s => <span key={s}>{s}</span>)}</div>}</Reveal>)}</div></div></section>}</>;
}
