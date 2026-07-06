/** Map API-Football / common team names → flag codes used on site */
const TEAM_CODES: Record<string, string> = {
  USA: "us",
  "United States": "us",
  Mexico: "mx",
  Canada: "ca",
  Brazil: "br",
  Argentina: "ar",
  England: "gb-eng",
  France: "fr",
  Germany: "de",
  Spain: "es",
  Portugal: "pt",
  Netherlands: "nl",
  Croatia: "hr",
  Morocco: "ma",
  Japan: "jp",
  "Korea Republic": "kr",
  "South Korea": "kr",
  Australia: "au",
  Paraguay: "py",
  Türkiye: "tr",
  Turkey: "tr",
  Colombia: "co",
  Ecuador: "ec",
  Uruguay: "uy",
  Switzerland: "ch",
  Scotland: "gb-sct",
  "South Africa": "za",
  Czechia: "cz",
  "Bosnia & Herzegovina": "ba",
  "Bosnia and Herzegovina": "ba",
  "Czech Republic": "cz",
  Qatar: "qa",
  Haiti: "ht",
  "Côte d'Ivoire": "ci",
  "Ivory Coast": "ci",
  Belgium: "be",
  Senegal: "sn",
  Poland: "pl",
  Austria: "at",
  Denmark: "dk",
  Sweden: "se",
  Norway: "no",
  Wales: "gb-wls",
  Iran: "ir",
  "IR Iran": "ir",
  "Saudi Arabia": "sa",
  Tunisia: "tn",
  Egypt: "eg",
  Nigeria: "ng",
  Ghana: "gh",
  Cameroon: "cm",
  Algeria: "dz",
  Chile: "cl",
  Peru: "pe",
  Panama: "pa",
  "Costa Rica": "cr",
  Jamaica: "jm",
  "New Zealand": "nz",
  Uzbekistan: "uz",
  Jordan: "jo",
  Iraq: "iq",
  "DR Congo": "cd",
  "Congo DR": "cd",
  "Cabo Verde": "cv",
  "Cape Verde": "cv",
  Curaçao: "cw",
  Curacao: "cw",
  "Curacao (Curaçao)": "cw",
};

export function teamNameToCode(name: string): string {
  const direct = TEAM_CODES[name];
  if (direct) return direct;

  const normalized = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
  const normalizedDirect = TEAM_CODES[normalized];
  if (normalizedDirect) return normalizedDirect;

  for (const [key, code] of Object.entries(TEAM_CODES)) {
    const keyNorm = key
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase();
    if (keyNorm === normalized.toLowerCase()) return code;
  }

  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug.slice(0, 12) || "un";
}
