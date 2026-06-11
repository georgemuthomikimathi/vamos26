import type { CompetitionId, Match, MatchStatus, Score } from "@/lib/scores/types";
import { teamNameToCode } from "@/lib/scores/providers/team-codes";

const API_BASE = "https://v3.football.api-sports.io";

type ApiFixture = {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      elapsed: number | null;
      extra?: number | null;
    };
    venue?: { name?: string; city?: string };
  };
  league: { id: number; round?: string; name?: string };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: { home: number | null; away: number | null };
};

function mapStatus(short: string): MatchStatus {
  if (["1H", "2H", "ET", "P", "LIVE", "BT"].includes(short)) return "live";
  if (short === "HT") return "halftime";
  if (["FT", "AET", "PEN"].includes(short)) return "finished";
  return "scheduled";
}

function mapScore(goals: { home: number | null; away: number | null }, status: MatchStatus): Score {
  if (status === "scheduled") return { home: null, away: null };
  return {
    home: goals.home ?? 0,
    away: goals.away ?? 0,
  };
}

function formatFixtureDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }),
  };
}

function normalizeFixture(f: ApiFixture, competition: CompetitionId): Match {
  const status = mapStatus(f.fixture.status.short);
  const { date, time } = formatFixtureDate(f.fixture.date);

  return {
    id: `af-${f.fixture.id}`,
    competition,
    status,
    statusShort: f.fixture.status.short,
    minute: f.fixture.status.elapsed ?? undefined,
    extraMinute: f.fixture.status.extra ?? undefined,
    kickoffAt: f.fixture.date,
    date,
    time,
    home: { name: f.teams.home.name, code: teamNameToCode(f.teams.home.name) },
    away: { name: f.teams.away.name, code: teamNameToCode(f.teams.away.name) },
    venue: f.fixture.venue?.name ?? "TBD",
    city: f.fixture.venue?.city ?? "",
    stage: f.league.round ?? f.league.name ?? "Fixture",
    score: mapScore(f.goals, status),
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

function dedupeFixtures(fixtures: ApiFixture[]): ApiFixture[] {
  const seen = new Set<number>();
  return fixtures.filter((f) => {
    if (seen.has(f.fixture.id)) return false;
    seen.add(f.fixture.id);
    return true;
  });
}

async function apiFetch(path: string): Promise<ApiFixture[]> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) return [];

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "x-apisports-key": key },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { response?: ApiFixture[] };
    return data.response ?? [];
  } catch {
    return [];
  }
}

export function isApiFootballConfigured(): boolean {
  return Boolean(process.env.API_FOOTBALL_KEY?.trim());
}

function leagueParams(competition: CompetitionId): { leagueId: string; season: string } {
  if (competition === "world-cup") {
    return {
      leagueId: process.env.API_FOOTBALL_LEAGUE_WC ?? "1",
      season: process.env.API_FOOTBALL_SEASON ?? "2026",
    };
  }
  if (competition === "friendly") {
    return {
      leagueId: process.env.API_FOOTBALL_LEAGUE_FRIENDLY ?? "10",
      season: process.env.API_FOOTBALL_SEASON ?? "2026",
    };
  }
  if (competition === "premier-league") {
    return { leagueId: process.env.API_FOOTBALL_LEAGUE_EPL ?? "39", season: "2025" };
  }
  return { leagueId: process.env.API_FOOTBALL_LEAGUE_SERIE_A ?? "135", season: "2025" };
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayUtc(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function fetchApiFootballFixtures(
  competition: CompetitionId
): Promise<Match[] | null> {
  if (!isApiFootballConfigured()) return null;

  const { leagueId, season } = leagueParams(competition);
  const today = todayUtc();
  const yesterday = yesterdayUtc();

  const [bySeason, byToday, byYesterday, liveAll] = await Promise.all([
    apiFetch(`/fixtures?league=${leagueId}&season=${season}`),
    apiFetch(`/fixtures?date=${today}&league=${leagueId}`),
    apiFetch(`/fixtures?date=${yesterday}&league=${leagueId}`),
    competition === "world-cup" ? apiFetch("/fixtures?live=all") : Promise.resolve([]),
  ]);

  const wcLive = liveAll.filter(
    (f) =>
      /world cup/i.test(f.league.name ?? "") ||
      String(f.league.id) === leagueId
  );

  const merged = dedupeFixtures([...bySeason, ...byToday, ...byYesterday, ...wcLive]);
  if (merged.length === 0) return null;

  return sortMatches(merged.map((f) => normalizeFixture(f, competition)));
}

export async function fetchApiFootballLive(): Promise<Match[] | null> {
  if (!isApiFootballConfigured()) return null;

  const fixtures = await apiFetch("/fixtures?live=all");
  if (fixtures.length === 0) return null;

  const { leagueId } = leagueParams("world-cup");
  const wc = fixtures.filter(
    (f) =>
      /world cup/i.test(f.league.name ?? "") ||
      String(f.league.id) === leagueId
  );

  const pool = wc.length > 0 ? wc : fixtures;
  return sortMatches(pool.slice(0, 16).map((f) => normalizeFixture(f, "world-cup")));
}
