/** Portrait paths for stats leaders — keyed by slug */
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
};

export function playerImagePath(slug: string): string | undefined {
  return PLAYER_IMAGE_SLUGS[slug];
}
