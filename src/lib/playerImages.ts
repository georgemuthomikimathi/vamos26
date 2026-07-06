/** Portrait paths for stats leaders and watchlist — keyed by slug */
export const PLAYER_IMAGE_SLUGS: Record<string, string> = {
  "kylian-mbappe": "/images/players/kylian-mbappe.jpg",
  "erling-haaland": "/images/players/erling-haaland.jpg",
  "vinicius-junior": "/images/players/vinicius-junior.jpg",
  "harry-kane": "/images/players/harry-kane.jpg",
  "lamine-yamal": "/images/players/lamine-yamal.jpg",
  "christian-pulisic": "/images/players/christian-pulisic.jpg",
  "florian-wirtz": "/images/players/florian-wirtz.jpg",
  "kevin-de-bruyne": "/images/players/kevin-de-bruyne.jpg",
  pedri: "/images/players/pedri.jpg",
  "jude-bellingham": "/images/players/jude-bellingham.jpg",
  "alexis-mac-allister": "/images/players/alexis-mac-allister.jpg",
  "emiliano-martinez": "/images/players/emiliano-martinez.jpg",
  "gianluigi-donnarumma": "/images/players/gianluigi-donnarumma.jpg",
  "alisson-becker": "/images/players/alisson-becker.jpg",
  "mike-maignan": "/images/players/mike-maignan.jpg",
  "matt-turner": "/images/players/matt-turner.jpg",
  "alphonso-davies": "/images/players/alphonso-davies.jpg",
  "antonio-rudiger": "/images/players/antonio-rudiger.jpg",
  "cristian-romero": "/images/players/cristian-romero.jpg",
  marquinhos: "/images/players/marquinhos.jpg",
  "mohamed-salah": "/images/players/mohamed-salah.jpg",
  "virgil-van-dijk": "/images/players/virgil-van-dijk.jpg",
  "william-saliba": "/images/players/william-saliba.jpg",
};

/** Official display names — one canonical spelling per portrait */
export const PLAYER_DISPLAY_NAMES: Record<string, string> = {
  "kylian-mbappe": "Kylian Mbappé",
  "erling-haaland": "Erling Haaland",
  "vinicius-junior": "Vinícius Júnior",
  "harry-kane": "Harry Kane",
  "lamine-yamal": "Lamine Yamal",
  "christian-pulisic": "Christian Pulisic",
  "florian-wirtz": "Florian Wirtz",
  "kevin-de-bruyne": "Kevin De Bruyne",
  pedri: "Pedri",
  "jude-bellingham": "Jude Bellingham",
  "alexis-mac-allister": "Alexis Mac Allister",
  "emiliano-martinez": "Emiliano Martínez",
  "gianluigi-donnarumma": "Gianluigi Donnarumma",
  "alisson-becker": "Alisson Becker",
  "mike-maignan": "Mike Maignan",
  "matt-turner": "Matt Turner",
  "alphonso-davies": "Alphonso Davies",
  "antonio-rudiger": "António Rüdiger",
  "cristian-romero": "Cristian Romero",
  marquinhos: "Marquinhos",
  "mohamed-salah": "Mohamed Salah",
  "virgil-van-dijk": "Virgil van Dijk",
  "william-saliba": "William Saliba",
};

/** Alternate spellings / short names → slug */
const NAME_ALIASES: Record<string, string> = {
  "kylian mbappe": "kylian-mbappe",
  "kylian mbappé": "kylian-mbappe",
  mbappe: "kylian-mbappe",
  mbappé: "kylian-mbappe",
  "erling haaland": "erling-haaland",
  haaland: "erling-haaland",
  "vinicius junior": "vinicius-junior",
  "vinícius júnior": "vinicius-junior",
  vinicius: "vinicius-junior",
  vinícius: "vinicius-junior",
  "harry kane": "harry-kane",
  kane: "harry-kane",
  "lamine yamal": "lamine-yamal",
  yamal: "lamine-yamal",
  "christian pulisic": "christian-pulisic",
  pulisic: "christian-pulisic",
  "florian wirtz": "florian-wirtz",
  wirtz: "florian-wirtz",
  "kevin de bruyne": "kevin-de-bruyne",
  "de bruyne": "kevin-de-bruyne",
  "alexis mac allister": "alexis-mac-allister",
  "mac allister": "alexis-mac-allister",
  "emiliano martinez": "emiliano-martinez",
  "emiliano martínez": "emiliano-martinez",
  martinez: "emiliano-martinez",
  martínez: "emiliano-martinez",
  "gianluigi donnarumma": "gianluigi-donnarumma",
  donnarumma: "gianluigi-donnarumma",
  "alisson becker": "alisson-becker",
  alisson: "alisson-becker",
  "mike maignan": "mike-maignan",
  maignan: "mike-maignan",
  "matt turner": "matt-turner",
  turner: "matt-turner",
  "alphonso davies": "alphonso-davies",
  davies: "alphonso-davies",
  "antonio rudiger": "antonio-rudiger",
  "antónio rüdiger": "antonio-rudiger",
  rudiger: "antonio-rudiger",
  rüdiger: "antonio-rudiger",
  "cristian romero": "cristian-romero",
  romero: "cristian-romero",
  "mohamed salah": "mohamed-salah",
  salah: "mohamed-salah",
  "virgil van dijk": "virgil-van-dijk",
  "van dijk": "virgil-van-dijk",
  "william saliba": "william-saliba",
  saliba: "william-saliba",
  "jude bellingham": "jude-bellingham",
  bellingham: "jude-bellingham",
};

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function playerImagePath(slug: string): string | undefined {
  return PLAYER_IMAGE_SLUGS[slug];
}

export function playerSlugFromName(name: string): string | undefined {
  if (!name || name === "—" || name === "Unknown") return undefined;

  const norm = normalizeName(name);
  if (NAME_ALIASES[norm]) return NAME_ALIASES[norm];
  if (norm in PLAYER_IMAGE_SLUGS) return norm;

  const slug = norm.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (slug in PLAYER_IMAGE_SLUGS) return slug;

  const last = norm.split(/\s+/).pop() ?? "";
  if (NAME_ALIASES[last]) return NAME_ALIASES[last];
  for (const key of Object.keys(PLAYER_IMAGE_SLUGS)) {
    if (key.endsWith(`-${last}`) || key === last) return key;
  }

  return undefined;
}

/** Normalize API / feed / last-name-only strings to official display names. */
export function canonicalPlayerName(name: string): string {
  if (!name || name === "—" || name === "Unknown") return name;
  const slug = playerSlugFromName(name);
  if (slug && PLAYER_DISPLAY_NAMES[slug]) return PLAYER_DISPLAY_NAMES[slug];
  return name.trim();
}
