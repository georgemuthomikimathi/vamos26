# PWA Install + Live Score API

## C1 — Add to Home Screen (done in code)

- `public/manifest.json` — standalone app, shortcuts to Live & Alerts
- `public/sw.js` — offline shell cache (API always network-fresh)
- `InstallPrompt` — Android install button + iOS Share instructions
- `ServiceWorkerRegister` — registers SW in production

### Test on phone

**Android (Chrome)**
1. Open https://www.vamos26.com
2. Wait for “Install VAMOS26” banner → tap **Install**
3. Or: menu → **Install app**

**iPhone (Safari)**
1. Open site in Safari (not Chrome)
2. Tap **Share** → **Add to Home Screen**
3. Launch from home screen — opens without browser chrome

---

## Live Score API (API-Football)

### Vercel env vars

| Variable | Example | Purpose |
|----------|---------|---------|
| `API_FOOTBALL_KEY` | your key from dashboard | Required |
| `API_FOOTBALL_SEASON` | `2026` | Season year (paid tier unlocks WC 2026) |
| `API_FOOTBALL_LEAGUE_WC` | `1` | World Cup league ID |
| `API_FOOTBALL_LEAGUE_FRIENDLY` | `10` | Friendlies |
| `API_FOOTBALL_LEAGUE_EPL` | `39` | Premier League (future) |
| `API_FOOTBALL_LEAGUE_SERIE_A` | `135` | Serie A (future) |

Get key: https://www.api-football.com/ → Dashboard → API key

**Paid tier** unlocks `/fixtures/lineups`, `/fixtures/events`, and the WC 2026 season.

### How it works

1. `/api/live` calls API-Football when `API_FOOTBALL_KEY` is set (paid key required for WC 2026)
2. For each live/finished match, vamos26 fetches:
   - `/fixtures/events` — goals, assists, yellow/red/2nd yellow, all substitutions
   - `/fixtures/lineups` — official Starting XI + full bench (not projected squads)
3. API-Football is **first** for world-cup; `worldcup26.ir` is fallback only on API failure
4. `match-meta` supplements only what API lacks (officials, preview subs when no API data)
5. If API fails entirely, uses static schedule in `src/lib/live.ts`
6. UI shows **Live API** badge and green banner when paid API-Football is connected

### Endpoints used

| Endpoint | Data |
|----------|------|
| `/fixtures?league=…&season=…` | WC 2026 fixtures, scores, clock |
| `/fixtures?live=all` | Live matches across leagues |
| `/fixtures/events?fixture={id}` | Goals, assists, cards, subs |
| `/fixtures/lineups?fixture={id}` | Official lineups + bench |

### Verify

```bash
curl -s "https://www.vamos26.com/api/live?competition=world-cup" | head -c 800
curl -s "https://www.vamos26.com/api/live/status" | jq '.provider, .probe.counts'
```

Look for `"source":"api"`, `"provider":"api-football"`, and non-zero `events` / `lineups` counts in probe.

### After upgrading + redeploy

- **Live tab**: live clock, hero with official Starting XI, all subs & cards
- **Previous Fixtures**: full event timeline with assists and N:B two-yellows note
- **Stats Board**: scorers, assists, cards from API events
- **Road to Final**: standings from API finished matches
- **Alerts**: goals (with assist when available), red cards, penalties

---

## Match alerts (goals, red cards, penalties)

1. Open **Live Scores** on the site (or installed PWA)
2. Tap **Enable goal & card alerts** → allow notifications
3. Toggle **Goals**, **Red cards**, **Penalties** as you like
4. During live matches, alerts fire every ~30s when new events are detected

Requires paid `API_FOOTBALL_KEY` for full event data (cards, assists, all subs).

**Best experience:** install PWA to home screen (Android/iOS) so alerts work when the app is backgrounded.
