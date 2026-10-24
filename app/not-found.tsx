import Link from "next/link";

export default function NotFound() { return <section className="section"><div className="narrow empty-state"><span className="eyebrow">404</span><h1 style={{ fontSize: "clamp(3rem,8vw,7rem)", margin: "18px 0" }}>This route has not been engineered yet.</h1><p>The page may have moved, or the content is still a draft.</p><div style={{ marginTop: 28 }}><Link className="button" href="/">Return home</Link></div></div></section>; }
