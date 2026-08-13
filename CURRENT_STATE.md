# RsWallet 3.0 - Current Project State & Memory

This file serves as memory for AI agents. When a new conversation starts, read this to understand the current state.

## Recent Updates (August 12, 2026)
1. **Brand Rename & Domain Change:**
   - All "rswallet" references replaced with "rswallet" across entire project (~74 files + 11 files renamed).
   - Domain changed from `app-rswallet.in` → `app-rswallet.in` → **`rswallet.vercel.app`** (final). Updated in 25 files.
   - Previous brand aliases replaced with "RsWallet" everywhere.
2. **SEO Keywords Updated:** All public HTML pages, schema JSON-LD, and meta tags now target exact Google Search keywords:
   - **Target keywords:** `Rswallet`, `Rswallet login`, `Rswallet app`, `Rswallet apk`, `Rswallet app download`, `Rswallet`, `Rswallet usdt`, `rswallet real or fake`
   - Added `<meta name="keywords">` to all public SEO pages (`public/*.html`) and user-app pages.
   - Updated `keywords` field in all JSON-LD schema blocks.
   - Updated `alternateName` arrays in Organization schema to include all keyword variants.
   - Previous brand references completely removed from all content and replaced with "RsWallet".
2. **Admin Panel Mobile Responsiveness:**
   - The admin login page (`admin-app/pages/login.html`) was updated via `admin-app/css/responsive.css` to fit mobile screens perfectly without touching the edges.
   - Fixed an issue where the sidebar hamburger menu was not working on mobile because Vercel/Vite dropped `sidebar.js`. Fixed by adding `type="module"` to all `sidebar.js` script tags in admin HTML pages.
3. **Admin Session Tracking (Multi-Device Logout):**
   - Added logic in `login.js` and `auth.js` to track `admin_sessions` in Supabase.
   - When an admin changes their password in `profile.js`, all other active sessions are logged out (tokens deleted), except for their current device.
   - Note for DB: The SQL query for the `admin_sessions` table has been provided to the user. `auth.js` gracefully handles missing table errors without causing infinite logout loops.
4. **Users Page Bulk Actions:**
   - Added "Select All" functionality in `users.html` and `users.js`.
   - Added bulk PDF download using `jspdf` and `jspdf-autotable`.
   - Added bulk delete for users (moves them to `trash` table in Supabase).
5. **Deployment:** The project is deployed using Vercel. Output directory is `dist`. Build uses Vite.

## Important Notes for Future Agents
- **Environment:** Windows, PowerShell.
- **Tools:** Use `vite build` (no `vite.config.js` needed by default, but there is a `vite.config.ts` mapping HTML files).
- **Supabase:** The project uses Supabase for database operations. Ensure RLS policies or correct tokens are used.
- **Vercel:** Vercel rewrites are configured in `vercel.json`. The admin login is accessed via `/admin` which rewrites to `admin-app/pages/login.html`.
- **Scripts:** Always use `type="module"` for JS scripts in HTML if they need to be bundled by Vite in production.
