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

## API-Football integration (paid tier)

`src/lib/scores/providers/`:

| File | Endpoints | Purpose |
|------|-----------|---------|
| `api-football.ts` | `/fixtures?…` | Fixtures, scores, live clock |
| `fixture-enrichment.ts` | `/fixtures/events`, `/fixtures/lineups` | Goals, assists, cards, all subs, official lineups |
| `api-football-events.ts` | `/fixtures/events` | Push notification event polling |
| `api-football-lineups.ts` | `/fixtures/lineups` | Starting XI + full bench |
| `fetch-matches.ts` | — | API-Football first; worldcup26.ir fallback on failure |

`enrichMatches()` runs for all live, halftime, finished, and kickoff-soon API fixtures.

`enrich-from-meta.ts` supplements only missing data (officials); API events/subs take priority.

## Future Sports API Integration

Additional competitions (EPL, Serie A) are scaffolded in `src/lib/competitions.ts`.

## Service Worker (future)

A service worker stub is noted in README. When ready:

```js
// public/sw.js — cache shell, poll /api/live for updates
self.addEventListener('fetch', (e) => { /* network-first for API */ });
```

Register in `layout.tsx` or a client provider when push/live updates are needed.
