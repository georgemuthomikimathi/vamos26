"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Match } from "@/lib/scores/types";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import {
  buildTournamentDayContext,
  type TournamentDayContext,
} from "@/lib/tournament-day";
import { onDataRefresh } from "@/lib/realtime/cascade";
import { POLL_IDLE_MS } from "@/lib/realtime/polling";

const EMPTY_CONTEXT = buildTournamentDayContext([]);

export function useTournamentContext(): TournamentDayContext {
  const [matches, setMatches] = useState<Match[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/live?competition=world-cup", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as { matches?: Match[] };
      setMatches(enrichMatchesFromMeta(data.matches ?? []));
    } catch {
      /* keep last snapshot */
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), POLL_IDLE_MS);
    const unsub = onDataRefresh(() => void load());
    return () => {
      clearInterval(interval);
      unsub();
    };
  }, [load]);

  return useMemo(
    () => (matches.length > 0 ? buildTournamentDayContext(matches) : EMPTY_CONTEXT),
    [matches]
  );
}
