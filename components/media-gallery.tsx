"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, FileDown, FileText, Play } from "lucide-react";
import type { MediaItem } from "@/lib/types";

function videoSource(url: string) {
  return url.includes("#") ? url : `${url}#t=0.1`;
}

function VideoThumbnail({ item }: { item: MediaItem }) {
  return <span className="video-thumbnail">
    {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" /> : <video src={videoSource(item.url)} muted playsInline preload="metadata" aria-hidden="true" />}
    <span className="media-type-badge"><Play size={13} fill="currentColor" /></span>
  </span>;
}

export function MediaGallery({ media }: { media: MediaItem[] }) {
  const [active, setActive] = useState(0);
  if (!media.length) return null;
  const current = media[active];
  const move = (direction: number) => setActive((value) => (value + direction + media.length) % media.length);
  return <section className="media-gallery" aria-label="Project media gallery">
    <div className="gallery-stage">
      {current.type === "video" ? <video key={current.id} src={videoSource(current.url)} poster={current.thumbnailUrl} controls playsInline preload="metadata" aria-label={current.alt} /> : current.type === "pdf" ? <div className="gallery-document"><FileText /><span>PDF DOCUMENT</span><h3>{current.caption || current.alt || "Attached document"}</h3><div><a className="button" href={current.url} target="_blank" rel="noreferrer">Open PDF <ExternalLink size={16} /></a><a className="button secondary" href={current.url} download>Download <FileDown size={16} /></a></div></div> : <img src={current.url} alt={current.alt} />}
      {media.length > 1 ? <><button onClick={() => move(-1)} className="gallery-control previous" aria-label="Previous media"><ChevronLeft /></button><button onClick={() => move(1)} className="gallery-control next" aria-label="Next media"><ChevronRight /></button></> : null}
    </div>
    <div className="gallery-caption"><span>{String(active + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span><p>{current.caption || current.alt}</p></div>
    {media.length > 1 ? <div className="gallery-thumbs">{media.map((item, index) => <button key={item.id} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`Show ${item.caption || item.alt}`}>{item.type === "video" ? <VideoThumbnail item={item} /> : item.type === "pdf" ? <span className="document-thumbnail"><FileText /><small>PDF</small></span> : <img src={item.url} alt="" />}</button>)}</div> : null}
  </section>;
}
