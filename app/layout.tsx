import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Starfield } from "@/components/starfield";
import { SiteFooter } from "@/components/site-footer";
import { getPortfolioContent } from "@/lib/content";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPortfolioContent();
  const title = content.settings.siteTitle || `${content.profile.name} — ${content.profile.role}`;
  const description = content.settings.siteDescription || content.profile.introduction;
  return {
    metadataBase: new URL("https://prachivision.dev"),
    title: { default: title, template: `%s — ${content.profile.name}` },
    description,
    icons: content.profile.logoUrl ? { icon: content.profile.logoUrl } : undefined,
    openGraph: { type: "website", url: "/", title, description, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: `${content.profile.name} portfolio` }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-cover.png"] },
  };
}

export const viewport: Viewport = { themeColor: "#080c19", colorScheme: "dark" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getPortfolioContent();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.profile.name,
    url: "https://prachivision.dev",
    ...(content.profile.avatarUrl ? { image: content.profile.avatarUrl } : {}),
    jobTitle: content.profile.role,
    ...(content.profile.email ? { email: `mailto:${content.profile.email}` } : {}),
    ...(content.profile.location ? { address: { "@type": "PostalAddress", addressLocality: content.profile.location } } : {}),
    sameAs: content.profile.socials.filter((item) => item.url.trim()).map((item) => item.url),
    knowsAbout: content.skills.flatMap((group) => group.skills),
  };
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${space.variable}`}>
      <body style={{ "--blue": content.settings.accent } as CSSProperties}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Starfield />
        <SiteHeader profile={content.profile} />
        <main id="main-content">{children}</main>
        <SiteFooter profile={content.profile} />
        <SpeedInsights />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
