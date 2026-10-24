export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
 return <section className="page-intro"><div className="shell">{eyebrow && <span className="eyebrow">{eyebrow}</span>}{title && <h1>{title}</h1>}{description && <p>{description}</p>}</div></section>;
}
