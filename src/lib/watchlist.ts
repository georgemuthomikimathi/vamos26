export type WatchPlayer = {
  name: string;
  country: string;
  code: string;
  position: string;
  club: string;
  number: number;
  tagline: string;
  gradient: string;
  stat: string;
  image?: string;
};

export const DEFENDERS_TO_WATCH: WatchPlayer[] = [
  {
    name: "William Saliba",
    country: "France",
    code: "fr",
    position: "CB",
    club: "Arsenal",
    number: 17,
    tagline:
      "Imperious in the air — anchors Les Bleus. Saliba's reading of the game lets France play high without leaving gaps behind the midfield.",
    gradient: "from-blue-600 to-red-600",
    stat: "92% duel success",
    image: "/images/players/william-saliba.jpg",
  },
  {
    name: "Virgil van Dijk",
    country: "Netherlands",
    code: "nl",
    position: "CB",
    club: "Liverpool",
    number: 4,
    tagline:
      "The colossus — organizes every line. Van Dijk's leadership transforms the Netherlands into a compact, hard-to-break unit in knockout football.",
    gradient: "from-orange-500 to-blue-700",
    stat: "0 goals conceded in 180 min",
    image: "/images/players/virgil-van-dijk.jpg",
  },
  {
    name: "António Rüdiger",
    country: "Germany",
    code: "de",
    position: "CB",
    club: "Real Madrid",
    number: 2,
    tagline:
      "Warrior mentality, world-class recovery pace. Rüdiger thrives in high-stakes duels and sets the tone for Germany's aggressive defensive line.",
    gradient: "from-yellow-500 to-red-700",
    stat: "12 clearances / match",
    image: "/images/players/antonio-rudiger.jpg",
  },
  {
    name: "Marquinhos",
    country: "Brazil",
    code: "br",
    position: "CB",
    club: "PSG",
    number: 4,
    tagline:
      "Captain calm — reads the game two passes ahead. Marquinhos shields Brazil's back line while initiating build-up under press.",
    gradient: "from-green-600 to-yellow-400",
    stat: "3 clean sheet matches",
    image: "/images/players/marquinhos.jpg",
  },
  {
    name: "Cristian Romero",
    country: "Argentina",
    code: "ar",
    position: "CB",
    club: "Tottenham",
    number: 13,
    tagline:
      "Aggressive presser, fearless in duels. Romero's intensity mirrors Argentina's World Cup-winning mentality in every third.",
    gradient: "from-sky-400 to-blue-800",
    stat: "Most tackles in R16",
    image: "/images/players/cristian-romero.jpg",
  },
  {
    name: "Alphonso Davies",
    country: "Canada",
    code: "ca",
    position: "LB",
    club: "Bayern Munich",
    number: 19,
    tagline:
      "African-Canadian pace merchant — flies down the left. Davies stretches defenses and gives Canada a genuine outlet on the counter.",
    gradient: "from-red-600 to-white",
    stat: "36.5 km/h top speed",
    image: "/images/players/alphonso-davies.jpg?v=3",
  },
];

export const PLAYMAKERS_TO_WATCH: WatchPlayer[] = [
  {
    name: "Florian Wirtz",
    country: "Germany",
    code: "de",
    position: "CAM",
    club: "Liverpool",
    number: 10,
    tagline:
      "Liverpool's new maestro — leads all assists. Wirtz floats between lines and finds angles that unlock the most organized blocks.",
    gradient: "from-yellow-500 to-red-700",
    stat: "4 assists · 2 goals",
    image: "/images/players/florian-wirtz.jpg",
  },
  {
    name: "Pedri",
    country: "Spain",
    code: "es",
    position: "CM",
    club: "Barcelona",
    number: 8,
    tagline:
      "Metronome of La Roja — controls tempo. Pedri's first touch and progressive passing make Spain tick in tight midfield spaces.",
    gradient: "from-red-600 to-yellow-400",
    stat: "94% pass accuracy",
    image: "/images/players/pedri.jpg",
  },
  {
    name: "Jude Bellingham",
    country: "England",
    code: "gb-eng",
    position: "CM",
    club: "Real Madrid",
    number: 10,
    tagline:
      "Box-to-box brilliance with end product. Bellingham arrives late in the box and carries England's press from the center of the park.",
    gradient: "from-blue-800 to-red-600",
    stat: "3 G/A in 4 matches",
    image: "/images/players/jude-bellingham.jpg",
  },
  {
    name: "Lamine Yamal",
    country: "Spain",
    code: "es",
    position: "RW",
    club: "Barcelona",
    number: 19,
    tagline:
      "Teenage genius — fearlessly takes on anyone. Yamal's dribbling and final ball already mark him as Spain's generational wide threat.",
    gradient: "from-red-600 to-yellow-400",
    stat: "12 successful dribbles",
    image: "/images/players/lamine-yamal.jpg",
  },
  {
    name: "Kevin De Bruyne",
    country: "Belgium",
    code: "be",
    position: "CAM",
    club: "Napoli",
    number: 7,
    tagline:
      "King Kev orchestrating Serie A after leaving the Etihad. De Bruyne's vision and set-piece delivery remain elite at tournament level.",
    gradient: "from-red-600 to-yellow-400",
    stat: "3 key passes / 90",
    image: "/images/players/kevin-de-bruyne.jpg",
  },
  {
    name: "Mohamed Salah",
    country: "Egypt",
    code: "eg",
    position: "RW",
    club: "Liverpool",
    number: 10,
    tagline:
      "Left foot of gold — creates from nothing. Salah's movement off the right channel drags fullbacks inside and frees Egypt's runners.",
    gradient: "from-red-700 to-white",
    stat: "2 goals · 2 assists",
    image: "/images/players/mohamed-salah.jpg",
  },
];
