import type { CompetitionId, Match, MatchStatus, Score } from "@/lib/scores/types";
import { formatKickoffET } from "@/lib/timezone";
import {
  getWcLeagueId,
  getWcSeason,
  isApiFootballConfigured,
  checkApiFootballEnv,
} from "@/lib/scores/providers/api-config";
import { apiFootballFetch } from "@/lib/scores/providers/api-football-fetch";
import {
  getCachedSeasonFixtures,
  setCachedSeasonFixtures,
} from "@/lib/scores/providers/api-football-fixture-cache";
import { isApiQuotaBlocked } from "@/lib/scores/providers/api-football-quota";
import { teamNameToCode } from "@/lib/scores/providers/team-codes";

export type ApiFetchDebug = {
  configured: boolean;
  leagueId: string;
  season: string;
  today: string;
  counts: Record<string, number>;
  errors: string[];
  envWarnings?: string[];
  keySource?: string;
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

/** Fetch a single fixture by API-Football id (avoids reloading the full schedule). */
export async function fetchApiFootballFixtureById(
  fixtureId: string | number,
  competition: CompetitionId = "world-cup"
): Promise<Match | null> {
  const { data, error } = await apiFootballFetch<ApiFixture[]>(
    `/fixtures?id=${fixtureId}`,
    {}
  );
  if (error || !data?.[0]) return null;
  return normalizeFixture(data[0], competition);
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

async function apiFetchRaw(path: string): Promise<{ fixtures: ApiFixture[]; error?: string }> {
  const { data, error } = await apiFootballFetch<ApiFixture[]>(path);
  if (error) return { fixtures: [], error };
  return { fixtures: data ?? [] };
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
  const env = checkApiFootballEnv();
  const { leagueId, season } = leagueParams("world-cup");
  const today = new Date().toISOString().slice(0, 10);
  return {
    configured: env.configured,
    leagueId,
    season,
    today,
    counts: {},
    errors: [...env.warnings],
    envWarnings: env.warnings,
    keySource: env.keySource,
  };
}

function recentDateWindow(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now);
  from.setUTCDate(from.getUTCDate() - 1);
  const to = new Date(now);
  to.setUTCDate(to.getUTCDate() + 2);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

/** One API call — fixtures in a 4-day window around today. */
export async function fetchApiFootballFixtures(
  competition: CompetitionId
): Promise<{ matches: Match[] | null; error?: string }> {
  if (!isApiFootballConfigured()) {
    return { matches: null, error: "no_key" };
  }
  if (isApiQuotaBlocked()) {
    return { matches: null, error: "quota_blocked" };
  }

  const { leagueId, season } = leagueParams(competition);
  const { from, to } = recentDateWindow();
  const path = `/fixtures?league=${leagueId}&season=${season}&from=${from}&to=${to}`;

  const { fixtures, error } = await apiFetchRaw(path);
  const scoped = filterCompetitionFixtures(fixtures, competition, leagueId);

  if (scoped.length === 0) {
    return { matches: null, error: error ?? "no_fixtures" };
  }

  return {
    matches: sortMatches(scoped.map((f) => normalizeFixture(f, competition))),
  };
}

/** One API call per day — full season for standings tables. */
export async function fetchApiFootballSeasonFixtures(
  competition: CompetitionId
): Promise<{ matches: Match[] | null; error?: string; fromCache?: boolean }> {
  const cached = getCachedSeasonFixtures();
  if (cached?.length) {
    return { matches: cached, fromCache: true };
  }

  if (!isApiFootballConfigured()) {
    return { matches: null, error: "no_key" };
  }
  if (isApiQuotaBlocked()) {
    return { matches: null, error: "quota_blocked" };
  }

  const { leagueId, season } = leagueParams(competition);
  const path = `/fixtures?league=${leagueId}&season=${season}`;
  const { fixtures, error } = await apiFetchRaw(path);
  const scoped = filterCompetitionFixtures(fixtures, competition, leagueId);

  if (scoped.length === 0) {
    return { matches: null, error: error ?? "no_fixtures" };
  }

  const matches = sortMatches(scoped.map((f) => normalizeFixture(f, competition)));
  setCachedSeasonFixtures(matches);
  return { matches };
}

export async function fetchApiFootballLive(): Promise<Match[] | null> {
  const { matches } = await fetchApiFootballFixtures("world-cup");
  if (!matches) return null;
  const live = matches.filter(
    (m) => m.status === "live" || m.status === "halftime"
  );
  return live.length > 0 ? live : matches.slice(0, 16);
}
