# Live Scores Architecture

VAMOS26 is built as a multi-competition live-score platform. World Cup 2026 is live now; Premier League and Serie A are scaffolded for future integration.

## Competition Registry

`src/lib/competitions.ts` defines all supported competitions:

| ID | Status | Data source |
|---|---|---|
| `world-cup` | Active | `src/lib/live.ts` |
| `friendly` | Active | `src/lib/friendlies.ts` |
| `premier-league` | Placeholder | Empty — wire to API later |
| `serie-a` | Placeholder | Empty — wire to API later |

## Shared Types

`src/lib/scores/types.ts` exports:

- `Match` — full match object with `competition` field
- `Score` — `{ home: number | null, away: number | null }` — **null = pre-match (nil-nil)**
- `formatScore()` — renders `–` for null scores, `2 – 1` for real results

## API Endpoints

### `GET /api/live?competition=world-cup`

Default competition is `world-cup`. Returns:

```json
{
  "updatedAt": "2026-06-09T...",
  "competition": "world-cup",
  "competitionName": "FIFA World Cup 2026",
  "liveCount": 0,
  "matches": [...]
}
```

### `GET /api/scores/[competition]`

Dedicated route per competition (e.g. `/api/scores/friendly`).

## Nil-nil vs Friendlies

- **World Cup fixtures** use `score: { home: null, away: null }` until kickoff — UI shows `–` (not 0-0).
- **Friendly matches** use real scores (e.g. USA 2-1 Mexico) and are labeled "International Friendly".
- **Live badge** only appears when `status` is `live` or `halftime`.

## Future Sports API Integration

1. Create a fetch adapter in `src/lib/scores/providers/` (e.g. `api-football.ts`).
2. Map external payloads to `Match` type in a normalizer.
3. Swap seed data in `getMatchesByCompetition()` for cached API responses.
4. Add ISR or edge caching with 30s revalidation for live matches.
5. Optional: service worker for push notifications on goal events.

### Recommended providers

- [API-Football](https://www.api-football.com/) — broad coverage
- [Sportradar](https://developer.sportradar.com/) — enterprise grade
- [Football-Data.org](https://www.football-data.org/) — free tier for EPL

## Service Worker (future)

A service worker stub is noted in README. When ready:

```js
// public/sw.js — cache shell, poll /api/live for updates
self.addEventListener('fetch', (e) => { /* network-first for API */ });
```

Register in `layout.tsx` or a client provider when push/live updates are needed.
