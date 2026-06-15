import type { Match } from "@/lib/scores/types";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";

/** Stable key — each pairing occurs at most once per tournament stage path. */
export function fixturePairKey(match: Match): string {
  const [a, b] = [match.home.code, match.away.code].sort();
  return `${a}:${b}`;
}

function isLiveish(match: Match): boolean {
  return match.status === "live" || match.status === "halftime";
}

/** Keep IR events/subs; overlay only live clock and in-play score from API. */
function overlayLiveFields(ir: Match, api: Match): Match {
  return enrichMatchFromMeta({
    ...ir,
    id: api.id.startsWith("af-") ? api.id : ir.id,
    status: api.status,
    statusShort: api.statusShort,
    minute: api.minute,
    extraMinute: api.extraMinute,
    score: api.score,
    events: mergeEventsPreferIrGoals(ir.events, api.events),
  });
}

function mergeEventsPreferIrGoals(
  irEvents: Match["events"],
  apiEvents: Match["events"]
): Match["events"] {
  const ir = irEvents ?? [];
  const api = apiEvents ?? [];
  if (api.length === 0) return ir.length > 0 ? ir : undefined;
  if (ir.length === 0) return api;
  const seen = new Set(ir.map((e) => `${e.minute}-${e.type}-${e.player}-${e.team}`));
  const merged = [...ir];
  for (const e of api) {
    const key = `${e.minute}-${e.type}-${e.player}-${e.team}`;
    if (!seen.has(key)) merged.push(e);
  }
  return merged.sort(
    (a, b) =>
      a.minute - b.minute ||
      (a.extraMinute ?? 0) - (b.extraMinute ?? 0) ||
      a.type.localeCompare(b.type)
  );
}

/**
 * worldcup26.ir is the source of truth for finished & scheduled fixtures.
 * API-Football overlays only live/halftime rows (clock + in-play score).
 */
export function mergeIrWithApiLive(irMatches: Match[], apiMatches: Match[]): Match[] {
  const byKey = new Map<string, Match>();
  for (const m of irMatches) {
    byKey.set(fixturePairKey(m), enrichMatchFromMeta(m));
  }

  for (const m of apiMatches) {
    if (!isLiveish(m)) continue;
    const key = fixturePairKey(m);
    const ir = byKey.get(key);
    byKey.set(key, ir ? overlayLiveFields(ir, m) : enrichMatchFromMeta(m));
  }

  const order = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  return [...byKey.values()].sort((a, b) => {
    const sa = order[a.status];
    const sb = order[b.status];
    if (sa !== sb) return sa - sb;
    if (a.kickoffAt && b.kickoffAt) {
      return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
    }
    return 0;
  });
}
