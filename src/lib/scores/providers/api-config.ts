const DEFAULT_WC_LEAGUE = "1";
const DEFAULT_WC_SEASON = "2026";

const PRIMARY_KEY_VARS = [
  { env: "API_FOOTBALL_KEY", source: "API_FOOTBALL_KEY" },
  { env: "API_SPORTS_KEY", source: "API_SPORTS_KEY" },
  { env: "RAPIDAPI_KEY", source: "RAPIDAPI_KEY" },
  { env: "NEXT_PUBLIC_API_FOOTBALL_KEY", source: "NEXT_PUBLIC_API_FOOTBALL_KEY" },
] as const;

const RECOVERY_LEAGUE_VARS = [
  "API_FOOTBALL_LEAGUE_WC",
  "API_FOOTBALL_LEAGUE_FRIENDLY",
  "API_FOOTBALL_LEAGUE_EPL",
  "API_FOOTBALL_LEAGUE_SERIE_A",
] as const;

function looksLikeApiKey(value: string): boolean {
  return /^[a-f0-9]{32,}$/i.test(value.trim());
}

function looksLikeLeagueId(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

function isPlaceholderKey(value: string): boolean {
  return /your_key|example|placeholder|changeme/i.test(value);
}

/** Strip quotes, newlines, Bearer/key= prefix; extract 32-char hex if embedded in junk */
function sanitizeKey(value: string): string {
  let cleaned = value
    .trim()
    .replace(/^Bearer\s+/i, "")
    .replace(/^key\s*=\s*/i, "")
    .replace(/^["']|["']$/g, "")
    .replace(/[\r\n\t\u200b\uFEFF]/g, "")
    .trim();

  if (looksLikeApiKey(cleaned)) return cleaned;

  const hexMatch = cleaned.match(/[a-f0-9]{32}/i);
  if (hexMatch) return hexMatch[0].toLowerCase();

  return cleaned;
}

export type ApiFootballAuthMode = "direct" | "rapidapi";

/** direct = x-apisports-key (dashboard.api-football.com). rapidapi = x-rapidapi-key */
export function getApiFootballAuthMode(): ApiFootballAuthMode {
  const mode = process.env.API_FOOTBALL_AUTH?.trim().toLowerCase();
  if (mode === "rapidapi") return "rapidapi";
  if (mode === "direct" || mode === "apisports") return "direct";
  const source = resolveApiKey().source ?? "";
  if (/RAPIDAPI/i.test(source)) return "rapidapi";
  return "direct";
}

function isValidApiKey(value: string): boolean {
  const trimmed = sanitizeKey(value);
  return (
    trimmed.length >= 32 &&
    looksLikeApiKey(trimmed) &&
    !looksLikeLeagueId(trimmed) &&
    !isPlaceholderKey(trimmed)
  );
}

type ResolvedKey = {
  key: string;
  source?: string;
  recoveredFromLeagueVar?: boolean;
  recoveredFromVar?: string;
};

function resolveApiKey(): ResolvedKey {
  for (const { env, source } of PRIMARY_KEY_VARS) {
    const value = sanitizeKey(process.env[env] ?? "");
    if (!value) continue;
    if (isValidApiKey(value)) {
      return { key: sanitizeKey(value), source };
    }
  }

  for (const env of RECOVERY_LEAGUE_VARS) {
    const value = sanitizeKey(process.env[env] ?? "");
    if (isValidApiKey(value)) {
      return {
        key: sanitizeKey(value),
        source: `${env} (auto-recovered)`,
        recoveredFromLeagueVar: env === "API_FOOTBALL_LEAGUE_WC",
        recoveredFromVar: env,
      };
    }
  }

  return { key: "" };
}

/** Resolve API-Football key from common env var names, with auto-recovery from misplaced league vars */
export function getApiFootballKey(): string {
  return resolveApiKey().key;
}

export type ApiFootballEnvCheck = {
  configured: boolean;
  keySource?: string;
  keyRecovered?: boolean;
  recoveredFromVar?: string;
  leagueId: string;
  season: string;
  warnings: string[];
};

/** Detect common Vercel misconfiguration (key pasted into league var, etc.) */
export function checkApiFootballEnv(): ApiFootballEnvCheck {
  const warnings: string[] = [];
  const resolved = resolveApiKey();
  const key = resolved.key;
  const rawLeague = process.env.API_FOOTBALL_LEAGUE_WC?.trim() ?? "";
  const rawSeason = process.env.API_FOOTBALL_SEASON?.trim() ?? "";

  if (resolved.recoveredFromLeagueVar) {
    warnings.push(
      `Auto-recovered API key from ${resolved.recoveredFromVar} — set API_FOOTBALL_KEY in Vercel and change ${resolved.recoveredFromVar} to 1`
    );
  } else if (rawLeague && looksLikeApiKey(rawLeague) && !resolved.key) {
    warnings.push(
      "API_FOOTBALL_LEAGUE_WC looks like an API key — set it to 1 and move the key to API_FOOTBALL_KEY"
    );
  }

  if (
    process.env.NEXT_PUBLIC_API_FOOTBALL_KEY?.trim() &&
    resolved.source === "NEXT_PUBLIC_API_FOOTBALL_KEY"
  ) {
    warnings.push("Use server-only API_FOOTBALL_KEY (not NEXT_PUBLIC_)");
  }

  const primaryFootballKey = process.env.API_FOOTBALL_KEY?.trim() ?? "";
  if (primaryFootballKey && looksLikeLeagueId(primaryFootballKey)) {
    warnings.push("API_FOOTBALL_KEY looks like a league ID — paste your dashboard key instead");
  }

  if (primaryFootballKey && isPlaceholderKey(primaryFootballKey)) {
    warnings.push(
      "API_FOOTBALL_KEY still looks like a placeholder — paste your paid key from dashboard.api-football.com"
    );
  }

  const forceDefaultLeague =
    resolved.recoveredFromLeagueVar ||
    (rawLeague && looksLikeApiKey(rawLeague) && isValidApiKey(rawLeague));

  const leagueId = forceDefaultLeague
    ? DEFAULT_WC_LEAGUE
    : rawLeague && looksLikeLeagueId(rawLeague)
      ? rawLeague
      : DEFAULT_WC_LEAGUE;

  if (rawLeague && !looksLikeLeagueId(rawLeague) && !looksLikeApiKey(rawLeague)) {
    warnings.push(`Invalid API_FOOTBALL_LEAGUE_WC "${rawLeague.slice(0, 8)}…" — using ${DEFAULT_WC_LEAGUE}`);
  }

  const season = rawSeason && /^\d{4}$/.test(rawSeason) ? rawSeason : DEFAULT_WC_SEASON;

  return {
    configured: isValidApiKey(key),
    keySource: resolved.source,
    keyRecovered: Boolean(resolved.recoveredFromLeagueVar),
    recoveredFromVar: resolved.recoveredFromVar,
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
