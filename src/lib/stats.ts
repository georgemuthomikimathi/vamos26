export type StatLeader = {
  rank: number;
  name: string;
  country: string;
  code: string;
  club: string;
  value: number;
  detail?: string;
  imageSlug?: string;
};

export const TOP_SCORERS: StatLeader[] = [
  { rank: 1, name: "Kylian Mbappé", country: "France", code: "fr", club: "Real Madrid", value: 0, imageSlug: "kylian-mbappe" },
  { rank: 2, name: "Erling Haaland", country: "Norway", code: "no", club: "Manchester City", value: 0, imageSlug: "erling-haaland" },
  { rank: 3, name: "Vinícius Júnior", country: "Brazil", code: "br", club: "Real Madrid", value: 0, imageSlug: "vinicius-junior" },
  { rank: 4, name: "Harry Kane", country: "England", code: "gb-eng", club: "Bayern Munich", value: 0, imageSlug: "harry-kane" },
  { rank: 5, name: "Lamine Yamal", country: "Spain", code: "es", club: "Barcelona", value: 0, imageSlug: "lamine-yamal" },
  { rank: 6, name: "Christian Pulisic", country: "USA", code: "us", club: "AC Milan", value: 0, imageSlug: "christian-pulisic" },
];

export const TOP_ASSISTS: StatLeader[] = [
  { rank: 1, name: "Florian Wirtz", country: "Germany", code: "de", club: "Liverpool", value: 0, imageSlug: "florian-wirtz" },
  { rank: 2, name: "Kevin De Bruyne", country: "Belgium", code: "be", club: "Man City", value: 0, imageSlug: "kevin-de-bruyne" },
  { rank: 3, name: "Pedri", country: "Spain", code: "es", club: "Barcelona", value: 0, imageSlug: "pedri" },
  { rank: 4, name: "Jude Bellingham", country: "England", code: "gb-eng", club: "Real Madrid", value: 0, imageSlug: "jude-bellingham" },
  { rank: 5, name: "Alexis Mac Allister", country: "Argentina", code: "ar", club: "Liverpool", value: 0, imageSlug: "alexis-mac-allister" },
];

export const CLEAN_SHEETS: StatLeader[] = [
  { rank: 1, name: "Emiliano Martínez", country: "Argentina", code: "ar", club: "Aston Villa", value: 0, detail: "GK", imageSlug: "emiliano-martinez" },
  { rank: 2, name: "Gianluigi Donnarumma", country: "Italy", code: "it", club: "PSG", value: 0, detail: "GK", imageSlug: "gianluigi-donnarumma" },
  { rank: 3, name: "Alisson Becker", country: "Brazil", code: "br", club: "Liverpool", value: 0, detail: "GK", imageSlug: "alisson-becker" },
  { rank: 4, name: "Mike Maignan", country: "France", code: "fr", club: "AC Milan", value: 0, detail: "GK", imageSlug: "mike-maignan" },
  { rank: 5, name: "Matt Turner", country: "USA", code: "us", club: "Crystal Palace", value: 0, detail: "GK", imageSlug: "matt-turner" },
];
