/** Broadcast when a match transitions from live → finished so stats/standings/news refresh. */
export const MATCH_FINISHED_EVENT = "vamos26:match-finished";
export const DATA_REFRESH_EVENT = "vamos26:data-refresh";

export type MatchFinishedDetail = {
  matchId: string;
  home: string;
  away: string;
};

export function dispatchMatchFinished(detail: MatchFinishedDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MATCH_FINISHED_EVENT, { detail }));
}

export function dispatchDataRefresh(reason: "match-finished" | "manual" | "kickoff"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DATA_REFRESH_EVENT, { detail: { reason } }));
}

export function onMatchFinished(handler: (detail: MatchFinishedDetail) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const listener = (e: Event) => {
    handler((e as CustomEvent<MatchFinishedDetail>).detail);
  };
  window.addEventListener(MATCH_FINISHED_EVENT, listener);
  return () => window.removeEventListener(MATCH_FINISHED_EVENT, listener);
}

export function onDataRefresh(handler: (reason: string) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const listener = (e: Event) => {
    const reason = (e as CustomEvent<{ reason: string }>).detail?.reason ?? "unknown";
    handler(reason);
  };
  window.addEventListener(DATA_REFRESH_EVENT, listener);
  return () => window.removeEventListener(DATA_REFRESH_EVENT, listener);
}
