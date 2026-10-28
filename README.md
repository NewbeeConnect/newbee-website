# newbee-website

Official website for **Newbee** (`newbeeapp.com` / `www.newbeeapp.com`) and the device-aware app download redirect (`download.newbeeapp.com` and `/download`).

> **Core Slogan:** *"One-stop app to navigate all challenges of moving and living abroad."*

## Routes & Features

- `/` (`app/page.tsx`) — 5-slide full-viewport scroll-snapping landing experience (`#start`, `#ask`, `#events`, `#meet`, `#get-started`) powered by `lib/marketing.ts` (`SLIDES`) and `components/scroll-controller.ts`
- `/communities` — Server redirect to `/#meet`
- `/businesses` — Server redirect to `/#ask`
- `/about` — Server redirect to `/#start`
- `/contact` — Contact hub (`info@beeyondapps.com` for general/City Lead/Expert/event inquiries, `privacy@beeyondapps.com` for GDPR/KVKK account & data deletion requests, Instagram `@newbeeappsocials`)
- `/privacy` — English (`EN`) Privacy Policy & Data Protection Notice (`privacy/en`, `kvkk/en` in `data/legal-pages.json`)
- `/termsandconditions` — English (`EN`) Terms & Conditions (`terms/en` in `data/legal-pages.json`)
- `/download` (`download.newbeeapp.com` / `marketing.newbeeapp.com`) — Device-aware 302 redirect (`detectPlatformFromUserAgent` in `lib/marketing.ts`):
  - iOS / iPadOS (including iPadOS 13+ desktop Safari) → App Store (`https://apps.apple.com/de/app/newbee-connect/id6474511885?l=en-GB`)
  - Android → Google Play (`https://play.google.com/store/apps/details?id=com.beeyondapps.newbee`)
  - Desktop / other → `https://app.newbeeapp.com`

## Development & Verification

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run 17 unit, redirect, SEO & security contract tests (lib/__tests__/marketing-and-download.test.ts)
npm test

# Run static security check
npm run check:security

# Lint, typecheck, and build
npm run lint
npm run typecheck
npm run build

# Run full CI gate (lint → typecheck → check:security → test → build)
npm run ci

# Run isolated Docker pre-release gate (Dockerfile.test / docker-compose.test.yml)
npm run test:docker
npm run test:release
```

For architecture rules and deployment details, see **[`CLAUDE.md`](CLAUDE.md)** and **[`STATUS.md`](STATUS.md)**.
