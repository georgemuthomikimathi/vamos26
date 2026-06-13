export type NewsKind = "match-report" | "preview" | "guide" | "rss";

export type TeamNewsItem = {
  id: string;
  code: string;
  team: string;
  headline: string;
  summary: string;
  date: string;
  tag: "injury" | "squad" | "form" | "tactics";
  /** Article URL — external news source or internal guide */
  url: string;
  /** Display name for the publisher (ESPN, FIFA.com, VAMOS26, etc.) */
  source: string;
  /** When false, link opens in same tab via Next.js routing */
  external?: boolean;
  /** True when cross-checked against live scores / match facts */
  verified?: boolean;
  kind?: NewsKind;
};

/**
 * Static previews & guides only — never fabricated results.
 * Match reports are generated at runtime from verified scores.
 */
export const PREVIEW_NEWS: TeamNewsItem[] = [
  {
    id: "preview-usa-paraguay",
    code: "us",
    team: "USA",
    headline: "USA vs Paraguay: Group D opener tonight at SoFi (9PM ET)",
    summary:
      "Pochettino's 4-3-3 features Pulisic on the left and Adams anchoring midfield. The hosts need a strong start on home soil before Australia and Türkiye arrive.",
    date: "Jun 12",
    tag: "tactics",
    url: "/guides/group-d-usa-preview",
    source: "VAMOS26 Guide",
    external: false,
    verified: true,
    kind: "preview",
  },
  {
    id: "preview-brazil-morocco",
    code: "br",
    team: "Brazil",
    headline: "Brazil vs Morocco: MetLife showdown preview",
    summary:
      "Seleção bring Vinícius Jr's pace against a compact Atlas Lions side. East Rutherford expects a sell-out for the first World Cup match in the NY/NJ corridor.",
    date: "Jun 13",
    tag: "tactics",
    url: "https://www.fifa.com/en/matches?search=Brazil%20Morocco",
    source: "FIFA.com",
    verified: true,
    kind: "preview",
  },
  {
    id: "guide-nyc-watch",
    code: "us",
    team: "USA",
    headline: "Where to watch USA matches in NYC this week",
    summary:
      "Smithfield Hall, Football Factory, and official fan zones across all five boroughs — your match-day playbook for Group D and MetLife fixtures.",
    date: "Jun 11",
    tag: "squad",
    url: "/guides/nyc-match-day",
    source: "VAMOS26 Guide",
    external: false,
    verified: true,
    kind: "guide",
  },
  {
    id: "preview-england-croatia",
    code: "gb-eng",
    team: "England",
    headline: "Tuchel's England lean on Bellingham in new No. 10 role",
    summary:
      "Three Lions experiment with Bellingham behind Kane as Tuchel chases a first tournament win. Saka and Foden flanking the captain in a fluid front four.",
    date: "Jun 13",
    tag: "tactics",
    url: "https://www.fifa.com/en/matches?search=England%20Croatia",
    source: "FIFA.com",
    verified: true,
    kind: "preview",
  },
];

/** @deprecated Use PREVIEW_NEWS — kept for imports that still reference TEAM_NEWS */
export const TEAM_NEWS = PREVIEW_NEWS;

export function getNewsByTeam(code: string): TeamNewsItem[] {
  return PREVIEW_NEWS.filter((n) => n.code === code);
}

export function isExternalNews(item: TeamNewsItem): boolean {
  return item.external !== false;
}
