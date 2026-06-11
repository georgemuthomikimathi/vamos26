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

export function isApiFootballConfigured(): boolean {
  return getApiFootballKey().length > 10;
}

export function getWcLeagueId(): string {
  return process.env.API_FOOTBALL_LEAGUE_WC ?? "1";
}

export function getWcSeason(): string {
  return process.env.API_FOOTBALL_SEASON ?? "2026";
}
