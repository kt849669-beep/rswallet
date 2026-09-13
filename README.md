# RsWallet 1.0 - local application

Source based on the owner's original saved Sites version 9, with local mobile admin, realtime content, login protection, admin accounts, user records and PDF reports. Changes here do not republish the online site.

## Start on this Windows computer

1. Double-click START-RSWALLET.cmd and keep its window open.
2. User app: http://localhost:3000/login
3. Admin app: http://localhost:3000/admin
4. Press Ctrl+C in the startup window to stop.

The startup script applies local database migrations without removing existing content. This computer includes a portable official Node.js 24 x64 runtime in .runtime/node for Windows ARM compatibility. The source ZIP excludes that runtime and node_modules; on another computer install Node.js 24 x64, run npm ci, then run the startup script.

## Admin login and profile

Initial email: admin@rswallet.com
Initial password: admin@01234

These credentials initialize the account once. Profile lets you change the password by entering the old password, new password and matching confirmation, then pressing Confirm password change. The email remains fixed. Password changes persist across restarts and revoke other admin sessions. The new password replaces the initial password.

All admin content, upload, user, profile and report APIs require an authenticated admin session, including on localhost. Admin sessions last eight hours. Five failed login attempts trigger a one-minute pause. Passwords are stored as salted PBKDF2 hashes; session cookies are HttpOnly and SameSite=Strict. Legacy LOCAL_CONTENT_ADMIN and ChatGPT identity headers do not bypass this login.

Admin login, header, side menu and Overview have no links to the user app. The user app has no admin navigation links or buttons. Access to admin management still requires its separate email/password login.

## User demo login and records

Enter a 10-digit test mobile, any nonempty test password, then any six test digits for MPIN. This remains a wallet demonstration, without real account verification or payment processing. The password stays in the browser. The phone is sent to the local server only to create a keyed HMAC-SHA256 hash; only that hash is stored. The test MPIN is format-checked and never saved.

Home redirects to Login until login and MPIN are complete. An active session lasts eight hours and survives refresh; logout revokes it. Each completed login records its hash and timestamp. Existing logins made before this update cannot be reconstructed; users will appear after their next completed login.

Users is directly below Overview in the mobile side menu. It refreshes every two seconds and shows the full hash, first/last login and login count. Select individual users or all users, then delete them into Trash. Individual Delete and Restore buttons are included. Select all applies to all matching users, including records beyond the latest 500 displayed. A trashed user stays in Trash on subsequent demo logins until restored; deletion is a reversible record-management action, not account blocking.

## Reports

Reports offers Date-wise PDF (one day or inclusive date range) and All records PDF. Dates use India Standard Time (UTC+05:30). Each login event has its full mobile hash, timestamp and current Active/Trash status. All records includes users in Trash. PDFs use white A4 landscape pages, black selectable text, repeated headers and page numbers. No records are silently truncated; exports above 20,000 events ask for a smaller date range.

The output supports text extraction for bot processing. No Telegram bot has been connected, and reports contain hashes rather than recoverable mobile numbers.

## Content and realtime connection

- Original wallet layouts and bundled assets are preserved, with mobile side-menu navigation in admin.
- Slides, Home poster, Profile banner, Telegram popup and image/video popup have independent controls.
- Home poster uses a compact dismissible popup, with the same width and placement as the Telegram dialog. The full image fits inside a small preview without cropping, with Home visible behind the lightly dimmed backdrop. Slides remain separate.
- Toggles save immediately; other valid changes auto-save after a 450 ms pause. The Save changes button sends a valid draft immediately. Invalid drafts show errors; revision protection prevents overwriting another admin's newer edits.
- User tabs receive a Server-Sent Events stream, backed by a 750 ms database check. Same-origin tabs also receive an immediate BroadcastChannel update after saving. Reconnection and fallback polling recover interrupted streams.
- Turning a popup OFF closes it; turning it ON again creates a new activation. Unrelated slideshow edits do not reopen dismissed popups.
- Media upload, byte-range delivery, Trash and restore remain available.

## Local files and data

All application code is saved directly in this Desktop folder. Content, uploads, hashed user records, login events and changed admin passwords persist in .wrangler/state. Keep that directory to preserve local data. Admin edits update the database, not application source files.

The source ZIP excludes dependencies, build output, portable runtime, local database, uploads, temporary credentials and test artifacts. A fresh installation starts with default content and initial admin credentials. The original Sites configuration is retained for reference; the public site was not redeployed.

## Developer commands

On this Windows ARM computer, first set the bundled runtime on PATH:

```powershell
$env:PATH = "$PWD\.runtime\node;$env:PATH"
node scripts/setup-local.mjs
npm run dev -- --host 127.0.0.1 --port 3000 --strictPort
```

Checks: npm run build and node node_modules/typescript/bin/tsc --noEmit.

For isolated integration checks, use a NEW test-state directory for each full run, with the runtime on PATH:

```powershell
node node_modules/wrangler/bin/wrangler.js d1 migrations apply DB --local --config wrangler.local.jsonc --persist-to .wrangler/test-new
$env:RSWALLET_TEST_STATE = '.wrangler/test-new'
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3100 --strictPort
```

In another terminal, run these in order:

```powershell
node scripts/test-admin.mjs
node scripts/test-live.mjs
node scripts/test-content.mjs
```

These scripts refuse port 3000. The admin test changes and resets the password only in the isolated database and creates sample PDFs under .wrangler/test-reports. Stop the test server afterward.

Validation completed: TypeScript and production build; admin access/login/password confirmation/session revocation; hashed user registration and repeat-login counts; single/all deletion, exclusions and restore; date/all/empty PDF downloads; PDF text extraction and visual inspection; Home login protection and realtime popup/slide/media updates. Sample live update latency: 748 ms. Browser interaction testing was not performed for this update.

The original application has existing lint issues and 14 dependency audit findings; this update does not claim a clean whole-project lint/audit result.
