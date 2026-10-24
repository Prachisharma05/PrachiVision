import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentItem } from "@/lib/types";
export function ProjectCard({ project: p, index }: { project: ContentItem; index: number }) {
 const cover = p.coverImage || p.media.find(m => m.type === "image")?.url;
 return <article className={`project-card ${!cover ? "project-text" : ""}`}>
 {cover && <Link className="project-image" href={`/projects/${p.slug}`} aria-label={`View ${p.title}`}><img src={cover} alt={p.media.find(m => m.url === cover)?.alt || p.title} loading="lazy" /></Link>}
 <div className="project-card-body"><div className="project-card-top"><span className="project-number">{String(index+1).padStart(2,"0")}</span><span className="project-card-star" aria-hidden="true">✦</span></div>
 {(p.category || p.date) && <div className="meta-row">{p.category && <span>{p.category}</span>}{p.date && <span>{p.date}</span>}</div>}
 <h3><Link href={`/projects/${p.slug}`}>{p.title}</Link></h3>{p.summary && <p>{p.summary}</p>}{p.status && <span className="status-pill">{p.status}</span>}{p.tags.length > 0 && <div className="tag-list">{p.tags.slice(0,4).map(t => <span key={t}>{t}</span>)}</div>}<Link className="text-link" href={`/projects/${p.slug}`}>Explore project <ArrowUpRight size={16} /></Link></div></article>;
}
