# RsWallet Full-Stack React Clone

This folder started from the exact GitHub branch that matches the live Vercel SEO pages:

- Repository: `kt849669-beep/rswallet3.0`
- Source branch: `codex/advanced-seo-agent-20260811`
- Source commit: `bb31ee5a0b206a78421798d9f5f07e8b330a0a74`

## New stack

- Next.js 16 App Router
- React 19
- Server-side API route handlers
- Existing Supabase project through server-side REST requests
- Existing static SEO pages and monitoring scripts preserved

## Preserved workflow

1. `/` displays the mobile RsWallet login.
2. A valid first login creates/updates the Supabase user and opens `/home`.
3. The home screen loads live slider, video and Telegram settings.
4. The mandatory six-digit MPIN is saved to the same `users` table.
5. Success, video and Telegram popups follow the existing sequence.
6. Completed/repeated users receive the existing limit-message workflow.
7. Admin login uses `admin_settings` and `admin_sessions`.

## Routes

- `/` user login
- `/home` protected user workflow
- `/admin/login` admin login
- `/admin/dashboard` React admin control panel
- `/api/health` health check
- Existing `.html` SEO page URLs remain in `public/`

## Local use

1. Copy `.env.example` to `.env.local` and fill only the required values.
2. Run `npm install`.
3. Run `npm run dev`.

Do not commit `.env.local` or credentials.
