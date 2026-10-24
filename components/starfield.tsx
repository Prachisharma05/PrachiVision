"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

// Deterministic positions avoid hydration changes and need no animation loop.
export function Starfield() {
  const pathname = usePathname();
  const [paused, setPaused] = useState(false);
  if (pathname.startsWith("/admin")) return null;
  return <>
    <div className={`night-sky ${paused ? "sky-paused" : ""}`} aria-hidden="true">
      <div className="nebula nebula-blue" /><div className="nebula nebula-purple" />
      <div className="stars">{Array.from({ length: 85 }, (_, i) => <i key={i} style={{ left: `${((i * 73.13 + 7) % 100).toFixed(2)}%`, top: `${((i * 31.79 + 3) % 100).toFixed(2)}%`, "--size": `${i % 6 === 0 ? 2 : 1}px`, "--delay": `${-(i % 9)}s`, "--duration": `${5 + i % 6}s` } as CSSProperties} />)}</div>
      <span className="shooting-star shooting-one" /><span className="shooting-star shooting-two" />
    </div>
    <button className="sky-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume" : "Pause"} sky animation <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>
  </>;
}
