# RS Wallet

Official RS Wallet web application — **https://rswallet.online**

RS Wallet is a mobile-first Next.js app with three surfaces: a public RS Wallet login page, a protected
user dashboard, and a protected administration panel. Supabase provides the database and storage.

## Routes

| Route | Purpose | Indexed |
| --- | --- | --- |
| `/` | RS Wallet login — the only public, indexed page. Carries all site SEO. | Yes |
| `/home` | User dashboard — UPI, USDT rate, rewards, activity | No |
| `/admin/login` | Administrator login | No |
| `/admin/dashboard` | Administrator panel — users, sliders, banners, video, telegram, notifications, trash, activity | No |

`/login` permanently redirects to `/`.

## Project layout

```
app/                 Next.js App Router — pages, layout, metadata, API routes
  api/auth/*         User login + MPIN
  api/admin/*        Admin login/logout, overview, resource CRUD, upload
components/          React components (LoginForm, UserHome, AdminLogin, AdminDashboard)
lib/                 Supabase REST client + admin session auth
database/            Supabase SQL — schema, policies, triggers, buckets, seed
public/              Static assets, robots.txt, sitemap.xml, manifest.json
```

## Local development

```bash
cp .env.example .env.local   # fill in Supabase + admin values
npm install
npm run dev                  # http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## SEO

All public SEO lives on the login page (`app/page.js` + `app/layout.js`) and is entirely in the
document head plus JSON-LD — the visible UI is the login screen only, with no marketing content
below it. Metadata, keyword set, Open Graph and Twitter cards are in `app/layout.js`; the JSON-LD
graph (`WebSite`, `Organization`, `WebPage`, `SoftwareApplication`) is in `app/page.js`.
Target market is India (`en-IN`).

Note: do not add `FAQPage` or `HowTo` schema unless the matching content is actually visible on the
page — Google requires structured data to reflect on-page content.

Canonical domain is `rswallet.online` and is read from `NEXT_PUBLIC_SITE_URL`. Update
`public/sitemap.xml` `lastmod` when the home page content changes meaningfully.

## Deployment

Vercel, framework preset `nextjs`. Security headers are set in `vercel.json` and `next.config.mjs`.
Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_FALLBACK_EMAIL`, `ADMIN_FALLBACK_PASSWORD`,
`ADMIN_SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL` as project environment variables.
