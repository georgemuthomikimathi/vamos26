/** Shared polling intervals for live tournament data (milliseconds). */
export const POLL_LIVE_MS = 120_000;
export const POLL_KICKOFF_MS = 60_000;
export const POLL_IDLE_MS = 300_000;
export const POLL_STATS_MS = 600_000;
export const POLL_NEWS_MS = 600_000;

export const SQUAD_REVEAL_MS = 30 * 60_000;
export const KICKOFF_BOOST_WINDOW_MS = 2 * 60_000;

export function msUntilKickoff(kickoffAt: string | undefined, now = Date.now()): number | null {
  if (!kickoffAt) return null;
  return new Date(kickoffAt).getTime() - now;
}

export function isNearKickoff(kickoffAt: string | undefined, now = Date.now()): boolean {
  const ms = msUntilKickoff(kickoffAt, now);
  if (ms == null) return false;
  return ms > -KICKOFF_BOOST_WINDOW_MS && ms <= KICKOFF_BOOST_WINDOW_MS;
}

export function isSquadRevealWindow(kickoffAt: string | undefined, now = Date.now()): boolean {
  if (!kickoffAt) return false;
  return now >= new Date(kickoffAt).getTime() - SQUAD_REVEAL_MS;
}

export function pickLivePollInterval(matches: { status: string; kickoffAt?: string }[]): number {
  const hasLive = matches.some((m) => m.status === "live" || m.status === "halftime");
  if (hasLive) return POLL_LIVE_MS;

  const nearKickoff = matches.some(
    (m) => m.status === "scheduled" && isNearKickoff(m.kickoffAt)
  );
  if (nearKickoff) return POLL_KICKOFF_MS;

  const squadReveal = matches.some(
    (m) => m.status === "scheduled" && isSquadRevealWindow(m.kickoffAt)
  );
  if (squadReveal) return POLL_KICKOFF_MS;

  return POLL_IDLE_MS;
}
