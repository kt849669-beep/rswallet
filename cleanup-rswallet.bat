@echo off
setlocal
cd /d "%~dp0"

set "REPO=https://github.com/kt849669-beep/rswallet.git"

echo ==========================================================
echo   RS Wallet - project cleanup
echo   Folder: %CD%
echo ==========================================================
echo.
echo STEP A will PERMANENTLY delete:
echo   - 9 public SEO landing pages
echo   - unused legacy folders (src, user-app, admin-app, shared,
echo     supabase, docs, tests, seo-monitor, assets, .agents, .github)
echo   - leftover scripts and old notes
echo   - the .next build cache
echo   - the old .git history, replaced with a fresh repository
echo.
echo The live app is NOT touched:
echo   app, components, lib, database, public, node_modules stay
echo   UI design, login flow, home flow and Supabase stay exactly the same
echo.
echo STEP B (asked separately) can push to GitHub and deploy to Vercel.
echo.
set /p GO=Type YES and press Enter to start STEP A:
if /i not "%GO%"=="YES" goto :cancelled
echo.

echo [1/6] Removing public SEO landing pages...
for %%F in (
  "public\about-rswallet.html"
  "public\how-to-deposit-rswallet.html"
  "public\how-to-deposit-usdt-rswallet.html"
  "public\how-to-use-rswallet.html"
  "public\rswallet-apk.html"
  "public\rswallet-guide.html"
  "public\rswallet-password-help.html"
  "public\rswallet-support.html"
  "public\rswallet-usdt.html"
  "public\offline.html"
) do if exist %%F ( del /f /q %%F && echo    deleted %%F )

echo.
echo [2/6] Removing unused legacy folders...
for %%D in (
  "src"
  "user-app"
  "admin-app"
  "shared"
  "supabase"
  "docs"
  "tests"
  "seo-monitor"
  "assets"
  ".agents"
  ".github"
  ".next"
) do if exist "%%~D\." ( rmdir /s /q "%%~D" && echo    deleted %%D\ )

echo.
echo [3/6] Removing leftover scripts and old notes...
for %%F in (
  "seo-generator.cjs"
  "generate-sitemap.cjs"
  "refactor.js"
  "build-structure.js"
  "server.ts"
  "vite.config.ts"
  "portal.html"
  "jsconfig.json"
  "metadata.json"
  "FULLSTACK-REACT.md"
  "CLAUDE.md"
  "test-fetch.cjs"
  "test-insert.cjs"
  "test-trash-insert.cjs"
  "test-trash.js"
  "update_tables.cjs"
  "update_tables.py"
  ".codex-adminflow.err.log"
  ".codex-adminflow.out.log"
  ".codex-dev.stderr.log"
  ".codex-dev.stdout.log"
) do if exist %%F ( del /f /q %%F && echo    deleted %%F )

echo.
echo [4/6] Resetting git history...
where git >nul 2>nul
if errorlevel 1 (
  echo    git not found on PATH - skipped.
  echo    IMPORTANT: delete the .git folder manually. It still holds
  echo    the old remote URL and the full old commit history.
  goto :build
)
if exist ".git\." (
  rmdir /s /q ".git"
  echo    old .git deleted
)
git init -b main >nul 2>nul
if errorlevel 1 ( git init >nul 2>nul & git checkout -b main >nul 2>nul )
git config user.name "rswallet" >nul 2>nul
git config user.email "admin@rswallet.online" >nul 2>nul
git add -A >nul 2>nul
git commit -m "Initial commit: RS Wallet (rswallet.online)" >nul 2>nul
if errorlevel 1 (
  echo    fresh repo created, but the first commit failed.
  echo    Run manually:  git add -A   then   git commit -m "Initial commit"
) else (
  echo    fresh repo created with a single clean commit
)

:build
echo.
echo [5/6] Rebuilding the app...
where npm >nul 2>nul
if errorlevel 1 (
  echo    npm not found - run "npm install" and "npm run build" yourself.
  goto :deploy
)
call npm install --no-audit --no-fund
if errorlevel 1 ( echo    npm install FAILED - fix this before deploying. & goto :deploy )
call npm run build
if errorlevel 1 (
  echo.
  echo    ******************************************************
  echo    BUILD FAILED. Do NOT deploy. Fix the error above first.
  echo    ******************************************************
  goto :end
)
echo    build OK

:deploy
echo.
echo [6/6] Publish
echo.
echo    This will FORCE PUSH the fresh history to:
echo      %REPO%
echo    The old commits on that repo will be replaced.
echo.
set /p PUB=Type PUSH and press Enter to publish, or just Enter to skip:
if /i not "%PUB%"=="PUSH" ( echo    Skipped. & goto :end )

where git >nul 2>nul
if errorlevel 1 ( echo    git not available - cannot push. & goto :end )
git remote remove origin >nul 2>nul
git remote add origin %REPO%
echo    pushing to GitHub...
git push -u origin main --force
if errorlevel 1 (
  echo    PUSH FAILED - check your GitHub login and that the repo exists.
  goto :end
)
echo    pushed to GitHub.
echo.
echo    If Vercel is connected to that repo, it is deploying now.
where vercel >nul 2>nul
if errorlevel 1 (
  echo    Vercel CLI not installed - nothing else to do here.
  echo    To deploy manually:  npx vercel --prod
  goto :end
)
set /p VC=Also run a direct Vercel production deploy? Type Y and Enter:
if /i not "%VC%"=="Y" goto :end
call vercel --prod

:end
echo.
echo ==========================================================
echo   Done.
echo.
echo   Pages that remain:
echo     /                 RS Wallet login (public, indexed)
echo     /home             user dashboard (noindex)
echo     /admin/login      admin login (noindex)
echo     /admin/dashboard  admin panel (noindex)
echo.
echo   UI design, login workflow, home workflow and Supabase:
echo   unchanged.
echo ==========================================================
echo.
pause
echo Removing this cleanup script...
(goto) 2>nul & del /f /q "%~f0"

:cancelled
echo Cancelled. Nothing was deleted.
echo.
pause
