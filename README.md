# PrachiVision

Prachi Sharma's portfolio for **prachivision.dev**, adapted from TechFaizan with a new dark frontend: subtle stars, blue/purple nebula glows, shooting stars, and an orbital illustration. Inter and Space Grotesk are bundled by Next.js at build time. Sky animation has a pause control and respects reduced-motion preferences.

## Run locally

Use Node.js 22 or newer. From this folder:

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The website works without environment variables using the initial content in `lib/default-content.ts`. `/admin` shows setup instructions until your own Supabase project is connected.

## Included

- Home, About, Projects, Research, Achievements, Updates, Club, Contact, and private `/admin`.
- Four projects, two internships, education, biography, skills, and interests distilled from the supplied `details.md`.
- Detailed project pages, media galleries, image/video/PDF uploads, logo and profile photo uploads, résumé replacement/removal, links, featured work, publication controls, and JSON backup import/export.
- A single approved administrator using Supabase email/password authentication.
- Empty fields, blank links, missing uploads, and empty collections stay hidden. All requested navigation routes remain available, including pages awaiting content.
- Private draft storage and a separate published snapshot. RLS enforces database writes; drafts are stripped by a database trigger before public reads.
- Public content is fetched without persistent caching, so saved updates appear on the next page request without redeploying.

## Content decisions

No contact information, logo, portrait, résumé, certificates, awards, updates, publication claims, or club details have been invented. Tech Mahindra internship dates are blank because the source gives conflicting timing. Planned traffic-control extensions and exploratory banking features are labelled accordingly. Video-understanding metrics retain their project-reported context. The MIT license from the source template is retained in `LICENSE`.

## Verification

```powershell
npm run typecheck
npm run check:content
npm run build
npm audit
```

With the initial, unconfigured site running, `npm run check:http` checks public routes, missing entries, hidden contact fields, and contact input validation. It uses a honeypot value for its valid submission and does not send an email. This smoke check intentionally expects the initial empty contact details and admin setup screen; do not use it unchanged after configuring production content.

Live Supabase authentication, database policies, publishing, and Storage uploads require the project described in `DEPLOYMENT.md`; they cannot be verified against a project that has not yet been created. The SQL migration is provided for a new project and has not been executed against a live Supabase database.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full GitHub → Supabase → Vercel → Cloudflare setup and first admin login.
