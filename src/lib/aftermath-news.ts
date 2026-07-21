// Daily update: edit AFTERMATH_NEWS + AFTERMATH_UPDATED.
// Prefer external reputable outlets. Keep 8–12 items, newest first.

export type AftermathNewsItem = {
  id: string;
  date: string; // e.g. "Jul 20"
  category: "celebration" | "reaction" | "banter" | "drama" | "team";
  headline: string;
  summary: string;
  source: string;
  url: string;
  featured?: boolean;
};

export const AFTERMATH_UPDATED = "Jul 20, 2026"; // bump when you edit the list

export const AFTERMATH_NEWS: AftermathNewsItem[] = [
  {
    id: "madrid-parade-aljazeera",
    date: "Jul 20",
    category: "celebration",
    headline: "Madrid greets champions — nearly two million line the parade",
    summary:
      "Rodri and La Roja rode an open-top bus from Moncloa to Cibeles after royal and government welcomes, with officials estimating about 1.8 million fans turned out.",
    source: "Al Jazeera",
    url: "https://www.aljazeera.com/sports/2026/7/20/world-cup-champions-spain-return-to-royal-welcome-parade-through-madrid",
  },
  {
    id: "rodri-landing-yahoo",
    date: "Jul 20",
    category: "celebration",
    headline: "Rodri lifts the trophy on the gangway as Spain touch down in Madrid",
    summary:
      "Captain Rodri carried the World Cup down the stairs at Barajas before the squad headed to Zarzuela Palace, Moncloa, and the evening Cibeles ceremony.",
    source: "Yahoo Sports",
    url: "https://sports.yahoo.com/articles/world-champions-spain-return-home-141836407.html",
  },
  {
    id: "fifa-investigation-bbc",
    date: "Jul 20",
    category: "drama",
    headline: "FIFA opens investigation into Argentina’s post-final scenes",
    summary:
      "A disciplinary and ethics prosecutor will review the MetLife fracas — including Molina, Paredes, Almada, and staff — with bans and AFA fines possible.",
    source: "BBC Sport",
    url: "https://www.bbc.com/sport/football/articles/clyxjk0z5y7o",
  },
  {
    id: "de-la-fuente-hindu",
    date: "Jul 20",
    category: "team",
    headline: "De la Fuente: ‘I never thought of anything like this’",
    summary:
      "Spain’s coach dedicated the second star to his players and staff, praising collective sacrifice and calling the squad the true protagonists of the triumph.",
    source: "The Hindu",
    url: "https://www.thehindu.com/sport/football/i-never-thought-of-anything-like-this-says-spains-coach-de-la-fuente/article71243927.ece",
  },
  {
    id: "joe-hart-7news",
    date: "Jul 20",
    category: "reaction",
    headline: "Joe Hart: Messi showed class — Argentina’s behaviour ‘disgusting’",
    summary:
      "The BBC pundit said Messi alone shook every Spanish hand after the whistle, while praising Spain as the best team of the tournament.",
    source: "7NEWS",
    url: "https://7news.com.au/sport/soccer/football-world-turns-on-argentina-for-disgusting-behaviour-after-world-cup-defeat-to-spain-c-22602044",
  },
  {
    id: "messi-tears-abc",
    date: "Jul 20",
    category: "banter",
    headline: "Messi in tears as Argentina’s World Cup ends in extra time",
    summary:
      "Cameras caught Lionel Messi overcome after the final whistle — a raw farewell image from a night when Spain’s extra-time winner ended the dream.",
    source: "ABC News",
    url: "https://www.abc.net.au/news/2026-07-20/lionel-messi-cries-after-argentina-loss-spain-in-world-cup-final/106934886",
  },
  {
    id: "messi-message-yahoo",
    date: "Jul 20",
    category: "reaction",
    headline: "Messi sends a message to Spain after the final",
    summary:
      "The Argentina captain broke his silence with a respectful note toward the new champions — class on Instagram after a bruising MetLife night.",
    source: "Yahoo Sports",
    url: "https://sports.yahoo.com/articles/lionel-messi-sends-message-spain-190008525.html",
  },
  {
    id: "torres-winner-nie",
    date: "Jul 20",
    category: "celebration",
    headline: "Ferran Torres’ extra-time winner crowns Spain world champions",
    summary:
      "Torres struck in the 106th minute to seal Spain’s second World Cup — while Messi’s Argentina were left in tears at full time.",
    source: "New Indian Express",
    url: "https://www.newindianexpress.com/sport/football/2026/Jul/20/ferran-torres-extra-time-winner-crowns-spain-world-champions-messi-argentina-left-in-tears",
  },
  {
    id: "paredes-red-independent",
    date: "Jul 19",
    category: "drama",
    headline: "Paredes red after the whistle as Argentina’s night ends in disgrace",
    summary:
      "Leandro Paredes was sent off in the chaotic aftermath as punches and melees soured Spain’s deserved victory at MetLife Stadium.",
    source: "The Independent",
    url: "https://www.independent.co.uk/sport/football/leandro-paredes-red-card-argentina-spain-world-cup-b3017827.html",
  },
  {
    id: "spain-crowned-france24",
    date: "Jul 19",
    category: "celebration",
    headline: "Spain crowned champions after extra-time thriller against Argentina",
    summary:
      "La Roja beat Messi’s Argentina 1–0 AET in New Jersey — Ferran Torres the hero as Spain claimed a first World Cup since 2010.",
    source: "France 24",
    url: "https://www.france24.com/en/sport/20260719-world-cup-2026-spain-crowned-champions-after-extra-time-thriller-against-argentina",
    featured: true,
  },
];
