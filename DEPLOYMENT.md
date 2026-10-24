# Deployment guide — prachivision.dev

Keep the source files from **this PrachiVision folder** at the root of the new repository. The sibling TechFaizan folder and ZIP are reference material and should not be uploaded into it. No external projects or accounts have been created by this local build.

## 1. Create the GitHub repository

Create a new empty repository in your GitHub account. Choose its name and visibility; leave README, license, and .gitignore initialization unchecked because these files already exist locally. In PowerShell:

```powershell
Set-Location 'C:\Users\Prachi Sharma\Desktop\prachivision\PrachiVision'
git init -b main
git add .
git commit -m "Create Prachi Sharma portfolio"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace both placeholders with your choices. Authenticate through GitHub's normal sign-in flow. `.gitignore` excludes local environment files, dependencies, and build output; `.env.example` contains no credentials. Check staged files before committing.

Reference: [GitHub: adding locally hosted code](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## 2. Create Supabase and the single administrator

1. Create a new Supabase project in your account. Choose the project name, region, and database password yourself, and wait until it is ready.
2. Open SQL Editor. Paste and run `supabase/migrations/001_portfolio_cms.sql` **once on this new project**. It creates the admin allow-list, private content table, public snapshot, publishing trigger, Storage bucket, and access policies. Do not run it on the original TechFaizan database.
3. In Authentication configuration, disable **Allow new users to sign up** and anonymous sign-ins. Keep the Email/password provider enabled.
4. In Authentication → Users → Add user, choose the option to create a user with your email and password directly. Ensure that this administrator's email is confirmed. The app uses password login; it has no invite-completion or password-reset screen. You manage forgotten passwords through the Supabase dashboard.
5. Copy that user's UUID. In SQL Editor, replace the placeholder and run:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID');
```

The database permits one allow-listed administrator. Other authenticated users cannot edit the portfolio.

6. Copy your project URL and **publishable** API key from the project's Connect/API settings. The existing variable name `NEXT_PUBLIC_SUPABASE_ANON_KEY` accepts the publishable key. Never put a secret key or service-role key in this app.
7. For local editing, copy `.env.example` to `.env.local`, fill in these two values, and restart the server:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
```

References: [Supabase authentication configuration](https://supabase.com/docs/guides/auth/general-configuration), [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [user management](https://supabase.com/docs/guides/auth/users).

## 3. First local admin setup

Open http://127.0.0.1:3000/admin and sign in. The initial portfolio is loaded when the database has no saved content. Review it, upload your logo/photo/PDF résumé, add your public contact details, then select **Save & publish** once to seed the database.

Fields left blank disappear publicly. Entries must have a title and be Published to appear. Featured projects appear on Home; research projects also appear on Research when their category contains “research.” Enable the Club page content in its editor when ready. Contact form fields appear after a valid public email is added.

PNG, JPEG, WebP, GIF, MP4, WebM, and PDF uploads are supported up to 50 MB per file. Use PNG/WebP for your logo; SVG uploads are not enabled. Uploaded media are public assets, including files attached to drafts. Keep confidential files out of this bucket. Removing an upload from a content field hides its reference but does not erase the stored file; manage unused files through Supabase Storage.

Export JSON backups after edits. They contain content and media URLs, not copies of uploaded files. Unsaved edits are held in the current page and are lost on reload. Uploading a file happens immediately; publishing its reference requires Save & publish.

## 4. Create and deploy the Vercel project

In Vercel, choose Add New → Project and import the new GitHub repository. Use the Next.js framework preset and the repository root directory. Keep the normal `npm run build` build command and the default output setting. Use Node.js 22 or 24.

Add the two Supabase environment variables from step 2 for Production. Add them for Preview only if you want previews to connect to the same database; edits there affect the same content. Deploy. Open the generated Vercel URL and test public pages and `/admin`. Changing environment values later requires a redeploy. Content saved through admin needs no new Git commit or deployment.

References: [Vercel Git deployments](https://vercel.com/docs/git), [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github).

## 5. Connect Cloudflare and prachivision.dev

If the domain is already registered, add it to Cloudflare and use the exact nameservers assigned to this zone at your registrar. Preserve existing mail/verification records. If DNSSEC is enabled at the previous provider, follow Cloudflare's DNSSEC migration instructions before switching nameservers, then re-enable it after activation. A domain registered through Cloudflare already uses its DNS.

In Vercel project settings → Domains, add `prachivision.dev` and `www.prachivision.dev`. Set `www` to redirect to the apex domain, matching this project's canonical URLs. In Cloudflare DNS, copy the exact A/CNAME and any verification TXT records shown by **your Vercel project**. Use DNS-only for the web records initially. Keep Cloudflare as the DNS provider; do not change to Vercel nameservers. Wait for Vercel's domain verification and certificate issuance, then test HTTPS on both names.

References: [Cloudflare nameserver setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/), [Vercel DNS configuration](https://vercel.com/docs/domains/working-with-dns).

In Supabase Auth URL Configuration, set Site URL to `https://prachivision.dev`. Allow `https://prachivision.dev/admin` and your local `/admin` URL for development. Password login does not require an OAuth callback.

## 6. Optional direct contact emails

With only a public email in the admin profile, the contact form opens the visitor's email app with a prepared message. To send directly, create a Resend account, verify your sending domain using its DNS records, and add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in Vercel. Use a sender on the verified domain, then redeploy. The recipient always comes from the public email saved in admin; there is no separate hardcoded recipient. Test delivery yourself after configuration. No contact inbox is stored in Supabase.

Reference: [Resend with Next.js](https://resend.com/docs/send-with-nextjs).

## 7. Final verification after configuration

- Sign in as your approved administrator and save a small edit. Reload a public page and confirm it appears.
- Create an unpublished entry; confirm it is absent both publicly and from anonymous `portfolio_public` reads. Anonymous reads of `portfolio_content` must fail.
- Confirm other users cannot edit or upload.
- Test upload, replace, remove, draft/publish, and JSON export/import.
- Add and clear a contact field; confirm it appears and disappears on the website.
- Test the résumé, social links, forms, mobile menu, sky pause control, and reduced-motion preference.
- Confirm `/admin` has noindex metadata, sitemap URLs use `prachivision.dev`, and both domain variants have working HTTPS.

These live checks remain pending until your accounts and projects exist. Keep the local source and your exported content backups after deployment.
