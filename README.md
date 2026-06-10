# VAMOS26 Beta

Next-generation FIFA World Cup 2026 fan site — app-first live scores, friendly results, stats, watchlists, and host city shop.

## Features

- **Live Match Center** — World Cup fixtures with nil-nil pre-match scores; auto-refresh via `/api/live`
- **Friendly Scores** — recent international friendlies (clearly labeled, not WC results)
- **Multi-competition API** — `/api/scores/[competition]` for world-cup, friendly, premier-league, serie-a
- **Stats Board** — top scorers, assists, clean sheets (— pre-tournament)
- **Donate** — support VAMOS26 hosting and live data
- **App shell** — PWA manifest, mobile bottom nav, installable on home screen
- **City Shop** — themed merch for US host cities

## Quick Start

```bash
npm install
npm run dev      # http://127.0.0.1:3040
npm run build
npm run start:prod  # http://127.0.0.1:3041
```

## Architecture

See [docs/LIVE_SCORES.md](docs/LIVE_SCORES.md) for competition registry, API design, and future sports-data integration.

## Service Worker (future)

Push notifications and offline shell caching are planned. When ready, add `public/sw.js` and register in a client provider. See docs for the recommended pattern.

## Live Data

Update `src/lib/live.ts` and `src/lib/friendlies.ts` during the tournament, or wire `/api/live` to a sports data provider.
