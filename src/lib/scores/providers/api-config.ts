const DEFAULT_WC_LEAGUE = "1";
const DEFAULT_WC_SEASON = "2026";

/** Resolve API-Football key from common env var names */
export function getApiFootballKey(): string {
  return (
    process.env.API_FOOTBALL_KEY?.trim() ||
    process.env.API_SPORTS_KEY?.trim() ||
    process.env.RAPIDAPI_KEY?.trim() ||
    process.env.NEXT_PUBLIC_API_FOOTBALL_KEY?.trim() ||
    ""
  );
}

function looksLikeApiKey(value: string): boolean {
  return /^[a-f0-9]{32}$/i.test(value.trim());
}

function looksLikeLeagueId(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

export type ApiFootballEnvCheck = {
  configured: boolean;
  keySource?: string;
  leagueId: string;
  season: string;
  warnings: string[];
};

/** Detect common Vercel misconfiguration (key pasted into league var, etc.) */
export function checkApiFootballEnv(): ApiFootballEnvCheck {
  const warnings: string[] = [];
  const key = getApiFootballKey();
  const rawLeague = process.env.API_FOOTBALL_LEAGUE_WC?.trim() ?? "";
  const rawSeason = process.env.API_FOOTBALL_SEASON?.trim() ?? "";

  let keySource: string | undefined;
  if (process.env.API_FOOTBALL_KEY?.trim()) keySource = "API_FOOTBALL_KEY";
  else if (process.env.API_SPORTS_KEY?.trim()) keySource = "API_SPORTS_KEY";
  else if (process.env.RAPIDAPI_KEY?.trim()) keySource = "RAPIDAPI_KEY";
  else if (process.env.NEXT_PUBLIC_API_FOOTBALL_KEY?.trim()) {
    keySource = "NEXT_PUBLIC_API_FOOTBALL_KEY";
    warnings.push("Use server-only API_FOOTBALL_KEY (not NEXT_PUBLIC_)");
  }

  if (rawLeague && looksLikeApiKey(rawLeague)) {
    warnings.push(
      "API_FOOTBALL_LEAGUE_WC looks like an API key — set it to 1 and move the key to API_FOOTBALL_KEY"
    );
  }

  if (key && looksLikeLeagueId(key)) {
    warnings.push("API_FOOTBALL_KEY looks like a league ID — paste your dashboard key instead");
  }

  if (key && /your_key|example|placeholder|changeme/i.test(key)) {
    warnings.push("API_FOOTBALL_KEY still looks like a placeholder — paste your paid key from dashboard.api-football.com");
  }

  const leagueId =
    rawLeague && looksLikeLeagueId(rawLeague) ? rawLeague : DEFAULT_WC_LEAGUE;
  if (rawLeague && !looksLikeLeagueId(rawLeague)) {
    warnings.push(`Invalid API_FOOTBALL_LEAGUE_WC "${rawLeague.slice(0, 8)}…" — using ${DEFAULT_WC_LEAGUE}`);
  }

  const season = rawSeason && /^\d{4}$/.test(rawSeason) ? rawSeason : DEFAULT_WC_SEASON;

  return {
    configured: key.length > 10 && !looksLikeLeagueId(key),
    keySource,
    leagueId,
    season,
    warnings,
  };
}

export function isApiFootballConfigured(): boolean {
  return checkApiFootballEnv().configured;
}

export function getWcLeagueId(): string {
  return checkApiFootballEnv().leagueId;
}

export function getWcSeason(): string {
  return checkApiFootballEnv().season;
}
