"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Match } from "@/lib/scores/types";
import type { CompetitionId } from "@/lib/scores/types";
import { getLiveCount } from "@/lib/scores/types";

const POLL_MS = 30_000;

type LivePayload = {
  matches: Match[];
  liveCount: number;
  updatedAt: string;
  changedMatchIds: string[];
};

type LiveScoresContextValue = {
  worldCup: LivePayload;
  friendlies: LivePayload;
  refreshing: boolean;
  refresh: () => Promise<void>;
};

const emptyPayload = (): LivePayload => ({
  matches: [],
  liveCount: 0,
  updatedAt: "",
  changedMatchIds: [],
});

const LiveScoresContext = createContext<LiveScoresContextValue | null>(null);

function scoreKey(m: Match): string {
  return `${m.score.home ?? "n"}-${m.score.away ?? "n"}-${m.status}-${m.minute ?? 0}`;
}

function diffChanged(prev: Match[], next: Match[]): string[] {
  const prevMap = new Map(prev.map((m) => [m.id, scoreKey(m)]));
  return next.filter((m) => prevMap.get(m.id) !== scoreKey(m)).map((m) => m.id);
}

async function fetchCompetition(competition: CompetitionId): Promise<Omit<LivePayload, "changedMatchIds">> {
  const res = await fetch(`/api/live?competition=${competition}`);
  const data = await res.json();
  return {
    matches: data.matches ?? [],
    liveCount: data.liveCount ?? getLiveCount(data.matches ?? []),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  };
}

export function LiveScoresProvider({ children }: { children: ReactNode }) {
  const [worldCup, setWorldCup] = useState<LivePayload>(emptyPayload);
  const [friendlies, setFriendlies] = useState<LivePayload>(emptyPayload);
  const [refreshing, setRefreshing] = useState(false);
  const wcRef = useRef<Match[]>([]);
  const frRef = useRef<Match[]>([]);

  const refresh = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const [wc, fr] = await Promise.all([
        fetchCompetition("world-cup"),
        fetchCompetition("friendly"),
      ]);
      const wcChanged = diffChanged(wcRef.current, wc.matches);
      const frChanged = diffChanged(frRef.current, fr.matches);
      wcRef.current = wc.matches;
      frRef.current = fr.matches;
      setWorldCup({ ...wc, changedMatchIds: wcChanged });
      setFriendlies({ ...fr, changedMatchIds: frChanged });
    } finally {
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(() => refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <LiveScoresContext.Provider
      value={{
        worldCup,
        friendlies,
        refreshing,
        refresh: () => refresh(true),
      }}
    >
      {children}
    </LiveScoresContext.Provider>
  );
}

export function useLiveScores() {
  const ctx = useContext(LiveScoresContext);
  if (!ctx) throw new Error("useLiveScores must be used within LiveScoresProvider");
  return ctx;
}
