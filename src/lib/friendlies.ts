import type { Match } from "@/lib/scores/types";

/** International friendlies — recent results + upcoming warm-ups */
export const FRIENDLY_MATCHES: Match[] = [
  {
    id: "f1",
    competition: "friendly",
    status: "finished",
    date: "Mar 22",
    time: "8:00 PM ET",
    home: { name: "USA", code: "us" },
    away: { name: "Mexico", code: "mx" },
    venue: "AT&T Stadium",
    city: "Arlington, TX",
    stage: "International Friendly",
    score: { home: 2, away: 1 },
    events: [
      { minute: 34, type: "goal", player: "Christian Pulisic", team: "home" },
      { minute: 58, type: "goal", player: "Hirving Lozano", team: "away" },
      { minute: 81, type: "goal", player: "Folarin Balogun", team: "home" },
    ],
  },
  {
    id: "f2",
    competition: "friendly",
    status: "finished",
    date: "Mar 25",
    time: "3:00 PM ET",
    home: { name: "Brazil", code: "br" },
    away: { name: "Argentina", code: "ar" },
    venue: "MetLife Stadium",
    city: "East Rutherford, NJ",
    stage: "International Friendly",
    score: { home: 3, away: 0 },
    events: [
      { minute: 12, type: "goal", player: "Rodrygo", team: "home" },
      { minute: 44, type: "goal", player: "Vinícius Júnior", team: "home" },
      { minute: 77, type: "goal", player: "Endrick", team: "home" },
    ],
  },
  {
    id: "f3",
    competition: "friendly",
    status: "finished",
    date: "Mar 26",
    time: "2:45 PM ET",
    home: { name: "England", code: "gb-eng" },
    away: { name: "Belgium", code: "be" },
    venue: "Wembley Stadium",
    city: "London",
    stage: "International Friendly",
    score: { home: 2, away: 2 },
    events: [
      { minute: 19, type: "goal", player: "Harry Kane", team: "home" },
      { minute: 33, type: "goal", player: "Leandro Trossard", team: "away" },
      { minute: 61, type: "goal", player: "Jude Bellingham", team: "home" },
      { minute: 88, type: "goal", player: "Jérémy Doku", team: "away" },
    ],
  },
  {
    id: "f4",
    competition: "friendly",
    status: "finished",
    date: "Mar 28",
    time: "7:00 PM ET",
    home: { name: "France", code: "fr" },
    away: { name: "Germany", code: "de" },
    venue: "Stade de France",
    city: "Paris",
    stage: "International Friendly",
    score: { home: 1, away: 0 },
    events: [{ minute: 72, type: "goal", player: "Kylian Mbappé", team: "home" }],
  },
  {
    id: "f5",
    competition: "friendly",
    status: "finished",
    date: "Mar 29",
    time: "4:00 PM ET",
    home: { name: "Colombia", code: "co" },
    away: { name: "Spain", code: "es" },
    venue: "Hard Rock Stadium",
    city: "Miami Gardens, FL",
    stage: "International Friendly",
    score: { home: 1, away: 1 },
    events: [
      { minute: 27, type: "goal", player: "Díaz", team: "home" },
      { minute: 65, type: "goal", player: "Morata", team: "away" },
    ],
  },
  {
    id: "f6",
    competition: "friendly",
    status: "scheduled",
    date: "Apr 2",
    time: "9:00 PM ET",
    home: { name: "Canada", code: "ca" },
    away: { name: "Netherlands", code: "nl" },
    venue: "BC Place",
    city: "Vancouver",
    stage: "International Friendly",
    score: { home: null, away: null },
  },
];

export function getFriendlySummary(matches: Match[] = FRIENDLY_MATCHES) {
  const finished = matches.filter((m) => m.status === "finished").length;
  const upcoming = matches.filter((m) => m.status === "scheduled").length;
  const live = matches.filter((m) => m.status === "live" || m.status === "halftime").length;
  const goals = matches.reduce(
    (sum, m) => sum + (m.score.home ?? 0) + (m.score.away ?? 0),
    0
  );
  return { finished, upcoming, live, goals, total: matches.length };
}
