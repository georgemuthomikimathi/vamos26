import { teamNameToCode } from "@/lib/scores/providers/team-codes";
import { eventKey } from "@/lib/notifications/match-state";

export type ApiMatchEvent = {
  minute: number;
  type: "goal" | "red" | "penalty" | "penalty_missed" | "yellow";
  player: string;
  teamName: string;
  detail: string;
  key: string;
};

type RawEvent = {
  time: { elapsed: number | null; extra?: number | null };
  team: { name: string };
  player: { name: string };
  type: string;
  detail: string;
};

function classifyEvent(raw: RawEvent, matchId: string): ApiMatchEvent | null {
  const minute = raw.time.elapsed ?? 0;
  const player = raw.player?.name ?? "Unknown";
  const teamName = raw.team?.name ?? "";
  const detail = raw.detail ?? "";
  const type = raw.type ?? "";

  if (type === "Goal") {
    if (/penalty/i.test(detail) && !/missed/i.test(detail)) {
      return {
        minute,
        type: "penalty",
        player,
        teamName,
        detail,
        key: eventKey(matchId, minute, type, detail, player),
      };
    }
    if (/missed penalty/i.test(detail)) {
      return {
        minute,
        type: "penalty_missed",
        player,
        teamName,
        detail,
        key: eventKey(matchId, minute, type, detail, player),
      };
    }
    return {
      minute,
      type: "goal",
      player,
      teamName,
      detail,
      key: eventKey(matchId, minute, type, detail, player),
    };
  }

  if (type === "Card" && /red/i.test(detail)) {
    return {
      minute,
      type: "red",
      player,
      teamName,
      detail,
      key: eventKey(matchId, minute, type, detail, player),
    };
  }

  return null;
}

export async function fetchFixtureEvents(fixtureId: string): Promise<ApiMatchEvent[]> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) return [];

  const numericId = fixtureId.replace(/^af-/, "");

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures/events?fixture=${numericId}`,
      {
        headers: { "x-apisports-key": key },
        next: { revalidate: 15 },
      }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { response?: RawEvent[] };
    const matchId = fixtureId.startsWith("af-") ? fixtureId : `af-${fixtureId}`;

    return (data.response ?? [])
      .map((e) => classifyEvent(e, matchId))
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
  switch (event.type) {
    case "goal":
      return {
        title: `⚽ GOAL — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${event.minute}'`,
        tag: event.key,
      };
    case "penalty":
      return {
        title: `⚽ PENALTY GOAL — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${event.minute}'`,
        tag: event.key,
      };
    case "penalty_missed":
      return {
        title: `❌ PENALTY MISSED — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${event.minute}'`,
        tag: event.key,
      };
    case "red":
      return {
        title: `🟥 RED CARD — ${matchLabel}`,
        body: `${event.player} (${event.teamName}) ${event.minute}'`,
        tag: event.key,
      };
    default:
      return {
        title: matchLabel,
        body: `${event.player} ${event.minute}'`,
        tag: event.key,
      };
  }
}
