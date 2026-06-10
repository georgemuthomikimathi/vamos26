# VAMOS26 — FIFA World Cup 2026 Fan Site

App-first live scores and fan guide for [vamos26.com](https://vamos26.com).

## Features

- **Live Scores** — World Cup fixtures with nil-nil pre-match state; auto-refresh via `/api/live`
- **Friendly Scores** — recent international friendlies (clearly labeled, not WC results)
- **Stats Board** — top scorers, assists, clean sheets
- **Donate** — support VAMOS26 hosting and live data
- **App shell** — PWA manifest, mobile bottom nav, installable on home screen
- **Groups** — All 12 groups (A–L) with flags and draw highlights
- **Stars** — 12 notable players to watch with country flags
- **Trophy & Ball** — FIFA World Cup Trophy and Adidas Trionda details
- **Discover NYC** — Bars, fan zones, and viewing parties across all 5 boroughs

## Quick Start

```bash
npm install
npm run dev      # http://127.0.0.1:3030
npm run build
```

## Architecture

See [docs/LIVE_SCORES.md](docs/LIVE_SCORES.md) for competition registry, API design, and future sports-data integration.

## Deploy to Vercel

See **[docs/LAUNCH.md](docs/LAUNCH.md)** for the full push, PayPal, Printify/Printful, and smoke-test checklist.

```bash
git push origin main   # auto-deploy if Vercel is linked
# or
npx vercel --prod
```

`www.vamos26.com` redirects to apex `vamos26.com` via `next.config.ts`.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- Lucide React icons
