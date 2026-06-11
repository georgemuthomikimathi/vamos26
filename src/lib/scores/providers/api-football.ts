import type { CompetitionId, Match, MatchStatus, Score } from "@/lib/scores/types";
import { teamNameToCode } from "@/lib/scores/providers/team-codes";

const API_BASE = "https://v3.football.api-sports.io";

type ApiFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue?: { name?: string; city?: string };
  };
  league: { round?: string; name?: string };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: { home: number | null; away: number | null };
};

function mapStatus(short: string): MatchStatus {
  if (["1H", "2H", "ET", "P", "LIVE"].includes(short)) return "live";
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
    minute: f.fixture.status.elapsed ?? undefined,
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

export function isApiFootballConfigured(): boolean {
  return Boolean(process.env.API_FOOTBALL_KEY?.trim());
}

export async function fetchApiFootballFixtures(
  competition: CompetitionId
): Promise<Match[] | null> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) return null;

  const leagueId =
    competition === "world-cup"
      ? process.env.API_FOOTBALL_LEAGUE_WC ?? "1"
      : competition === "friendly"
        ? process.env.API_FOOTBALL_LEAGUE_FRIENDLY ?? "10"
        : competition === "premier-league"
          ? process.env.API_FOOTBALL_LEAGUE_EPL ?? "39"
          : process.env.API_FOOTBALL_LEAGUE_SERIE_A ?? "135";

  const season =
    process.env.API_FOOTBALL_SEASON ??
    (competition === "world-cup" ? "2026" : "2025");

  const url = `${API_BASE}/fixtures?league=${leagueId}&season=${season}`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": key },
      next: { revalidate: 30 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { response?: ApiFixture[] };
    const fixtures = data.response ?? [];
    if (fixtures.length === 0) return null;

    return fixtures.map((f) => normalizeFixture(f, competition));
  } catch {
    return null;
  }
}

/** Live fixtures across all leagues (great for testing before WC fixtures exist) */
export async function fetchApiFootballLive(): Promise<Match[] | null> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) return null;

  try {
    const res = await fetch(`${API_BASE}/fixtures?live=all`, {
      headers: { "x-apisports-key": key },
      next: { revalidate: 15 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { response?: ApiFixture[] };
    const fixtures = data.response ?? [];
    if (fixtures.length === 0) return null;

    return fixtures.slice(0, 12).map((f) => normalizeFixture(f, "world-cup"));
  } catch {
    return null;
  }
}
