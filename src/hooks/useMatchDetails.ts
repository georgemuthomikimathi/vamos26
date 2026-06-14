"use client";

import { useCallback, useEffect, useState } from "react";
import type { Match, MatchEvent } from "@/lib/scores/types";
import { attachLineupsToMatch } from "@/lib/scores/lineups";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";
import { POLL_LIVE_MS } from "@/lib/realtime/polling";

function shouldFetchDetails(match: Match): boolean {
  if (!match.id.startsWith("af-")) return false;
  return (
    match.status === "live" ||
    match.status === "halftime" ||
    match.status === "finished"
  );
}

function needsEventBackfill(match: Match): boolean {
  if (!match.id.startsWith("af-") || match.status !== "finished") return false;
  const goals = (match.score.home ?? 0) + (match.score.away ?? 0);
  if (goals === 0) return false;
  const hasEvents = (match.events?.length ?? 0) > 0;
  const hasSubs =
    (match.homeSubs?.length ?? 0) + (match.awaySubs?.length ?? 0) > 0;
  return !hasEvents && !hasSubs;
}

function pickEvents(
  match: Match,
  fetched?: MatchEvent[]
): MatchEvent[] | undefined {
  if (fetched?.length) return fetched;
  if (match.events?.length) return match.events;
  return fetched ?? match.events;
}

function mergeDetails(
  match: Match,
  details?: Partial<
    Pick<Match, "events" | "homeLineup" | "awayLineup" | "homeSubs" | "awaySubs">
  >
): Match {
  return enrichMatchFromMeta(
    attachLineupsToMatch({
      ...match,
      events: pickEvents(match, details?.events),
      homeLineup: details?.homeLineup ?? match.homeLineup,
      awayLineup: details?.awayLineup ?? match.awayLineup,
      homeSubs:
        details?.homeSubs?.length
          ? details.homeSubs
          : match.homeSubs?.length
            ? match.homeSubs
            : details?.homeSubs,
      awaySubs:
        details?.awaySubs?.length
          ? details.awaySubs
          : match.awaySubs?.length
            ? match.awaySubs
            : details?.awaySubs,
    })
  );
}

export function useMatchDetails(match: Match, enabled: boolean): Match {
  const shouldLoad = enabled || needsEventBackfill(match);
  const [enriched, setEnriched] = useState(() =>
    enrichMatchFromMeta(attachLineupsToMatch(match))
  );

  const fetchDetails = useCallback(async () => {
    if (!shouldFetchDetails(match)) {
      setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
      return;
    }

    try {
      const res = await fetch(
        `/api/match-details?id=${encodeURIComponent(match.id)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
        return;
      }
      const data = (await res.json()) as {
        details?: Partial<
          Pick<Match, "events" | "homeLineup" | "awayLineup" | "homeSubs" | "awaySubs">
        >;
      };
      setEnriched(mergeDetails(match, data.details));
    } catch {
      setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
    }
  }, [match]);

  useEffect(() => {
    setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
  }, [match]);

  useEffect(() => {
    if (!shouldLoad) return;
    void fetchDetails();
  }, [shouldLoad, fetchDetails]);

  useEffect(() => {
    if (!shouldLoad) return;
    const isLive = match.status === "live" || match.status === "halftime";
    if (!isLive || !match.id.startsWith("af-")) return;

    const interval = setInterval(() => void fetchDetails(), POLL_LIVE_MS);
    return () => clearInterval(interval);
  }, [shouldLoad, fetchDetails, match.status, match.id]);

  return enriched;
}
