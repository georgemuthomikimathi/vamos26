import type { Match } from "@/lib/scores/types";

export type StoredMatchEvent = {
  key: string;
  minute: number;
  type: "goal" | "red" | "penalty" | "penalty_missed";
  player: string;
  teamName: string;
};

const STATE_KEY = "vamos26-match-alert-state";

type MatchSnapshot = {
  scores: Record<string, { home: number; away: number }>;
  events: Record<string, StoredMatchEvent[]>;
};

function emptySnapshot(): MatchSnapshot {
  return { scores: {}, events: {} };
}

export function loadMatchSnapshot(): MatchSnapshot {
  if (typeof window === "undefined") return emptySnapshot();
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (!raw) return emptySnapshot();
    return { ...emptySnapshot(), ...JSON.parse(raw) };
  } catch {
    return emptySnapshot();
  }
}

export function saveMatchSnapshot(snapshot: MatchSnapshot): void {
  sessionStorage.setItem(STATE_KEY, JSON.stringify(snapshot));
}

export function numericScore(match: Match): { home: number; away: number } {
  return {
    home: match.score.home ?? 0,
    away: match.score.away ?? 0,
  };
}

export function eventKey(
  matchId: string,
  minute: number,
  type: string,
  detail: string,
  player: string
): string {
  return `${matchId}:${minute}:${type}:${detail}:${player}`;
}
