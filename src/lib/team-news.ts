export type TeamNewsItem = {
  id: string;
  code: string;
  team: string;
  headline: string;
  summary: string;
  date: string;
  tag: "injury" | "squad" | "form" | "tactics";
};

/** Curated team news — update as squads evolve */
export const TEAM_NEWS: TeamNewsItem[] = [
  {
    id: "n1",
    code: "us",
    team: "USA",
    headline: "Pochettino locks 26-man roster ahead of group stage",
    summary: "Pulisic captains; Adams and Musah anchor midfield in projected 4-3-3.",
    date: "Jun 8",
    tag: "squad",
  },
  {
    id: "n2",
    code: "mx",
    team: "Mexico",
    headline: "Ochoa confirmed for opening match at Azteca",
    summary: "Aguirre leans on experience as El Tri host South Africa June 11.",
    date: "Jun 9",
    tag: "squad",
  },
  {
    id: "n3",
    code: "br",
    team: "Brazil",
    headline: "Vinícius & Rodrygo firing before Group C opener",
    summary: "Dorival's 4-2-3-1 clicking after dominant MetLife friendly.",
    date: "Mar 26",
    tag: "form",
  },
  {
    id: "n4",
    code: "ar",
    team: "Argentina",
    headline: "Scaloni manages Messi minutes carefully",
    summary: "Albiceleste depth tested; Lo Celso pushing for starting role.",
    date: "Mar 26",
    tag: "tactics",
  },
  {
    id: "n5",
    code: "fr",
    team: "France",
    headline: "Mbappé fit and focal in Deschamps' 4-3-3",
    summary: "Saliba & Upamecano partnership solid after Germany friendly.",
    date: "Mar 29",
    tag: "form",
  },
  {
    id: "n6",
    code: "ca",
    team: "Canada",
    headline: "Davies returns to full training — Marsch delighted",
    summary: "Alphonso expected to start left back vs Netherlands April 2.",
    date: "Apr 1",
    tag: "injury",
  },
  {
    id: "n7",
    code: "gb-eng",
    team: "England",
    headline: "Tuchel experiments with Bellingham as No. 10",
    summary: "Kane on nine goals in last five internationals.",
    date: "Mar 27",
    tag: "tactics",
  },
  {
    id: "n8",
    code: "es",
    team: "Spain",
    headline: "Lamine Yamal & Nico Williams pace terrifies rivals",
    summary: "De la Fuente's youth movement in full swing before USA trip.",
    date: "Mar 30",
    tag: "form",
  },
];

export function getNewsByTeam(code: string): TeamNewsItem[] {
  return TEAM_NEWS.filter((n) => n.code === code);
}
