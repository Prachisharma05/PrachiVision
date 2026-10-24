import { ArrowUpRight, FileText, Play } from "lucide-react";
import Link from "next/link";
import type { ContentItem } from "@/lib/types";

export function ContentCard({ item, href }: { item: ContentItem; href?: string }) {
  const media = item.media[0];
  return <article className="content-card">
    {media || item.coverImage ? <div className="content-card-media">{href ? <Link href={href} aria-label={`View ${item.title}`}><CardMedia media={media} coverImage={item.coverImage} /></Link> : <CardMedia media={media} coverImage={item.coverImage} />}</div> : null}
    {(item.category || item.organization || item.date || item.startDate || item.endDate) && <div className="meta-row">{(item.category || item.organization) && <span>{item.category || item.organization}</span>}{(item.date || item.startDate || item.endDate) && <span>{item.date || [item.startDate, item.endDate].filter(Boolean).join(" — ")}</span>}</div>}
    <h3>{href ? <Link href={href}>{item.title}</Link> : item.title}</h3>
    {item.role && <p className="subtitle">{item.role}</p>}{item.location && <p className="card-location">{item.location}</p>}{item.subtitle ? <p className="subtitle">{item.subtitle}</p> : null}
    {item.summary && <p>{item.summary}</p>}
    {!href && item.description && <p>{item.description}</p>}{!href && item.tags.length > 0 && <div className="tag-list">{item.tags.map(t => <span key={t}>{t}</span>)}</div>}{!href && !!item.metrics?.length && <div className="metric-list">{item.metrics.map(m => <span key={m}>{m}</span>)}</div>}{item.highlights.length > 0 && <ul className="card-highlights">{item.highlights.map(h => <li key={h}>{h}</li>)}</ul>}{item.status ? <span className="status-pill">{item.status}</span> : null}
    {href || item.links.some((link) => link.url.trim()) ? <div className="inline-links">{href ? <Link href={href}>View details<ArrowUpRight size={14} /></Link> : null}{item.links.filter((link) => link.url.trim()).slice(0, href ? 2 : undefined).map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={14} /></a>)}</div> : null}
  </article>;
}

function CardMedia({ media, coverImage }: { media: ContentItem["media"][number] | undefined; coverImage?: string }) {
  if (media?.type === "video") return <span className="card-video-preview">{media.thumbnailUrl ? <img src={media.thumbnailUrl} alt="" /> : <video src={`${media.url}#t=0.1`} muted playsInline preload="metadata" />}<span><Play size={17} fill="currentColor" /></span></span>;
  if (media?.type === "pdf") return <span className="card-document-preview"><FileText /><strong>{media.caption || media.alt || "PDF document"}</strong><small>Open document</small></span>;
  return <img src={media?.url || coverImage} alt={media?.alt || ""} />;
}
