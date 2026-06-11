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
| `API_FOOTBALL_SEASON` | `2026` | Season year |
| `API_FOOTBALL_LEAGUE_WC` | `1` | World Cup league ID |
| `API_FOOTBALL_LEAGUE_FRIENDLY` | `10` | Friendlies |
| `API_FOOTBALL_LEAGUE_EPL` | `39` | Premier League (future) |
| `API_FOOTBALL_LEAGUE_SERIE_A` | `135` | Serie A (future) |

Get key: https://www.api-football.com/ → Dashboard → API key

### How it works

1. `/api/live` calls API-Football when `API_FOOTBALL_KEY` is set
2. If WC 2026 fixtures are empty, falls back to `fixtures?live=all` for testing
3. If API fails, uses static schedule in `src/lib/live.ts`
4. UI shows **· Live API** or **· Schedule preview** under Last updated

### Verify

```bash
curl -s "https://www.vamos26.com/api/live?competition=world-cup" | head -c 500
```

Look for `"source":"api"` in the JSON.
