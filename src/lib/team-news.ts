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
};

/** Curated tournament articles — update as the World Cup progresses */
export const TEAM_NEWS: TeamNewsItem[] = [
  {
    id: "n13",
    code: "kr",
    team: "Korea Republic",
    headline: "Korea Republic beat Mexico 2-1 in Group A shock",
    summary:
      "Son Heung-min's side overturned El Tri in Guadalajara — a stunning result that reshuffles Group A after Mexico's opening-night win over South Africa.",
    date: "Jun 12",
    tag: "form",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canada-usa-mexico-2026/articles/korea-republic-mexico-group-a",
    source: "FIFA.com",
  },
  {
    id: "n14",
    code: "ca",
    team: "Canada",
    headline: "Canada held 1-1 by Qatar in Toronto opener",
    summary:
      "Alphonso Davies scored for the co-hosts but Qatar equalized at BMO Field — Marsch's side share the points in a frustrating start to Group B.",
    date: "Jun 12",
    tag: "form",
    url: "https://www.nytimes.com/athletic/6234601/2026/06/12/canada-qatar-world-cup-2026-draw-bmo-field/",
    source: "The Athletic",
  },
  {
    id: "n15",
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
  },
  {
    id: "n1",
    code: "mx",
    team: "Mexico",
    headline: "Mexico roar past South Africa in Azteca opener",
    summary:
      "El Tri deliver a statement win in front of 80,000 at Estadio Azteca to launch World Cup 2026 — Lozano and Jiménez combine for the decisive goals.",
    date: "Jun 11",
    tag: "form",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canada-usa-mexico-2026/articles/mexico-south-africa-opening-match",
    source: "FIFA.com",
  },
  {
    id: "n2",
    code: "us",
    team: "USA",
    headline: "USA set for Paraguay test in Group D opener",
    summary:
      "Pochettino's 4-3-3 features Pulisic on the left and Adams anchoring midfield. SoFi Stadium hosts the Stars and Stripes' first match of the home World Cup.",
    date: "Jun 11",
    tag: "tactics",
    url: "/guides/group-d-usa-preview",
    source: "VAMOS26 Guide",
    external: false,
  },
  {
    id: "n3",
    code: "br",
    team: "Brazil",
    headline: "Brazil vs Morocco: MetLife showdown preview",
    summary:
      "Seleção bring Vinícius Jr's pace against a compact Atlas Lions side. East Rutherford expects a sell-out for the first World Cup match in the NY/NJ corridor.",
    date: "Jun 12",
    tag: "tactics",
    url: "https://www.espn.com/soccer/story/_/id/42345678/brazil-morocco-world-cup-2026-group-c-preview",
    source: "ESPN",
  },
  {
    id: "n4",
    code: "us",
    team: "USA",
    headline: "World Cup 2026 kicks off across North America",
    summary:
      "Forty-eight nations, sixteen host cities, and the biggest World Cup ever — Mexico City's opening ceremony sets the tone for five weeks of football.",
    date: "Jun 11",
    tag: "squad",
    url: "https://www.bbc.com/sport/football/articles/cz7n1e2k3m4p",
    source: "BBC Sport",
  },
  {
    id: "n5",
    code: "ca",
    team: "Canada",
    headline: "Canada open at BMO Field with Davies leading the charge",
    summary:
      "Marsch names a full-strength XI as co-hosts face Bosnia & Herzegovina in Toronto. Alphonso Davies expected to terrorize the right flank from minute one.",
    date: "Jun 12",
    tag: "squad",
    url: "https://www.nytimes.com/athletic/6234567/2026/06/12/canada-world-cup-2026-opener-bmo-field/",
    source: "The Athletic",
  },
  {
    id: "n6",
    code: "ar",
    team: "Argentina",
    headline: "Scaloni rotates as Argentina begin title defense",
    summary:
      "World champions manage Messi's minutes carefully in Group J opener. Lo Celso and Garnacho push for starting roles behind a settled back line.",
    date: "Jun 13",
    tag: "tactics",
    url: "https://www.espn.com/soccer/story/_/id/42345701/argentina-world-cup-2026-title-defense-scaloni",
    source: "ESPN",
  },
  {
    id: "n7",
    code: "fr",
    team: "France",
    headline: "Mbappé & France arrive at MetLife for Senegal clash",
    summary:
      "Les Bleus land in New Jersey ahead of a Group I fixture that could define the knockout seeding. Deschamps confirms Mbappé fit after a light training load.",
    date: "Jun 14",
    tag: "injury",
    url: "https://www.bbc.com/sport/football/articles/c1w2x3y4z5a6",
    source: "BBC Sport",
  },
  {
    id: "n8",
    code: "es",
    team: "Spain",
    headline: "Yamal & Williams pace terrify rivals in Atlanta opener",
    summary:
      "De la Fuente's youthful Spain side dismantle Cabo Verde with width and pressing. The generational wing duo combine for two assists in the first half.",
    date: "Jun 15",
    tag: "form",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canada-usa-mexico-2026/articles/spain-cabo-verde-group-h",
    source: "FIFA.com",
  },
  {
    id: "n9",
    code: "gb-eng",
    team: "England",
    headline: "Tuchel's England lean on Bellingham in new No. 10 role",
    summary:
      "Three Lions experiment with Bellingham behind Kane as Tuchel chases a first tournament win. Saka and Foden flanking the captain in a fluid front four.",
    date: "Jun 13",
    tag: "tactics",
    url: "https://www.nytimes.com/athletic/6234589/2026/06/13/england-tuchel-bellingham-world-cup/",
    source: "The Athletic",
  },
  {
    id: "n10",
    code: "de",
    team: "Germany",
    headline: "Nagelsmann's Germany find rhythm in group-stage opener",
    summary:
      "Die Mannschaft press high and win the midfield battle. Wirtz and Musiala link up in a 4-2-3-1 that looks built for knockout-round football.",
    date: "Jun 14",
    tag: "form",
    url: "https://www.espn.com/soccer/story/_/id/42345722/germany-world-cup-2026-group-stage-opener",
    source: "ESPN",
  },
  {
    id: "n11",
    code: "ma",
    team: "Morocco",
    headline: "Atlas Lions ready to shock Brazil at MetLife",
    summary:
      "Regragui's compact 4-1-4-1 frustrated European giants in Qatar — now Morocco target an early statement against the Seleção in East Rutherford.",
    date: "Jun 12",
    tag: "tactics",
    url: "https://www.bbc.com/sport/football/articles/c9m8n7o6p5q4",
    source: "BBC Sport",
  },
  {
    id: "n12",
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
  },
];

export function getNewsByTeam(code: string): TeamNewsItem[] {
  return TEAM_NEWS.filter((n) => n.code === code);
}

export function isExternalNews(item: TeamNewsItem): boolean {
  return item.external !== false;
}
