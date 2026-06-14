import type { Match } from "@/lib/scores/types";
import { formatScore } from "@/lib/scores/types";
import { DISPLAY_TIMEZONE } from "@/lib/timezone";

/** First World Cup 2026 match day (Mexico opener) in Eastern Time. */
export const TOURNAMENT_START_ET = "2026-06-11";

export type TournamentKeyDate = {
  date: string;
  event: string;
  detail: string;
};

export type GroupStoryline = {
  letter: string;
  title: string;
  body: string;
};

export type TournamentDayContext = {
  tournamentDay: number;
  badge: string;
  lead: string;
  highlightTitle: string;
  highlightBody: string;
  keyDates: TournamentKeyDate[];
  groupStorylines: GroupStoryline[];
  finishedToday: Match[];
  liveToday: Match[];
  upcomingToday: Match[];
};

const FINAL_KEY_DATE: TournamentKeyDate = {
  date: "Jul 19",
  event: "THE FINAL",
  detail: "MetLife Stadium — East Rutherford, NJ",
};

const etDateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: DISPLAY_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const etDisplayDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: DISPLAY_TIMEZONE,
  month: "short",
  day: "numeric",
});

export function getEtDateKey(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return etDateKeyFormatter.format(d);
}

function dateKeyToUtcMs(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getTournamentDay(now = new Date()): number {
  const today = getEtDateKey(now);
  if (today < TOURNAMENT_START_ET) return 0;
  const diff =
    (dateKeyToUtcMs(today) - dateKeyToUtcMs(TOURNAMENT_START_ET)) / 86_400_000;
  return Math.floor(diff) + 1;
}

function tournamentDayFromDateKey(dateKey: string): number {
  if (dateKey < TOURNAMENT_START_ET) return 0;
  const diff =
    (dateKeyToUtcMs(dateKey) - dateKeyToUtcMs(TOURNAMENT_START_ET)) / 86_400_000;
  return Math.floor(diff) + 1;
}

function parseMatchDateLabel(label: string): string | null {
  const m = label.trim().match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
  if (!m) return null;
  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const month = monthMap[m[1]];
  if (!month) return null;
  return `2026-${month}-${String(m[2]).padStart(2, "0")}`;
}

export function matchEtDateKey(match: Match): string | null {
  if (match.kickoffAt) return getEtDateKey(match.kickoffAt);
  if (match.date) return parseMatchDateLabel(match.date);
  return null;
}

function formatEtDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return etDisplayDateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatShortResult(match: Match): string {
  return `${match.home.name} ${formatScore(match.score)} ${match.away.name}`;
}

function extractGroupLetter(stage: string): string | null {
  const m = stage.match(/Group\s+([A-L])/i);
  return m ? m[1].toUpperCase() : null;
}

function totalGoals(match: Match): number {
  return (match.score.home ?? 0) + (match.score.away ?? 0);
}

function pickFeaturedMatch(matches: Match[]): Match | null {
  if (matches.length === 0) return null;
  return [...matches].sort((a, b) => totalGoals(b) - totalGoals(a))[0];
}

function joinNatural(items: string[], max = 3): string {
  const slice = items.slice(0, max);
  if (slice.length === 0) return "";
  if (slice.length === 1) return slice[0];
  if (slice.length === 2) return `${slice[0]} and ${slice[1]}`;
  return `${slice.slice(0, -1).join(", ")}, and ${slice[slice.length - 1]}`;
}

function buildBadge(
  day: number,
  liveToday: Match[],
  upcomingToday: Match[]
): string {
  if (liveToday.length > 0) {
    const m = liveToday[0];
    return `Live · ${m.home.name} vs ${m.away.name}`;
  }
  if (upcomingToday.length > 0) {
    const m = upcomingToday[0];
    return `Today · ${m.home.name} vs ${m.away.name} · ${m.time}`;
  }
  if (day > 0) return `Day ${day} · World Cup 2026`;
  return "World Cup 2026 · Jun 11 kickoff";
}

function buildLead(
  day: number,
  finishedToday: Match[],
  liveToday: Match[],
  upcomingToday: Match[],
  finishedBeforeToday: Match[]
): string {
  if (day <= 0) {
    return "The road to North America 2026 starts June 11 at Estadio Azteca. Every goal, lineup, and knockout moment from Mexico City to MetLife.";
  }

  const sentences: string[] = [`Day ${day} of the tournament.`];

  if (finishedToday.length > 0) {
    const results = finishedToday.map(formatShortResult);
    const head = joinNatural(results, 3);
    const extra =
      finishedToday.length > 3
        ? ` — plus ${finishedToday.length - 3} more result${finishedToday.length - 3 === 1 ? "" : "s"}`
        : "";
    sentences.push(
      `${head}${extra} ${finishedToday.length === 1 ? "is" : "are"} in the books today.`
    );
  } else if (finishedBeforeToday.length > 0) {
    const recent = finishedBeforeToday.slice(0, 2).map(formatShortResult);
    sentences.push(
      `${joinNatural(recent)} ${recent.length === 1 ? "has" : "have"} already finished — more football on deck today.`
    );
  }

  if (liveToday.length > 0) {
    const labels = liveToday.map((m) => `${m.home.name} vs ${m.away.name}`);
    sentences.push(
      `${joinNatural(labels, 2)} ${liveToday.length === 1 ? "is" : "are"} live right now.`
    );
  }

  if (upcomingToday.length > 0) {
    const next = upcomingToday[0];
    const more =
      upcomingToday.length > 1
        ? ` (${upcomingToday.length - 1} more on today's slate)`
        : "";
    sentences.push(
      `Still to come: ${next.home.name} vs ${next.away.name} at ${next.venue} (${next.time})${more}.`
    );
  }

  sentences.push(
    "Every goal, lineup, and knockout moment from Mexico City to MetLife."
  );

  return sentences.join(" ");
}

function buildHighlight(
  liveToday: Match[],
  finishedToday: Match[],
  upcomingToday: Match[],
  day: number
): { title: string; body: string } {
  if (liveToday.length > 0) {
    const m = liveToday[0];
    return {
      title: "Watch live now",
      body: `${m.home.name} vs ${m.away.name} · ${m.stage} at ${m.venue}`,
    };
  }
  if (finishedToday.length > 0) {
    const top = pickFeaturedMatch(finishedToday)!;
    return {
      title: `Day ${day} results rolling in`,
      body: `${formatShortResult(top)} — tap Past Results for squads, goals, cards & subs.`,
    };
  }
  if (upcomingToday.length > 0) {
    const m = upcomingToday[0];
    return {
      title: "Next up today",
      body: `${m.home.name} vs ${m.away.name} · ${m.time} at ${m.venue}`,
    };
  }
  return {
    title: "Tournament underway",
    body: "View past fixtures — full squads, goals, subs & officials on tap",
  };
}

function buildRecentKeyDates(matches: Match[]): TournamentKeyDate[] {
  const finished = matches.filter((m) => m.status === "finished");
  const byDate = new Map<string, Match[]>();

  for (const match of finished) {
    const key = matchEtDateKey(match);
    if (!key) continue;
    const list = byDate.get(key) ?? [];
    list.push(match);
    byDate.set(key, list);
  }

  const recent = [...byDate.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 3);

  const dynamic: TournamentKeyDate[] = recent.map(([dateKey, dayMatches]) => {
    const dayNum = tournamentDayFromDateKey(dateKey);
    const featured = pickFeaturedMatch(dayMatches)!;
    const others = dayMatches
      .filter((m) => m.id !== featured.id)
      .slice(0, 2)
      .map(formatShortResult);

    const detail =
      others.length > 0
        ? `${formatShortResult(featured)} · ${others.join(" · ")}`
        : `${formatShortResult(featured)} at ${featured.venue}`;

    return {
      date: formatEtDateLabel(dateKey),
      event: dayNum > 0 ? `Match Day ${dayNum}` : "Results",
      detail,
    };
  });

  if (dynamic.length === 0) {
    return [
      {
        date: "Jun 11",
        event: "Tournament Underway",
        detail: "Opening match at Estadio Azteca",
      },
      FINAL_KEY_DATE,
    ];
  }

  if (dynamic.length < 4) {
    return [...dynamic, FINAL_KEY_DATE];
  }

  return dynamic;
}

function buildGroupStorylines(
  matches: Match[],
  finishedToday: Match[],
  liveToday: Match[],
  upcomingToday: Match[]
): GroupStoryline[] {
  const priority = [...liveToday, ...upcomingToday, ...finishedToday];
  const fallbackFinished = matches
    .filter((m) => m.status === "finished")
    .sort(
      (a, b) =>
        (matchEtDateKey(b) ?? "").localeCompare(matchEtDateKey(a) ?? "") ||
        totalGoals(b) - totalGoals(a)
    );

  const pool = priority.length > 0 ? priority : fallbackFinished;
  const byGroup = new Map<string, Match>();

  for (const match of pool) {
    const letter = extractGroupLetter(match.stage);
    if (!letter || byGroup.has(letter)) continue;
    byGroup.set(letter, match);
  }

  const storylines: GroupStoryline[] = [...byGroup.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 4)
    .map(([letter, match]) => {
      if (match.status === "finished") {
        return {
          letter,
          title: `${match.home.name} ${formatScore(match.score)} ${match.away.name}`,
          body: `Full time in ${match.city || match.venue} — ${match.stage}. Group ${letter} picture updates on the standings board.`,
        };
      }
      if (match.status === "live" || match.status === "halftime") {
        return {
          letter,
          title: `${match.home.name} vs ${match.away.name} live`,
          body: `${match.stage} at ${match.venue} — follow goals, cards, and subs in Live Scores.`,
        };
      }
      return {
        letter,
        title: `${match.home.name} vs ${match.away.name} today`,
        body: `${match.stage} kicks off ${match.time} at ${match.venue}.`,
      };
    });

  if (storylines.length >= 4) return storylines;

  for (const match of fallbackFinished) {
    if (storylines.length >= 4) break;
    const letter = extractGroupLetter(match.stage);
    if (!letter || byGroup.has(letter)) continue;
    byGroup.set(letter, match);
    storylines.push({
      letter,
      title: `${match.home.name} ${formatScore(match.score)} ${match.away.name}`,
      body: `${match.stage} — result locked in from ${match.city || match.venue}.`,
    });
  }

  return storylines.slice(0, 4);
}

export function buildTournamentDayContext(
  matches: Match[],
  now = new Date()
): TournamentDayContext {
  const todayKey = getEtDateKey(now);
  const tournamentDay = getTournamentDay(now);

  const todayMatches = matches.filter((m) => matchEtDateKey(m) === todayKey);
  const finishedToday = todayMatches.filter((m) => m.status === "finished");
  const liveToday = todayMatches.filter(
    (m) => m.status === "live" || m.status === "halftime"
  );
  const upcomingToday = todayMatches
    .filter((m) => m.status === "scheduled")
    .sort(
      (a, b) =>
        (a.kickoffAt ? new Date(a.kickoffAt).getTime() : 0) -
        (b.kickoffAt ? new Date(b.kickoffAt).getTime() : 0)
    );

  const finishedBeforeToday = matches
    .filter((m) => m.status === "finished")
    .filter((m) => {
      const key = matchEtDateKey(m);
      return key != null && key < todayKey;
    })
    .sort((a, b) => (matchEtDateKey(b) ?? "").localeCompare(matchEtDateKey(a) ?? ""));

  const highlight = buildHighlight(
    liveToday,
    finishedToday,
    upcomingToday,
    tournamentDay
  );

  return {
    tournamentDay,
    badge: buildBadge(tournamentDay, liveToday, upcomingToday),
    lead: buildLead(
      tournamentDay,
      finishedToday,
      liveToday,
      upcomingToday,
      finishedBeforeToday
    ),
    highlightTitle: highlight.title,
    highlightBody: highlight.body,
    keyDates: buildRecentKeyDates(matches),
    groupStorylines: buildGroupStorylines(
      matches,
      finishedToday,
      liveToday,
      upcomingToday
    ),
    finishedToday,
    liveToday,
    upcomingToday,
  };
}
