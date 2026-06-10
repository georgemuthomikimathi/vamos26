# VAMOS26 — FIFA World Cup 2026 Fan Site

App-first live scores and fan guide for [vamos26.com](https://vamos26.com).

## Features

- **Live Scores** — expandable match cards, manual refresh, nil-nil pre-match via `/api/live`
- **Friendly Scores** — recent international friendlies (clearly labeled, not WC results)
- **Stats Board** — top scorers, assists, and clean sheets (tabbed on mobile)
- **Donate** — PayPal support (`axonsovereignllc@gmail.com`)
- **App shell** — PWA manifest, quick-nav, bottom nav, back-to-top
- **Groups** — All 12 groups (A–L) with flags and draw highlights
- **Trophy & Ball** — FIFA World Cup Trophy and Adidas Trionda details
- **Discover NYC** — 34 bars, restaurants, fan zones & viewing parties with search

## Quick Start

```bash
npm install
npm run dev      # http://127.0.0.1:3030
npm run build
```

## Architecture

See [docs/LIVE_SCORES.md](docs/LIVE_SCORES.md) for competition registry, API design, and future sports-data integration.

## Deploy to Vercel

**Quick push guide:** [docs/PUSH.md](docs/PUSH.md)  
**Full launch checklist:** [docs/LAUNCH.md](docs/LAUNCH.md)

```bash
# 1. Push feature branch
git push -u origin cursor/interactive-ux-donate-paypal-nyc

# 2. Merge to main (after PR or locally), then:
git push origin main   # auto-deploy on Vercel
```

`www.vamos26.com` redirects to apex `vamos26.com` via `next.config.ts`.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- Lucide React icons
