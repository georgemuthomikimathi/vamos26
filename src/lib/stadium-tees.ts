import type { Stadium } from "@/lib/stadiums";
import { TEE_PRODUCTS, type TeeProduct } from "@/lib/dropship";

/** Primary fan tee per host venue */
export const STADIUM_TEE_IDS: Record<string, string> = {
  metlife: "nj-empire",
  sofi: "la-angel",
  att: "dal-lone",
  mercedes: "atl-rise",
  hardrock: "mia-magic",
  levis: "sf-golden",
  lumen: "sea-emerald",
  lincoln: "phi-brotherly",
  nrg: "hou-space",
  gillette: "bos-beantown",
  arrowhead: "kc-heart",
  azteca: "mex-vamos",
  bmo: "tor-six",
  bcplace: "van-gateway",
  akron: "gdl-pearl",
  bbva: "mty-sultana",
};

export function getTeeForStadium(stadium: Stadium): TeeProduct | undefined {
  const byId = STADIUM_TEE_IDS[stadium.id];
  if (byId) {
    return TEE_PRODUCTS.find((p) => p.id === byId);
  }
  return TEE_PRODUCTS.find(
    (p) =>
      p.category === "city" &&
      (p.city.toLowerCase() === stadium.city.toLowerCase() ||
        stadium.city.toLowerCase().includes(p.city.toLowerCase()) ||
        p.city.toLowerCase().includes(stadium.city.toLowerCase().split(" ")[0] ?? ""))
  );
}

export function formatStadiumLocation(stadium: Stadium): string {
  const nation =
    stadium.hostNation === "USA"
      ? "United States"
      : stadium.hostNation === "Canada"
        ? "Canada"
        : "Mexico";
  return `${stadium.city}, ${stadium.state} · ${nation}`;
}

export function formatCapacity(capacity: number): string {
  return capacity.toLocaleString("en-US");
}

export function mapsUrl(stadium: Stadium): string {
  return `https://www.google.com/maps/search/?api=1&query=${stadium.lat},${stadium.lng}`;
}
