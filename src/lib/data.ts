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
  type: "Bar" | "Restaurant" | "Fan Zone" | "Viewing Party";
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
    name: "Foley's Pub & Restaurant",
    neighborhood: "Midtown",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Irish pub, every league on tap",
    description:
      "Murray Hill staple with dozens of screens, hearty pub food, and a crowd that never misses a USMNT or Mexico match.",
    highlight: "Best for: USA & Mexico fans",
    mapsQuery: "Foley's Pub 18 West 33rd Street NYC",
  },
  {
    name: "Kettle of Fish",
    neighborhood: "Greenwich Village",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Wisconsin meets West Village soccer",
    description:
      "Beloved Village bar known for Packers Sundays and packed international football nights — standing room only for knockouts.",
    mapsQuery: "Kettle of Fish 59 Christopher Street NYC",
  },
  {
    name: "Jack Demsey's",
    neighborhood: "Flatiron",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Classic sports bar, all the big matches",
    description:
      "Old-school NYC sports bar on West 36th with reliable screens, burgers, and a loyal match-day crowd since 1934.",
    mapsQuery: "Jack Demsey's 36 West 33rd Street NYC",
  },
  {
    name: "Slattery's Midtown Pub",
    neighborhood: "Midtown East",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Irish pub, Premier League HQ",
    description:
      "Two-floor Irish pub steps from Grand Central. Packed for early kickoffs, European nights, and World Cup wall-to-wall.",
    highlight: "Best for: Early ET kickoffs",
    mapsQuery: "Slattery's Midtown Pub 8 East 36th Street NYC",
  },
  {
    name: "O'Hanlon's Bar",
    neighborhood: "Astoria",
    borough: "Queens",
    type: "Bar",
    vibe: "Queens soccer heartland",
    description:
      "Astoria's go-to for global football — South American, European, and CONCACAF crowds pack in for every major fixture.",
    highlight: "Best for: Latin America & Europe",
    mapsQuery: "O'Hanlon's Bar Astoria Queens",
  },
  {
    name: "Woodwork Bar",
    neighborhood: "Greenpoint",
    borough: "Brooklyn",
    type: "Bar",
    vibe: "Brooklyn craft beer & football",
    description:
      "Intimate Greenpoint bar with strong craft beer list and a devoted football following — great for group-stage afternoons.",
    mapsQuery: "Woodwork Bar Greenpoint Brooklyn",
  },
  {
    name: "Beloved Bar",
    neighborhood: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    type: "Bar",
    vibe: "Community vibes, global game",
    description:
      "Bed-Stuy neighborhood bar with screens, cocktails, and a welcoming crowd for World Cup watch-alongs across all groups.",
    mapsQuery: "Beloved Bar Bedford Avenue Brooklyn",
  },
  {
    name: "Bronx Alehouse",
    neighborhood: "Norwood",
    borough: "Bronx",
    type: "Bar",
    vibe: "Craft beer, big screens, Bronx pride",
    description:
      "Award-winning Bronx beer hall with multiple TVs and a food menu built for long match days — easy parking for borough fans.",
    highlight: "Best for: Bronx locals",
    mapsQuery: "Bronx Alehouse 3639 East Tremont Avenue",
  },
  {
    name: "Harlem Public",
    neighborhood: "Hamilton Heights",
    borough: "Manhattan",
    type: "Restaurant",
    vibe: "Neighborhood gastropub, screens upstairs",
    description:
      "Beloved Harlem spot with elevated pub fare, craft drafts, and upstairs seating perfect for afternoon group-stage matches.",
    mapsQuery: "Harlem Public 3615 Broadway NYC",
  },
  {
    name: "The Globe",
    neighborhood: "Midtown",
    borough: "Manhattan",
    type: "Bar",
    vibe: "British pub, World Cup tradition",
    description:
      "Midtown English pub atmosphere with pints, pies, and dedicated screens for UK and international tournament fixtures.",
    mapsQuery: "The Globe Bar 230 West 44th Street NYC",
  },
  {
    name: "Ryan's Daughter",
    neighborhood: "Upper East Side",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Irish pub, neighborhood regulars",
    description:
      "UES Irish pub that fills fast for Ireland, England, and marquee World Cup clashes — arrive early for knockout rounds.",
    mapsQuery: "Ryan's Daughter 350 East 85th Street NYC",
  },
  {
    name: "Offside Tavern",
    neighborhood: "Kips Bay",
    borough: "Manhattan",
    type: "Bar",
    vibe: "Soccer-first bar culture",
    description:
      "Football-focused tavern energy near NYU — built for supporters who want commentary, pints, and zero channel surfing.",
    highlight: "Best for: Pure football fans",
    mapsQuery: "Offside Tavern NYC",
  },
  {
    name: "Lucky Strike Chelsea Piers",
    neighborhood: "Chelsea",
    borough: "Manhattan",
    type: "Restaurant",
    vibe: "Bowling, bites, and big screens",
    description:
      "Chelsea Piers entertainment complex with sports viewing areas, shareable plates, and room for large watch-party groups.",
    mapsQuery: "Lucky Strike Chelsea Piers NYC",
  },
  {
    name: "Treadwell Park",
    neighborhood: "Upper East Side",
    borough: "Manhattan",
    type: "Restaurant",
    vibe: "Craft beer hall, match-day food",
    description:
      "Spacious beer hall with rotisserie chicken, long tables, and screens tuned to the day's fixtures — great for families.",
    mapsQuery: "Treadwell Park Upper East Side NYC",
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
  {
    name: "Domino Park World Cup Screenings",
    neighborhood: "Williamsburg",
    borough: "Brooklyn",
    type: "Viewing Party",
    vibe: "Waterfront, outdoor, free",
    description:
      "Community screenings along the East River with Manhattan skyline views — grab food from Smorgasburg vendors nearby.",
    highlight: "Weekend matches",
    mapsQuery: "Domino Park Brooklyn",
  },
  {
    name: "Industry City Watch Party",
    neighborhood: "Sunset Park",
    borough: "Brooklyn",
    type: "Viewing Party",
    vibe: "Warehouse district, big crowd energy",
    description:
      "Large-format outdoor and indoor viewing at Industry City with food halls, local breweries, and family-friendly space.",
    mapsQuery: "Industry City Brooklyn",
  },
  {
    name: "Lincoln Center Plaza Screenings",
    neighborhood: "Lincoln Square",
    borough: "Manhattan",
    type: "Viewing Party",
    vibe: "Cultural landmark, open air",
    description:
      "Free public screenings on the plaza during select tournament dates — iconic NYC backdrop for marquee matches.",
    highlight: "Select knockout dates",
    mapsQuery: "Lincoln Center Plaza NYC",
  },
  {
    name: "Hudson Yards Watch Terrace",
    neighborhood: "Hudson Yards",
    borough: "Manhattan",
    type: "Viewing Party",
    vibe: "Modern NYC, sunset kickoffs",
    description:
      "Elevated viewing experiences and fan activations near the Vessel — ideal for evening matches with west-side transit access.",
    mapsQuery: "Hudson Yards NYC",
  },
  {
    name: "MetLife Stadium Fan Plaza",
    neighborhood: "Meadowlands",
    borough: "NY/NJ",
    type: "Viewing Party",
    vibe: "On-site final atmosphere",
    description:
      "Pre-match fan plaza activations for all eight matches at MetLife, including the World Cup Final on July 19.",
    highlight: "8 matches · incl. Final",
    mapsQuery: "MetLife Stadium East Rutherford NJ",
  },
  {
    name: "Queens Night Market Watch Zone",
    neighborhood: "Corona",
    borough: "Queens",
    type: "Viewing Party",
    vibe: "Global food, global game",
    description:
      "World Cup screenings paired with Queens' legendary night market flavors — the most diverse watch party in the city.",
    highlight: "Saturday evenings",
    mapsQuery: "Queens Night Market Corona",
  },
  {
    name: "Pier 17 Summer Screen",
    neighborhood: "Seaport",
    borough: "Manhattan",
    type: "Viewing Party",
    vibe: "Waterfront mega-screen",
    description:
      "South Street Seaport's Pier 17 hosts large-format outdoor viewing with harbor breezes and plenty of nearby restaurants.",
    mapsQuery: "Pier 17 South Street Seaport NYC",
  },
  {
    name: "Randall's Island World Cup Village",
    neighborhood: "Randall's Island",
    borough: "Manhattan",
    type: "Fan Zone",
    vibe: "Fields, festivals, big screens",
    description:
      "Festival-style fan village with food trucks, live music, and match broadcasts — shuttle access from Manhattan.",
    highlight: "June weekends",
    mapsQuery: "Randall's Island Park NYC",
  },
  {
    name: "Porto Rico Importing Co.",
    neighborhood: "East Village",
    borough: "Manhattan",
    type: "Restaurant",
    vibe: "Latin grocery & café, community hub",
    description:
      "Legendary East Village Latin market and café — a cultural gathering spot where football conversations flow as freely as coffee.",
    mapsQuery: "Porto Rico Importing Co East Village NYC",
  },
  {
    name: "Carmine's Times Square",
    neighborhood: "Times Square",
    borough: "Manhattan",
    type: "Restaurant",
    vibe: "Family-style Italian, tourist-friendly screens",
    description:
      "Massive family portions and multiple dining rooms with TVs — book ahead for USA and Mexico matches in the heart of Midtown.",
    mapsQuery: "Carmine's 200 West 44th Street NYC",
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
