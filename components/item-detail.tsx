import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ContentItem } from "@/lib/types";
import { LinkIcon } from "@/lib/icons";
import { MediaGallery } from "@/components/media-gallery";

export function ItemDetail({ item, eyebrow, backHref, backLabel }: { item: ContentItem; eyebrow: string; backHref: string; backLabel: string }) {
  const facts = [
    ["Date", item.date || [item.startDate, item.endDate].filter(Boolean).join(" — ")],
    ["Status", item.status],
    ["Role", item.role],
    ["Location", item.location],
    ["Organization", item.organization],
    ["Category", item.category],
  ].filter(([, value]) => value);
  return <>
    <section className="project-hero"><div className="shell project-hero-grid">
      <div><Link className="text-link" href={backHref}><ArrowLeft size={16} /> {backLabel}</Link><span className="eyebrow" style={{ display: "flex", marginTop: 34 }}>{eyebrow}</span><h1>{item.title}</h1>{item.subtitle ? <p className="item-subtitle">{item.subtitle}</p> : null}{item.summary && <p className="lead">{item.summary}</p>}{item.tags.length ? <div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}{item.links.some((link) => link.url.trim()) ? <div className="link-panel">{item.links.filter((link) => link.url.trim()).map((link) => <a key={link.id} className="button secondary" href={link.url} target="_blank" rel="noreferrer"><LinkIcon kind={link.kind} />{link.label}<ArrowUpRight size={15} /></a>)}</div> : null}</div>
      {facts.length > 0 && <aside className="project-facts">{facts.map(([label, value]) => <div className="project-fact" key={label}><span>{label}</span><strong>{value}</strong></div>)}</aside>}
    </div><div className="shell"><MediaGallery media={item.media} /></div></section>
    <section className="section"><div className="shell case-layout">
      <aside className="case-aside"><span className="eyebrow">DETAILS</span>{(item.role || item.organization || item.category) && <h2>{item.role || item.organization || item.category}</h2>}{item.description ? <p>{item.description}</p> : null}{item.metrics?.length ? <div className="metric-list">{item.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div> : null}{item.highlights.length ? <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}</aside>
      <div className="case-sections">{item.sections?.length ? item.sections.map((section, index) => <article className="case-section" key={section.id}><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>{section.title && <h2>{section.title}</h2>}{section.body && <p>{section.body}</p>}</article>) : <article className="case-section"><span className="eyebrow">OVERVIEW</span><h2>{item.title}</h2>{(item.description || item.summary) && <p>{item.description || item.summary}</p>}</article>}</div>
    </div></section>
  </>;
}
