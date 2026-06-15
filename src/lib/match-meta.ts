import type { MatchEvent } from "@/lib/scores/types";
import type { Match } from "@/lib/scores/types";
import { getSquad } from "@/lib/squads";

export type Substitution = {
  minute: number;
  extraMinute?: number;
  playerIn: string;
  playerOut: string;
};

export type MatchOfficials = {
  referee: string;
  var: string;
  fourthOfficial: string;
  assistantReferees?: [string, string];
};

export type TeamMatchMeta = {
  coach: string;
  potentialSubs: string[];
  subsUsed?: Substitution[];
  newsHeadline?: string;
};

export type MatchMeta = {
  officials: MatchOfficials;
  home: TeamMatchMeta;
  away: TeamMatchMeta;
  /** Cards and other events not returned by worldcup26.ir */
  events?: MatchEvent[];
};

/** Officials, subs & team news keyed by match id */
export const MATCH_META: Record<string, MatchMeta> = {
  f1: {
    officials: {
      referee: "Ismail Elfath",
      var: "Armando Villarreal",
      fourthOfficial: "Rubiel Vasquez",
      assistantReferees: ["Frank Anderson", "Kyle Atkins"],
    },
    home: {
      coach: "Mauricio Pochettino",
      potentialSubs: ["Gio Reyna", "Walker Zimmerman", "Ethan Horvath", "Haji Wright"],
      subsUsed: [
        { minute: 62, playerIn: "Gio Reyna", playerOut: "Yunus Musah" },
        { minute: 74, playerIn: "Haji Wright", playerOut: "Folarin Balogun" },
      ],
      newsHeadline: "Pulisic stars as USMNT edge Mexico in Arlington friendly",
    },
    away: {
      coach: "Javier Aguirre",
      potentialSubs: ["Raúl Jiménez", "Carlos Rodríguez", "Orbelín Pineda", "Johan Vásquez"],
      subsUsed: [
        { minute: 55, playerIn: "Raúl Jiménez", playerOut: "Santiago Giménez" },
        { minute: 70, playerIn: "Carlos Rodríguez", playerOut: "Luis Chávez" },
      ],
      newsHeadline: "El Tri rotate squad ahead of World Cup opener",
    },
  },
  f2: {
    officials: {
      referee: "Slavko Vinčić",
      var: "Marco Fritz",
      fourthOfficial: "István Kovács",
      assistantReferees: ["Tomaž Klančnik", "Andraž Kovačič"],
    },
    home: {
      coach: "Dorival Júnior",
      potentialSubs: ["Raphinha", "Casemiro", "Endrick", "Joelinton"],
      subsUsed: [
        { minute: 58, playerIn: "Raphinha", playerOut: "Rodrygo" },
        { minute: 68, playerIn: "Casemiro", playerOut: "André" },
      ],
      newsHeadline: "Canarinho cruise past Argentina at MetLife",
    },
    away: {
      coach: "Lionel Scaloni",
      potentialSubs: ["Giovani Lo Celso", "Leandro Paredes", "Lautaro Martínez", "Ángel Di María"],
      subsUsed: [
        { minute: 46, playerIn: "Giovani Lo Celso", playerOut: "Alexis Mac Allister" },
        { minute: 60, playerIn: "Ángel Di María", playerOut: "Julián Álvarez" },
      ],
      newsHeadline: "Albiceleste test depth without Messi full 90",
    },
  },
  f3: {
    officials: {
      referee: "Clement Turpin",
      var: "Jérôme Brisard",
      fourthOfficial: "Benoît Bastien",
      assistantReferees: ["Hicham Zakrani", "Guillaume Besnard"],
    },
    home: {
      coach: "Thomas Tuchel",
      potentialSubs: ["Cole Palmer", "Trent Alexander-Arnold", "Ollie Watkins", "Anthony Gordon"],
      subsUsed: [
        { minute: 64, playerIn: "Cole Palmer", playerOut: "Jack Grealish" },
        { minute: 78, playerIn: "Ollie Watkins", playerOut: "Harry Kane" },
      ],
      newsHeadline: "Kane and Bellingham on target in Wembley thriller",
    },
    away: {
      coach: "Domenico Tedesco",
      potentialSubs: ["Thibaut Courtois", "Leandro Trossard", "Arthur Theate", "Amadou Onana"],
      subsUsed: [
        { minute: 59, playerIn: "Leandro Trossard", playerOut: "Jeremy Doku" },
        { minute: 82, playerIn: "Amadou Onana", playerOut: "Youri Tielemans" },
      ],
      newsHeadline: "Red Devils rally late to split points with England",
    },
  },
  f4: {
    officials: {
      referee: "Szymon Marciniak",
      var: "Tomasz Kwiatkowski",
      fourthOfficial: "Paweł Raczkowski",
      assistantReferees: ["Adam Nykiel", "Pawel Sokolnicki"],
    },
    home: {
      coach: "Didier Deschamps",
      potentialSubs: ["Antoine Griezmann", "Ibrahima Konaté", "Bradley Barcola", "Randal Kolo Muani"],
      subsUsed: [
        { minute: 71, playerIn: "Antoine Griezmann", playerOut: "Warren Zaïre-Emery" },
        { minute: 85, playerIn: "Randal Kolo Muani", playerOut: "Bradley Barcola" },
      ],
      newsHeadline: "Mbappé winner seals Paris friendly over Germany",
    },
    away: {
      coach: "Julian Nagelsmann",
      potentialSubs: ["İlkay Gündoğan", "Marc-André ter Stegen", "Leroy Sané", "Niclas Füllkrug"],
      subsUsed: [
        { minute: 63, playerIn: "Leroy Sané", playerOut: "Jamal Musiala" },
        { minute: 77, playerIn: "İlkay Gündoğan", playerOut: "Robert Andrich" },
      ],
      newsHeadline: "Wirtz & Musiala combine but Germany fall short",
    },
  },
  f5: {
    officials: {
      referee: "Ismail Elfath",
      var: "Kathryn Nesbitt",
      fourthOfficial: "Nima Saghafi",
      assistantReferees: ["Frank Anderson", "Kyle Atkins"],
    },
    home: {
      coach: "Néstor Lorenzo",
      potentialSubs: ["Jhon Durán", "Juan Cuadrado", "Jefferson Lerma", "Rafael Santos Borré"],
      subsUsed: [
        { minute: 61, playerIn: "Jhon Durán", playerOut: "Rafael Borré" },
        { minute: 79, playerIn: "Juan Cuadrado", playerOut: "Santiago Arias" },
      ],
      newsHeadline: "Díaz dazzles as Colombia hold Spain in Miami",
    },
    away: {
      coach: "Luis de la Fuente",
      potentialSubs: ["Ferran Torres", "Mikel Merino", "Álvaro Morata", "Nico Williams"],
      subsUsed: [
        { minute: 56, playerIn: "Ferran Torres", playerOut: "Lamine Yamal" },
        { minute: 72, playerIn: "Mikel Merino", playerOut: "Gavi" },
      ],
      newsHeadline: "La Roja experiment with youth in Florida heat",
    },
  },
  f6: {
    officials: {
      referee: "Drew Fischer",
      var: "Carol Anne Chenard",
      fourthOfficial: "Marie-Soleil Beaudoin",
      assistantReferees: ["Brooks Allen", "Richard Gamba"],
    },
    home: {
      coach: "Jesse Marsch",
      potentialSubs: ["Ismaël Koné", "Dayne St. Clair", "Tajon Buchanan", "Cyle Larin"],
      newsHeadline: "Davies & David lead Canada into final pre-tournament test",
    },
    away: {
      coach: "Ronald Koeman",
      potentialSubs: ["Xavi Simons", "Matthijs de Ligt", "Brian Brobbey", "Steven Bergwijn"],
      newsHeadline: "Oranje travel to Vancouver with full-strength XI",
    },
  },
  m1: {
    officials: {
      referee: "César Ramos",
      var: "Guadalupe Porras",
      fourthOfficial: "Marco Ortíz",
      assistantReferees: ["Alberto Jordán", "Blanca López"],
    },
    home: {
      coach: "Javier Aguirre",
      potentialSubs: [
        "Raúl Jiménez",
        "Carlos Rodríguez",
        "Orbelín Pineda",
        "Johan Vásquez",
        "Luis Malagón",
      ],
      subsUsed: [
        { minute: 55, playerIn: "Raúl Jiménez", playerOut: "Santiago Giménez" },
        { minute: 61, playerIn: "Orbelín Pineda", playerOut: "Luis Chávez" },
        { minute: 78, playerIn: "Johan Vásquez", playerOut: "Jorge Sánchez" },
        { minute: 86, playerIn: "Carlos Rodríguez", playerOut: "Edson Álvarez" },
        { minute: 88, playerIn: "Luis Malagón", playerOut: "Guillermo Ochoa" },
      ],
      newsHeadline: "El Tri open World Cup with commanding Azteca win",
    },
    away: {
      coach: "Hugo Broos",
      potentialSubs: [
        "Percy Tau",
        "Veli Mothwa",
        "Thapelo Maseko",
        "Tebogo Moerane",
        "Evidence Makgopa",
      ],
      subsUsed: [
        { minute: 58, playerIn: "Percy Tau", playerOut: "Evidence Makgopa" },
        { minute: 70, playerIn: "Veli Mothwa", playerOut: "Ronwen Williams" },
        { minute: 83, playerIn: "Thapelo Maseko", playerOut: "Sphelele Mkhulise" },
      ],
      newsHeadline: "Bafana Bafana fall short in Mexico City opener",
    },
    events: [
      {
        minute: 9,
        type: "goal",
        player: "J. Quiñones",
        playerSecondary: "Hirving Lozano",
        team: "home",
      },
      { minute: 34, type: "yellow", player: "Teboho Mokoena", team: "away" },
      {
        minute: 67,
        type: "goal",
        player: "R. Jiménez",
        playerSecondary: "Orbelín Pineda",
        team: "home",
      },
      { minute: 67, type: "yellow", player: "Teboho Mokoena", team: "away" },
      { minute: 67, type: "yellow", player: "Orbelín Pineda", team: "home" },
      { minute: 81, type: "yellow", player: "Orbelín Pineda", team: "home" },
    ],
  },
  m2: {
    officials: {
      referee: "Amin Omar",
      var: "Hernán Mastrangelo",
      fourthOfficial: "Wilton Sampaio",
      assistantReferees: ["Mahmoud Ashour", "Ahmed Ibrahim"],
    },
    home: {
      coach: "Hong Myung-bo",
      potentialSubs: [
        "Oh Hyeon-gyu",
        "Hwang Hee-chan",
        "Eom Ji-sung",
        "Jo Hyeon-woo",
        "Kim Min-jae",
      ],
      subsUsed: [
        { minute: 61, playerIn: "Hwang Hee-chan", playerOut: "Lee Jae-sung" },
        { minute: 69, playerIn: "Oh Hyeon-gyu", playerOut: "Son Heung-min" },
        { minute: 69, playerIn: "Eom Ji-sung", playerOut: "Lee Tae-seok" },
      ],
      newsHeadline: "Hwang In-beom inspires Korea Republic comeback over Czechia",
    },
    away: {
      coach: "Ivan Hašek",
      potentialSubs: [
        "Adam Hložek",
        "Tomáš Chorý",
        "Michal Sadílek",
        "Václav Jemelka",
        "Matěj Kovář",
      ],
      subsUsed: [
        { minute: 62, playerIn: "Adam Hložek", playerOut: "Jan Kuchta" },
        { minute: 62, playerIn: "Tomáš Chorý", playerOut: "Lukáš Provod" },
        { minute: 62, playerIn: "Michal Sadílek", playerOut: "Tomáš Vlček" },
      ],
      newsHeadline: "Krejčí opener not enough as Czechia fall to late Korea winner",
    },
    events: [
      {
        minute: 59,
        type: "goal",
        player: "Ladislav Krejčí",
        team: "away",
      },
      {
        minute: 67,
        type: "goal",
        player: "Hwang In-beom",
        playerSecondary: "Lee Kang-in",
        team: "home",
      },
      {
        minute: 80,
        type: "goal",
        player: "Oh Hyeon-gyu",
        playerSecondary: "Hwang In-beom",
        team: "home",
      },
    ],
  },
  m3: {
    officials: {
      referee: "Facundo Tello",
      var: "Hernán Mastrangelo",
      fourthOfficial: "Khalid Alturais",
      assistantReferees: ["Juan Pablo Belatti", "Gabriel Chade"],
    },
    home: {
      coach: "Jesse Marsch",
      potentialSubs: [
        "Jacob Shaffelburg",
        "Promise David",
        "Ali Ahmed",
        "Cyle Larin",
        "Jonathan Osorio",
        "Dayne St. Clair",
      ],
      subsUsed: [
        { minute: 61, playerIn: "Jacob Shaffelburg", playerOut: "Liam Millar" },
        { minute: 61, playerIn: "Promise David", playerOut: "Jonathan David" },
        { minute: 61, playerIn: "Ali Ahmed", playerOut: "Tajon Buchanan" },
        { minute: 76, playerIn: "Cyle Larin", playerOut: "Tani Oluwaseyi" },
        { minute: 90, extraMinute: 1, playerIn: "Jonathan Osorio", playerOut: "Stephen Eustáquio" },
      ],
      newsHeadline: "Larin super-sub earns Canada a point in Toronto opener",
    },
    away: {
      coach: "Sergej Barbarez",
      potentialSubs: [
        "Armin Gigovic",
        "Samed Bazdar",
        "Ivan Sunjic",
        "Kerim Alajbegovic",
        "Dzenis Burnic",
        "Edin Džeko",
      ],
      subsUsed: [
        { minute: 61, playerIn: "Armin Gigovic", playerOut: "Ivan Bašić" },
        { minute: 61, playerIn: "Samed Bazdar", playerOut: "Jovo Lukić" },
        { minute: 74, playerIn: "Ivan Sunjic", playerOut: "Esmir Bajraktarević" },
        { minute: 74, playerIn: "Kerim Alajbegovic", playerOut: "Amar Memić" },
        { minute: 83, playerIn: "Dzenis Burnic", playerOut: "Sead Kolašinac" },
      ],
      newsHeadline: "Lukić header gives Bosnia & Herzegovina early lead at BMO Field",
    },
    events: [
      {
        minute: 21,
        type: "goal",
        player: "Jovo Lukić",
        playerSecondary: "Sead Kolašinac",
        team: "away",
      },
      { minute: 44, type: "yellow", player: "Ermedin Demirović", team: "away" },
      { minute: 45, extraMinute: 1, type: "yellow", player: "Jovo Lukić", team: "away" },
      { minute: 53, type: "yellow", player: "Luc De Fougerolles", team: "home" },
      {
        minute: 78,
        type: "goal",
        player: "Cyle Larin",
        playerSecondary: "Promise David",
        team: "home",
      },
      { minute: 90, extraMinute: 3, type: "yellow", player: "Nikola Katić", team: "away" },
    ],
  },
};

/** worldcup26.ir game id → static preview meta id */
const WC26_META_ALIASES: Record<string, string> = {
  "wc26-1": "m1",
  "wc26-2": "m2",
  "wc26-3": "m3",
};

/** Resolve meta when API ids differ from static ids */
const TEAM_PAIR_META: Record<string, string> = {
  "mx-za": "m1",
  "kr-cz": "m2",
  "ca-ba": "m3",
};

export function getMatchMeta(matchId: string): MatchMeta | undefined {
  const alias = WC26_META_ALIASES[matchId];
  if (alias) return MATCH_META[alias];
  return MATCH_META[matchId];
}

export function getMatchMetaForMatch(match: Pick<Match, "id" | "home" | "away">): MatchMeta | undefined {
  const fromId = getMatchMeta(match.id);
  if (fromId) return fromId;
  const pairKey = `${match.home.code}-${match.away.code}`;
  const metaId = TEAM_PAIR_META[pairKey];
  return metaId ? MATCH_META[metaId] : undefined;
}

export type CoachInfo = {
  homeCoach?: string;
  awayCoach?: string;
};

/** Coaches from squads/lineups when manual MATCH_META is absent. */
export function getCoachInfo(match: Match): CoachInfo {
  const meta = getMatchMetaForMatch(match);
  if (meta) {
    return { homeCoach: meta.home.coach, awayCoach: meta.away.coach };
  }

  const homeSquad = getSquad(match.home.code);
  const awaySquad = getSquad(match.away.code);

  return {
    homeCoach: match.homeLineup?.coach ?? homeSquad?.coach,
    awayCoach: match.awayLineup?.coach ?? awaySquad?.coach,
  };
}
