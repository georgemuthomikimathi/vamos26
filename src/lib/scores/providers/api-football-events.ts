import { getApiFootballKey } from "@/lib/scores/providers/api-config";
import { teamNameToCode } from "@/lib/scores/providers/team-codes";
import { eventKey } from "@/lib/notifications/match-state";
import { parseApiFootballEvents } from "@/lib/scores/providers/fixture-enrichment";
import {
  apiFootballFetch,
  fixtureIdFromMatchId,
} from "@/lib/scores/providers/api-football-fetch";
import type { Match } from "@/lib/scores/types";

export type ApiMatchEvent = {
  minute: number;
  extraMinute?: number;
  type: "goal" | "red" | "penalty" | "penalty_missed" | "yellow";
  player: string;
  assist?: string;
  teamName: string;
  detail: string;
  key: string;
};

type RawEvent = {
  time: { elapsed: number | null; extra?: number | null };
  team: { name: string };
  player: { name: string };
  assist?: { name: string } | null;
  type: string;
  detail: string;
};

function rawToNotificationEvent(raw: RawEvent, matchId: string): ApiMatchEvent | null {
  const stubMatch = {
    id: matchId,
    home: { name: raw.team?.name ?? "", code: "" },
    away: { name: "", code: "" },
  } as Match;

  const { events } = parseApiFootballEvents([raw], stubMatch);
  const event = events[0];
  if (!event) return null;

  const teamName = raw.team?.name ?? "";

  if (event.type === "goal" || event.type === "penalty" || event.type === "penalty_missed") {
    return {
      minute: event.minute,
      extraMinute: event.extraMinute,
      type: event.type === "penalty_missed" ? "penalty_missed" : event.type,
      player: event.player,
      assist: event.playerSecondary,
      teamName,
      detail: event.detail ?? "",
      key: eventKey(matchId, event.minute, event.type, event.detail ?? "", event.player),
    };
  }

  if (event.type === "red" || event.type === "yellow") {
    return {
      minute: event.minute,
      extraMinute: event.extraMinute,
      type: event.type,
      player: event.player,
      teamName,
      detail: event.detail ?? "",
      key: eventKey(matchId, event.minute, event.type, event.detail ?? "", event.player),
    };
  }

  return null;
}

export async function fetchFixtureEvents(fixtureId: string): Promise<ApiMatchEvent[]> {
  const key = getApiFootballKey();
  if (!key) return [];

  const matchId = fixtureId.startsWith("af-") ? fixtureId : `af-${fixtureId}`;
  const numericId = fixtureIdFromMatchId(matchId);
  if (!numericId) return [];

  try {
    const { data } = await apiFootballFetch<RawEvent[]>(
      `/fixtures/events?fixture=${numericId}`,
      { revalidate: 15 }
    );
    if (!data?.length) return [];

    return data
      .map((raw) => rawToNotificationEvent(raw, matchId))
      .filter((e): e is ApiMatchEvent => e !== null);
  } catch {
    return [];
  }
}

export function formatEventNotification(
  matchLabel: string,
  event: ApiMatchEvent
): { title: string; body: string; tag: string } {
  const flag = teamNameToCode(event.teamName);
  const minuteLabel =
    event.extraMinute && event.extraMinute > 0
      ? `${event.minute}+${event.extraMinute}'`
      : `${event.minute}'`;

  switch (event.type) {
    case "goal":
      return {
        title: `⚽ GOAL — ${matchLabel}`,
        body: event.assist
          ? `${event.player} (${flag}) ${minuteLabel} · assist ${event.assist}`
          : `${event.player} (${event.teamName}) ${minuteLabel}`,
        tag: event.key,
      };
    case "penalty":
      return {
        title: `⚽ PENALTY GOAL — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${minuteLabel}`,
        tag: event.key,
      };
    case "penalty_missed":
      return {
        title: `❌ PENALTY MISSED — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${minuteLabel}`,
        tag: event.key,
      };
    case "red":
      return {
        title: `🟥 RED CARD — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${minuteLabel}${
          event.detail === "Second yellow" ? " · 2nd yellow" : ""
        }`,
        tag: event.key,
      };
    case "yellow":
      return {
        title: `🟨 YELLOW CARD — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${minuteLabel}`,
        tag: event.key,
      };
    default:
      return {
        title: matchLabel,
        body: `${event.player} ${minuteLabel}`,
        tag: event.key,
      };
  }
}
