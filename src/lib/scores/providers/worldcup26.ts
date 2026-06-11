import type { CompetitionId, Match, MatchEvent, MatchStatus, Score } from "@/lib/scores/types";
import { teamNameToCode } from "@/lib/scores/providers/team-codes";
import {
  formatKickoffET,
  stadiumTimeZone,
  zonedLocalToUtc,
} from "@/lib/timezone";

const DEFAULT_BASE = "https://worldcup26.ir";

export type WorldCup26Debug = {
  baseUrl: string;
  gameCount: number;
  liveCount: number;
  error?: string;
  sampleGameId?: string;
};

type Wc26Game = {
  id: string;
  home_team_name_en?: string;
  away_team_name_en?: string;
  home_team_label?: string;
  away_team_label?: string;
  home_score: string;
  away_score: string;
  home_scorers?: string;
  away_scorers?: string;
  group: string;
  matchday: string;
  local_date: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: string;
};

type Wc26Stadium = {
  id: string;
  name_en: string;
  city_en: string;
  country_en?: string;
};

type GamesResponse = { games?: Wc26Game[] };
type StadiumsResponse = { stadiums?: Wc26Stadium[] };

export function getWorldCup26BaseUrl(): string {
  return (process.env.WORLDCUP26_API_URL?.trim() || DEFAULT_BASE).replace(/\/$/, "");
}

function mapStatus(game: Wc26Game): MatchStatus {
  if (game.finished === "TRUE" || game.time_elapsed === "finished") return "finished";
  if (game.time_elapsed === "ht" || game.time_elapsed === "halftime") return "halftime";
  if (game.time_elapsed === "live" || /^\d+$/.test(game.time_elapsed)) return "live";
  return "scheduled";
}

function parseScore(value: string, status: MatchStatus): number | null {
  if (status === "scheduled") return null;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? 0 : n;
}

function mapScore(game: Wc26Game, status: MatchStatus): Score {
  return {
    home: parseScore(game.home_score, status),
    away: parseScore(game.away_score, status),
  };
}

function parseMinute(timeElapsed: string): number | undefined {
  if (timeElapsed === "live" || timeElapsed === "notstarted") return undefined;
  if (/^\d+$/.test(timeElapsed)) return Number.parseInt(timeElapsed, 10);
  return undefined;
}

/** local_date is MM/DD/YYYY HH:mm in stadium-local time */
function parseKickoff(
  localDate: string,
  stadium?: Wc26Stadium
): { kickoffAt: string; date: string; time: string } {
  const [datePart, timePart] = localDate.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [hour, minute] = (timePart ?? "00:00").split(":").map(Number);

  const timeZone = stadium
    ? stadiumTimeZone(stadium.city_en, stadium.country_en ?? "United States")
    : "America/New_York";

  const kickoffAt = zonedLocalToUtc(year, month, day, hour, minute, timeZone).toISOString();
  const { date, time } = formatKickoffET(kickoffAt);

  return { kickoffAt, date, time };
}

function formatStage(game: Wc26Game): string {
  if (game.type === "group") return `Group ${game.group} · MD${game.matchday}`;
  if (game.type === "final") return "Final";
  if (game.type === "third") return "Third Place";
  if (game.type === "sf") return "Semi-final";
  if (game.type === "qf") return "Quarter-final";
  if (game.type === "r16") return "Round of 16";
  if (game.type === "r32") return "Round of 32";
  return game.group || "Knockout";
}

function teamName(game: Wc26Game, side: "home" | "away"): string {
  if (side === "home") {
    return game.home_team_name_en || game.home_team_label || "TBD";
  }
  return game.away_team_name_en || game.away_team_label || "TBD";
}

function parseScorers(raw: string | undefined, team: "home" | "away"): MatchEvent[] {
  if (!raw || raw === "null") return [];

  const normalized = raw
    .replace(/[{}]/g, "")
    .replace(/[""''`]/g, "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const events: MatchEvent[] = [];
  for (const part of normalized) {
    const match = part.match(/^(.+?)\s+(\d+)'/);
    if (!match) continue;
    const player = match[1].trim();
    const minute = Number.parseInt(match[2], 10);
    if (!player || Number.isNaN(minute)) continue;
    events.push({ minute, type: "goal", player, team });
  }

  return events;
}

function normalizeGame(game: Wc26Game, competition: CompetitionId, stadiums: Map<string, Wc26Stadium>): Match {
  const status = mapStatus(game);
  const stadium = stadiums.get(game.stadium_id);
  const { kickoffAt, date, time } = parseKickoff(game.local_date, stadium);
  const homeName = teamName(game, "home");
  const awayName = teamName(game, "away");
  const homeEvents = parseScorers(game.home_scorers, "home");
  const awayEvents = parseScorers(game.away_scorers, "away");
  const events = [...homeEvents, ...awayEvents].sort((a, b) => a.minute - b.minute);

  return {
    id: `wc26-${game.id}`,
    competition,
    status,
    statusShort: game.time_elapsed === "live" ? "LIVE" : game.time_elapsed.toUpperCase(),
    minute: parseMinute(game.time_elapsed),
    kickoffAt,
    date,
    time,
    home: { name: homeName, code: teamNameToCode(homeName) },
    away: { name: awayName, code: teamNameToCode(awayName) },
    venue: stadium?.name_en ?? "TBD",
    city: stadium?.city_en ?? "",
    stage: formatStage(game),
    score: mapScore(game, status),
    events: events.length > 0 ? events : undefined,
  };
}

function sortMatches(matches: Match[]): Match[] {
  const order = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  return [...matches].sort((a, b) => {
    const sa = order[a.status];
    const sb = order[b.status];
    if (sa !== sb) return sa - sb;
    if (a.kickoffAt && b.kickoffAt) {
      return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
    }
    return 0;
  });
}

function isInDateWindow(localDate: string, daysBefore = 1, daysAfter = 2): boolean {
  const [datePart] = localDate.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const kickoff = new Date(year, month - 1, day);
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - daysBefore);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setDate(end.getDate() + daysAfter);
  end.setHours(23, 59, 59, 999);
  return kickoff >= start && kickoff <= end;
}

function filterRelevantGames(games: Wc26Game[]): Wc26Game[] {
  return games.filter((g) => {
    const status = mapStatus(g);
    if (status === "live" || status === "halftime") return true;
    if (status === "finished" && isInDateWindow(g.local_date, 7, 0)) return true;
    return isInDateWindow(g.local_date, 1, 2);
  });
}

async function fetchJson<T>(path: string): Promise<{ data: T | null; error?: string }> {
  const base = getWorldCup26BaseUrl();
  try {
    const res = await fetch(`${base}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "vamos26-live/1.0",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return { data: null, error: `http_${res.status}` };
    const data = (await res.json()) as T;
    return { data };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "fetch_failed" };
  }
}

async function loadStadiums(): Promise<Map<string, Wc26Stadium>> {
  const { data } = await fetchJson<StadiumsResponse>("/get/stadiums");
  const map = new Map<string, Wc26Stadium>();
  for (const s of data?.stadiums ?? []) {
    map.set(s.id, s);
  }
  return map;
}

export async function probeWorldCup26(): Promise<WorldCup26Debug> {
  const baseUrl = getWorldCup26BaseUrl();
  const debug: WorldCup26Debug = { baseUrl, gameCount: 0, liveCount: 0 };

  const { data, error } = await fetchJson<GamesResponse>("/get/games");
  if (error || !data?.games) {
    debug.error = error ?? "no_games";
    return debug;
  }

  debug.gameCount = data.games.length;
  debug.liveCount = data.games.filter((g) => mapStatus(g) === "live" || mapStatus(g) === "halftime").length;
  debug.sampleGameId = data.games[0]?.id;
  return debug;
}

/** All group-stage fixtures (no date window) — used for standings tables. */
export async function fetchWorldCup26AllGroupMatches(
  competition: CompetitionId
): Promise<{ matches: Match[] | null; error?: string }> {
  if (competition !== "world-cup") {
    return { matches: null, error: "not_world_cup" };
  }

  const [gamesResult, stadiums] = await Promise.all([
    fetchJson<GamesResponse>("/get/games"),
    loadStadiums(),
  ]);

  if (gamesResult.error || !gamesResult.data?.games?.length) {
    return {
      matches: null,
      error: gamesResult.error ?? "no_games",
    };
  }

  const groupGames = gamesResult.data.games.filter((g) => g.type === "group");
  if (groupGames.length === 0) {
    return { matches: null, error: "no_group_games" };
  }

  return {
    matches: groupGames.map((g) => normalizeGame(g, competition, stadiums)),
  };
}

export async function fetchWorldCup26Fixtures(
  competition: CompetitionId
): Promise<{ matches: Match[] | null; error?: string }> {
  if (competition !== "world-cup") {
    return { matches: null, error: "not_world_cup" };
  }

  const [gamesResult, stadiums] = await Promise.all([
    fetchJson<GamesResponse>("/get/games"),
    loadStadiums(),
  ]);

  if (gamesResult.error || !gamesResult.data?.games?.length) {
    return {
      matches: null,
      error: gamesResult.error ?? "no_games",
    };
  }

  const relevant = filterRelevantGames(gamesResult.data.games);
  if (relevant.length === 0) {
    return { matches: null, error: "no_relevant_games" };
  }

  return {
    matches: sortMatches(relevant.map((g) => normalizeGame(g, competition, stadiums))),
  };
}
