import type { CompetitionId, Match, MatchStatus, Score } from "@/lib/scores/types";
import { formatKickoffET } from "@/lib/timezone";
import {
  getApiFootballKey,
  getWcLeagueId,
  getWcSeason,
  isApiFootballConfigured,
} from "@/lib/scores/providers/api-config";
import { teamNameToCode } from "@/lib/scores/providers/team-codes";

const API_BASE = "https://v3.football.api-sports.io";

export type ApiFetchDebug = {
  configured: boolean;
  leagueId: string;
  season: string;
  today: string;
  counts: Record<string, number>;
  errors: string[];
  sampleFixtureId?: number;
};

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
  return { home: goals.home ?? 0, away: goals.away ?? 0 };
}

function formatFixtureDate(iso: string): { date: string; time: string } {
  return formatKickoffET(iso);
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

function isWorldCupFixture(f: ApiFixture, leagueId: string): boolean {
  return (
    String(f.league.id) === leagueId ||
    /world cup|fifa world cup/i.test(f.league.name ?? "")
  );
}

function filterCompetitionFixtures(
  fixtures: ApiFixture[],
  competition: CompetitionId,
  leagueId: string
): ApiFixture[] {
  if (competition !== "world-cup") return fixtures;
  return fixtures.filter((f) => isWorldCupFixture(f, leagueId));
}

function datesAroundToday(): string[] {
  const dates = new Set<string>();
  const now = new Date();
  for (let offset = -1; offset <= 2; offset++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + offset);
    dates.add(d.toISOString().slice(0, 10));
  }
  return [...dates];
}

async function apiFetchRaw(path: string): Promise<{ fixtures: ApiFixture[]; error?: string }> {
  const key = getApiFootballKey();
  if (!key) return { fixtures: [], error: "no_key" };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "x-apisports-key": key },
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      return { fixtures: [], error: `auth_${res.status}` };
    }
    if (!res.ok) {
      return { fixtures: [], error: `http_${res.status}` };
    }

    const data = (await res.json()) as {
      response?: ApiFixture[];
      errors?: Record<string, string>;
    };

    if (data.errors && Object.keys(data.errors).length > 0) {
      return { fixtures: [], error: JSON.stringify(data.errors) };
    }

    return { fixtures: data.response ?? [] };
  } catch (e) {
    return { fixtures: [], error: e instanceof Error ? e.message : "fetch_failed" };
  }
}

export { isApiFootballConfigured } from "@/lib/scores/providers/api-config";

function leagueParams(competition: CompetitionId): { leagueId: string; season: string } {
  if (competition === "world-cup") {
    return { leagueId: getWcLeagueId(), season: getWcSeason() };
  }
  if (competition === "friendly") {
    return {
      leagueId: process.env.API_FOOTBALL_LEAGUE_FRIENDLY ?? "10",
      season: getWcSeason(),
    };
  }
  if (competition === "premier-league") {
    return { leagueId: process.env.API_FOOTBALL_LEAGUE_EPL ?? "39", season: "2025" };
  }
  return { leagueId: process.env.API_FOOTBALL_LEAGUE_SERIE_A ?? "135", season: "2025" };
}

export async function probeApiFootball(): Promise<ApiFetchDebug> {
  const { leagueId, season } = leagueParams("world-cup");
  const today = new Date().toISOString().slice(0, 10);
  const debug: ApiFetchDebug = {
    configured: isApiFootballConfigured(),
    leagueId,
    season,
    today,
    counts: {},
    errors: [],
  };

  if (!debug.configured) {
    debug.errors.push("API_FOOTBALL_KEY not set in Vercel environment variables");
    return debug;
  }

  const probes = [
    ["live", "/fixtures?live=all"],
    ["season", `/fixtures?league=${leagueId}&season=${season}`],
    ["today", `/fixtures?date=${today}&league=${leagueId}`],
    [
      "active",
      `/fixtures?league=${leagueId}&season=${season}&status=NS-1H-HT-2H-ET-P-LIVE`,
    ],
  ] as const;

  for (const [name, path] of probes) {
    if (!path) continue;
    const { fixtures, error } = await apiFetchRaw(path);
    debug.counts[name] = fixtures.length;
    if (error) debug.errors.push(`${name}: ${error}`);
    if (!debug.sampleFixtureId && fixtures[0]) {
      debug.sampleFixtureId = fixtures[0].fixture.id;
    }
  }

  if (debug.sampleFixtureId) {
    const key = getApiFootballKey();
    for (const [name, path] of [
      ["events", `/fixtures/events?fixture=${debug.sampleFixtureId}`],
      ["lineups", `/fixtures/lineups?fixture=${debug.sampleFixtureId}`],
    ] as const) {
      try {
        const res = await fetch(`${API_BASE}${path}`, {
          headers: { "x-apisports-key": key },
          cache: "no-store",
        });
        if (!res.ok) {
          debug.counts[name] = 0;
          debug.errors.push(`${name}: http_${res.status}`);
          continue;
        }
        const data = (await res.json()) as { response?: unknown[] };
        debug.counts[name] = data.response?.length ?? 0;
      } catch (e) {
        debug.counts[name] = 0;
        debug.errors.push(`${name}: ${e instanceof Error ? e.message : "fetch_failed"}`);
      }
    }
  }

  return debug;
}

export async function fetchApiFootballFixtures(
  competition: CompetitionId
): Promise<{ matches: Match[] | null; error?: string }> {
  if (!isApiFootballConfigured()) {
    return { matches: null, error: "no_key" };
  }

  const { leagueId, season } = leagueParams(competition);
  const dates = datesAroundToday();

  const queries =
    competition === "world-cup"
      ? [
          `/fixtures?league=${leagueId}&season=${season}`,
          `/fixtures?league=${leagueId}&season=${season}&status=NS-1H-HT-2H-ET-P-LIVE`,
          "/fixtures?live=all",
          ...dates.map((d) => `/fixtures?date=${d}&league=${leagueId}`),
        ]
      : [
          `/fixtures?league=${leagueId}&season=${season}`,
          `/fixtures?league=${leagueId}&season=${season}&status=NS-1H-HT-2H-ET-P-LIVE`,
          "/fixtures?live=all",
          ...dates.map((d) => `/fixtures?date=${d}&league=${leagueId}`),
          ...dates.map((d) => `/fixtures?date=${d}`),
        ];

  const results = await Promise.all(queries.map((path) => apiFetchRaw(path)));

  const errors = results.map((r) => r.error).filter(Boolean) as string[];
  const merged = dedupeFixtures(results.flatMap((r) => r.fixtures));
  const scoped = filterCompetitionFixtures(merged, competition, leagueId);

  if (scoped.length === 0) {
    return {
      matches: null,
      error: errors[0] ?? "no_fixtures",
    };
  }

  return { matches: sortMatches(scoped.map((f) => normalizeFixture(f, competition))) };
}

export async function fetchApiFootballLive(): Promise<Match[] | null> {
  const { matches } = await fetchApiFootballFixtures("world-cup");
  if (!matches) return null;
  const live = matches.filter(
    (m) => m.status === "live" || m.status === "halftime"
  );
  return live.length > 0 ? live : matches.slice(0, 16);
}
