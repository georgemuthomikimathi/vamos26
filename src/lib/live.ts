import type { Match } from "@/lib/scores/types";
import { getLiveCount as countLive } from "@/lib/scores/types";

export type { Match, MatchStatus, Score } from "@/lib/scores/types";
export type LiveMatch = Match;

/** World Cup 2026 fixtures — 0-0 until tournament kicks off */
export const LIVE_MATCHES: Match[] = [
  {
    id: "m1",
    competition: "world-cup",
    status: "scheduled",
    kickoffAt: "2026-06-11T19:00:00.000Z",
    date: "Jun 11",
    time: "3:00 PM ET",
    home: { name: "Mexico", code: "mx" },
    away: { name: "South Africa", code: "za" },
    venue: "Estadio Azteca",
    city: "Mexico City",
    stage: "Group A · Opening Match",
    score: { home: null, away: null },
  },
  {
    id: "m2",
    competition: "world-cup",
    status: "scheduled",
    date: "Jun 12",
    time: "6:00 PM ET",
    home: { name: "Canada", code: "ca" },
    away: { name: "Bosnia & Herzegovina", code: "ba" },
    venue: "BMO Field",
    city: "Toronto",
    stage: "Group B",
    score: { home: null, away: null },
  },
  {
    id: "m3",
    competition: "world-cup",
    status: "scheduled",
    date: "Jun 12",
    time: "9:00 PM ET",
    home: { name: "USA", code: "us" },
    away: { name: "Paraguay", code: "py" },
    venue: "SoFi Stadium",
    city: "Los Angeles",
    stage: "Group D",
    score: { home: null, away: null },
  },
  {
    id: "m4",
    competition: "world-cup",
    status: "scheduled",
    date: "Jun 13",
    time: "3:00 PM ET",
    home: { name: "Brazil", code: "br" },
    away: { name: "Morocco", code: "ma" },
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    stage: "Group C",
    score: { home: null, away: null },
  },
  {
    id: "m5",
    competition: "world-cup",
    status: "scheduled",
    date: "Jun 14",
    time: "8:00 PM ET",
    home: { name: "England", code: "gb-eng" },
    away: { name: "Croatia", code: "hr" },
    venue: "MetLife Stadium",
    city: "East Rutherford, NJ",
    stage: "Group L",
    score: { home: null, away: null },
  },
];

export function getLiveCount(): number {
  return countLive(LIVE_MATCHES);
}
