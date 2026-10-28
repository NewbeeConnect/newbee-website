# Newbee Website & Download Redirect (`newbee-website`)

> **Last Updated:** October 28, 2026
> GitHub: `NewbeeConnect/newbee-website` | Hosting: Vercel project `newbee-website`

## Overview

This repository serves two roles on the same Next.js 16 application (with zero Supabase or runtime secret dependencies):

1. **Official Newbee Website (`newbeeapp.com`, `www.newbeeapp.com`, `newbee-website.vercel.app`)**
   - Minimal 100% English slide-by-slide scroll-snapping experience (`neoklinik.io` style) built with warm paper background `#faf7f0`, radial dot grid, Newbee Yellow `#ffb72a`, crisp black ink `#111111`, and local Geist / Geist Mono fonts.
   - Core slogan: *"One-stop app to navigate all challenges of moving and living abroad."*
   - Routes (`app/` & `lib/marketing.ts`):
     - `/` (`app/page.tsx`) — 5-slide scroll-snapping landing experience (`#start`, `#ask`, `#events`, `#meet`, `#get-started`) powered by `lib/marketing.ts` (`SLIDES`) and `components/scroll-controller.ts` (keyboard navigation, `.nk-slide-dots`, `.nk-scroll-progress`, `.nk-next-pill`).
     - `/communities`, `/businesses`, `/about` — Server redirects (`redirect()`) to `/#meet`, `/#ask`, and `/#start` respectively.
     - `/contact` (`app/contact/page.tsx`) — Contact hub (`info@beeyondapps.com` / `privacy@beeyondapps.com` mailto builder `buildContactMailtoUrl` in `lib/marketing.ts`, Instagram `@newbeeappsocials`, GDPR/KVKK account & data deletion requests).
     - `/privacy` & `/termsandconditions` — English (`EN`) legal pages powered by `data/legal-pages.json` (`privacy/en`, `kvkk/en`, `terms/en`).
   - Permanent 308 redirects in `next.config.ts` map all legacy Wix URLs (`/home`, `/new-about`, `/blog`, `/groups`, `/forum`, `/terms`, etc.) to their modern equivalents.

2. **Device-Aware App Download Redirect (`/download` and `download.newbeeapp.com`)**
   - `GET /download` (`app/download/route.ts`) delegates to `detectPlatformFromUserAgent` / `getDownloadRedirectUrl` in `lib/marketing.ts` and returns a 302 redirect by User-Agent:
     - iPhone / iPad / iPod / iPadOS 13+ desktop-class Safari (`Macintosh` + `Mobile/`) → App Store (`https://apps.apple.com/de/app/newbee-connect/id6474511885?l=en-GB`)
     - Android → Google Play (`https://play.google.com/store/apps/details?id=com.beeyondapps.newbee`)
     - Desktop / other → `https://app.newbeeapp.com` (and homepage `#get-started` CTA cards on `www.newbeeapp.com`)
   - `proxy.ts` rewrites the root path (`/`) of `download.newbeeapp.com` and `marketing.newbeeapp.com` to `/download` (`isDownloadRedirectHost` in `lib/marketing.ts`), and `next.config.ts` sets `Cache-Control: private, no-store, max-age=0` and `Vary: User-Agent` on `/download`. This bare link is printed on Instagram story footers and store materials, so **it must always keep working**.

## Rules

1. **GitHub identity & branching (`KULLANICI.md`):**
   - Feature/fix branches merge into `develop` via PR, and `develop` merges into `main` for production deploys.
   - Commits and PRs must be authored by **NewbeeConnect** (`newbeeconnect@gmail.com`), pinned per repo via `hesap.py`.
   - Use direct `git` commands; never run `gh auth switch` and never include AI attribution trailers (`Co-Authored-By`, `Generated with Claude Code`, etc.).
2. **Product & copy rules:**
   - 100% English (`lang="en"`), zero occurrences of `"diaspora"` anywhere in the repository.
   - Do not promote a job board or career module (parked in Sep 2026).
   - Never refer to City Leads as "volunteers" / "gönüllü".

## Build, Test & Verify (`Commands & Quality Gates`)

```bash
# Run 17 unit, redirect, SEO & security contract tests
npm test

# Run static security check (CVE-2026-26996 braces guard)
npm run check:security

# Lint, typecheck & production build
npm run lint
npm run typecheck
npm run build

# Full CI pipeline (lint → typecheck → check:security → test → build)
npm run ci

# Full pre-release gate in local Docker (Dockerfile.test / docker-compose.test.yml)
npm run test:docker
npm run test:release
```

Verify the live download redirect across all three device classes:

```bash
for ua in iPhone Android Macintosh; do
  curl -s -o /dev/null -w "$ua %{http_code} %{redirect_url}\n" -A "$ua" https://download.newbeeapp.com
done
```
