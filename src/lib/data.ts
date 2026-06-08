export type Team = {
  name: string;
  code: string;
  seed?: number;
};

export type Match = {
  date: string;
  time: string;
  home: Team;
  away: Team;
  venue: string;
  city: string;
  stage: string;
};

export type Group = {
  letter: string;
  teams: Team[];
  highlight?: string;
};

export type Player = {
  name: string;
  country: string;
  code: string;
  position: string;
  club: string;
  number: number;
  tagline: string;
  gradient: string;
};

export type Venue = {
  name: string;
  neighborhood: string;
  borough: string;
  type: "Bar" | "Fan Zone" | "Viewing Party";
  vibe: string;
  description: string;
  highlight?: string;
  mapsQuery: string;
};

export const HOST_NATIONS = [
  { name: "United States", code: "us", city: "New York / NJ", matches: 8 },
  { name: "Mexico", code: "mx", city: "Mexico City", matches: 5 },
  { name: "Canada", code: "ca", city: "Toronto & Vancouver", matches: 7 },
];

export const TOURNAMENT_STATS = [
  { label: "Teams", value: "48" },
  { label: "Groups", value: "12" },
  { label: "Matches", value: "104" },
  { label: "Host Cities", value: "16" },
];

export const GROUPS: Group[] = [
  {
    letter: "A",
    teams: [
      { name: "Mexico", code: "mx", seed: 1 },
      { name: "South Africa", code: "za" },
      { name: "Korea Republic", code: "kr" },
      { name: "Czechia", code: "cz" },
    ],
    highlight: "Opening Match — Mexico City, June 11",
  },
  {
    letter: "B",
    teams: [
      { name: "Canada", code: "ca", seed: 1 },
      { name: "Bosnia & Herzegovina", code: "ba" },
      { name: "Qatar", code: "qa" },
      { name: "Switzerland", code: "ch" },
    ],
    highlight: "Canada opens at BMO Field, Toronto — June 12",
  },
  {
    letter: "C",
    teams: [
      { name: "Brazil", code: "br", seed: 1 },
      { name: "Morocco", code: "ma" },
      { name: "Haiti", code: "ht" },
      { name: "Scotland", code: "gb-sct" },
    ],
  },
  {
    letter: "D",
    teams: [
      { name: "USA", code: "us", seed: 1 },
      { name: "Paraguay", code: "py" },
      { name: "Australia", code: "au" },
      { name: "Türkiye", code: "tr" },
    ],
    highlight: "USA's group — MetLife Stadium nearby",
  },
  {
    letter: "E",
    teams: [
      { name: "Germany", code: "de", seed: 1 },
      { name: "Curaçao", code: "cw" },
      { name: "Côte d'Ivoire", code: "ci" },
      { name: "Ecuador", code: "ec" },
    ],
  },
  {
    letter: "F",
    teams: [
      { name: "Netherlands", code: "nl", seed: 1 },
      { name: "Japan", code: "jp" },
      { name: "Tunisia", code: "tn" },
      { name: "Sweden", code: "se" },
    ],
  },
  {
    letter: "G",
    teams: [
      { name: "Belgium", code: "be", seed: 1 },
      { name: "Egypt", code: "eg" },
      { name: "IR Iran", code: "ir" },
      { name: "New Zealand", code: "nz" },
    ],
  },
  {
    letter: "H",
    teams: [
      { name: "Spain", code: "es", seed: 1 },
      { name: "Cabo Verde", code: "cv" },
      { name: "Saudi Arabia", code: "sa" },
      { name: "Uruguay", code: "uy" },
    ],
  },
  {
    letter: "I",
    teams: [
      { name: "France", code: "fr", seed: 1 },
      { name: "Senegal", code: "sn" },
      { name: "Iraq", code: "iq" },
      { name: "Norway", code: "no" },
    ],
  },
  {
    letter: "J",
    teams: [
      { name: "Argentina", code: "ar", seed: 1 },
      { name: "Algeria", code: "dz" },
      { name: "Austria", code: "at" },
      { name: "Jordan", code: "jo" },
    ],
  },
  {
    letter: "K",
    teams: [
      { name: "Portugal", code: "pt", seed: 1 },
      { name: "DR Congo", code: "cd" },
      { name: "Uzbekistan", code: "uz" },
      { name: "Colombia", code: "co" },
    ],
    highlight: "DR Congo returns after 52 years",
  },
  {
    letter: "L",
    teams: [
      { name: "England", code: "gb-eng", seed: 1 },
      { name: "Croatia", code: "hr" },
      { name: "Ghana", code: "gh" },
      { name: "Panama", code: "pa" },
    ],
  },
];

export const STAR_PLAYERS: Player[] = [
  {
    name: "Kylian Mbappé",
    country: "France",
    code: "fr",
    position: "Forward",
    club: "Real Madrid",
    number: 10,
    tagline: "Pace, power, and pure tournament pedigree",
    gradient: "from-blue-600 via-white to-red-600",
  },
  {
    name: "Vinícius Júnior",
    country: "Brazil",
    code: "br",
    position: "Forward",
    club: "Real Madrid",
    number: 7,
    tagline: "Samba flair on the world's biggest stage",
    gradient: "from-yellow-400 via-green-500 to-blue-600",
  },
  {
    name: "Erling Haaland",
    country: "Norway",
    code: "no",
    position: "Striker",
    club: "Manchester City",
    number: 9,
    tagline: "The Viking goal machine finally at a World Cup",
    gradient: "from-red-600 via-white to-blue-800",
  },
  {
    name: "Lamine Yamal",
    country: "Spain",
    code: "es",
    position: "Winger",
    club: "FC Barcelona",
    number: 19,
    tagline: "Generational talent rewriting the playbook",
    gradient: "from-red-600 via-yellow-400 to-red-700",
  },
  {
    name: "Jude Bellingham",
    country: "England",
    code: "gb-eng",
    position: "Midfielder",
    club: "Real Madrid",
    number: 10,
    tagline: "Box-to-box brilliance and big-game aura",
    gradient: "from-blue-800 via-white to-red-600",
  },
  {
    name: "Christian Pulisic",
    country: "USA",
    code: "us",
    position: "Winger",
    club: "AC Milan",
    number: 10,
    tagline: "Captain America leading the home nation charge",
    gradient: "from-blue-700 via-white to-red-600",
  },
  {
    name: "Cristiano Ronaldo",
    country: "Portugal",
    code: "pt",
    position: "Forward",
    club: "Al Nassr",
    number: 7,
    tagline: "Sixth World Cup — still hunting history",
    gradient: "from-green-700 via-red-600 to-green-800",
  },
  {
    name: "Lionel Messi",
    country: "Argentina",
    code: "ar",
    position: "Forward",
    club: "Inter Miami",
    number: 10,
    tagline: "Defending champion, American soil, eternal magic",
    gradient: "from-sky-400 via-white to-sky-500",
  },
  {
    name: "Florian Wirtz",
    country: "Germany",
    code: "de",
    position: "Attacking Mid",
    club: "Liverpool",
    number: 10,
    tagline: "Liverpool's marquee signing — Germany's creative heartbeat",
    gradient: "from-black via-red-600 to-yellow-400",
  },
  {
    name: "Guillermo Ochoa",
    country: "Mexico",
    code: "mx",
    position: "Goalkeeper",
    club: "Santa Ana",
    number: 13,
    tagline: "El Tri's legendary wall in the opening match",
    gradient: "from-green-600 via-white to-red-600",
  },
  {
    name: "Mohamed Salah",
    country: "Egypt",
    code: "eg",
    position: "Forward",
    club: "Liverpool",
    number: 10,
    tagline: "The Pharaoh's final dance on North American grass",
    gradient: "from-red-600 via-white to-black",
  },
  {
    name: "Alphonso Davies",
    country: "Canada",
    code: "ca",
    position: "Left Back",
    club: "Bayern Munich",
    number: 19,
    tagline: "Lightning pace anchoring the host nation's rise",
    gradient: "from-red-600 via-white to-red-700",
  },
];

export const NYC_VENUES: Venue[] = [
  {
    name: "Smithfield Hall NYC",
    neighborhood: "Chelsea",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Premier League energy, every match on",
    description:
      "NYC's iconic multi-room soccer pub with wall-to-wall screens, pints, and a crowd that lives for the beautiful game.",
    highlight: "Best for: Group stage marathons",
    mapsQuery: "Smithfield Hall NYC Chelsea",
  },
  {
    name: "Football Factory at Legends",
    neighborhood: "Midtown",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Massive screens, stadium atmosphere",
    description:
      "Three floors of football fandom near Penn Station. Huge projection screens and a die-hard international crowd.",
    highlight: "Best for: Knockout round drama",
    mapsQuery: "Football Factory Legends 33 West 33rd Street",
  },
  {
    name: "The Red Lion",
    neighborhood: "Greenwich Village",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Classic English pub, World Cup tradition",
    description:
      "A West Village institution since 1996. Cozy, loud, and packed for every England match and major international fixture.",
    highlight: "Best for: England & European sides",
    mapsQuery: "The Red Lion 151 Bleecker Street NYC",
  },
  {
    name: "Banter NYC",
    neighborhood: "Chelsea",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Craft beer meets global football",
    description:
      "Two-level soccer bar with excellent beer selection, brunch vibes by day, and electric match-day nights.",
    mapsQuery: "Banter NYC Chelsea",
  },
  {
    name: "Brooklyn Fan Zone",
    neighborhood: "Brooklyn Bridge Park",
    borough: "Brooklyn",
    type: "Fan Zone",
    vibe: "Free, outdoor, skyline views",
    description:
      "Official NYNJ Fan Event with daily programming and live match viewings against the Manhattan skyline. Free admission.",
    highlight: "June 13 – July 19",
    mapsQuery: "Brooklyn Bridge Park Fan Zone",
  },
  {
    name: "Rockefeller Center Fan Village",
    neighborhood: "Midtown",
    borough: "Manhattan",
    type: "Fan Zone",
    vibe: "Iconic NYC stage for the final stretch",
    description:
      "Official Telemundo Fan Village with daily programming during the knockout rounds and extended hours for Finals Week.",
    highlight: "July 6 – 19",
    mapsQuery: "Rockefeller Center Fan Village World Cup",
  },
  {
    name: "Queens Group Stage HQ",
    neighborhood: "Flushing Meadows",
    borough: "Queens",
    type: "Fan Zone",
    vibe: "Group stage headquarters",
    description:
      "Daily programming and match viewings at the USTA Billie Jean King National Tennis Center — the heart of group stage action in NYC.",
    highlight: "June 11 – 27",
    mapsQuery: "USTA Billie Jean King National Tennis Center",
  },
  {
    name: "Bronx Fan Zone",
    neighborhood: "Concourse",
    borough: "Bronx",
    type: "Fan Zone",
    vibe: "Community celebration",
    description:
      "Matchday programming and local cultural events at Bronx Terminal Market. Free, family-friendly World Cup energy.",
    highlight: "June 13 – 14",
    mapsQuery: "Bronx Terminal Market",
  },
  {
    name: "Central Park Finals Viewing Party",
    neighborhood: "Central Park",
    borough: "Manhattan",
    type: "Viewing Party",
    vibe: "The ultimate finale experience",
    description:
      "Watch the World Cup Final on the big screen in Central Park — a once-in-a-lifetime NYC moment under the summer sky.",
    highlight: "July 19 — Final",
    mapsQuery: "Central Park NYC",
  },
  {
    name: "Staten Island Fan Zone",
    neighborhood: "Prince's Bay",
    borough: "Staten Island",
    type: "Fan Zone",
    vibe: "Borough pride, evening matches",
    description:
      "Evening match viewings and daily programming at SIUH Community Park with a brand-new LED scoreboard.",
    highlight: "June 29 – July 2",
    mapsQuery: "Staten Island University Hospital Community Park",
  },
];

export const IMAGES = {
  trophy: "/images/world-cup-trophy.png",
  trionda: "/images/trionda-ball.png",
};

export const OPENING_MATCHES: Match[] = [
  {
    date: "Jun 11",
    time: "3:00 PM ET",
    home: { name: "Mexico", code: "mx" },
    away: { name: "South Africa", code: "za" },
    venue: "Estadio Azteca",
    city: "Mexico City",
    stage: "Opening Match",
  },
  {
    date: "Jun 12",
    time: "6:00 PM ET",
    home: { name: "Canada", code: "ca" },
    away: { name: "Bosnia & Herzegovina", code: "ba" },
    venue: "BMO Field",
    city: "Toronto",
    stage: "Group B",
  },
  {
    date: "Jun 12",
    time: "9:00 PM ET",
    home: { name: "USA", code: "us" },
    away: { name: "Paraguay", code: "py" },
    venue: "SoFi Stadium",
    city: "Los Angeles",
    stage: "Group D",
  },
  {
    date: "Jun 13",
    time: "2:00 PM ET",
    home: { name: "Brazil", code: "br" },
    away: { name: "Morocco", code: "ma" },
    venue: "MetLife Stadium",
    city: "East Rutherford, NJ",
    stage: "Group C",
  },
  {
    date: "Jun 15",
    time: "12:00 PM ET",
    home: { name: "Spain", code: "es" },
    away: { name: "Cabo Verde", code: "cv" },
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    stage: "Group H",
  },
  {
    date: "Jun 15",
    time: "3:00 PM ET",
    home: { name: "France", code: "fr" },
    away: { name: "Senegal", code: "sn" },
    venue: "MetLife Stadium",
    city: "East Rutherford, NJ",
    stage: "Group I",
  },
];

export const KEY_DATES = [
  { date: "Jun 11", event: "Opening Match", detail: "Mexico vs South Africa — Mexico City" },
  { date: "Jun 13", event: "NYC Region Kicks Off", detail: "Fan zones open across all 5 boroughs" },
  { date: "Jun 15", event: "MetLife Matches Begin", detail: "8 matches at NY/NJ Stadium" },
  { date: "Jul 6", event: "Rockefeller Fan Village", detail: "Knockout round HQ opens in Manhattan" },
  { date: "Jul 19", event: "THE FINAL", detail: "MetLife Stadium — East Rutherford, NJ" },
];

export function flagUrl(code: string, size: 40 | 80 | 160 = 80) {
  return `https://flagcdn.com/w${size}/${code}.png`;
}
