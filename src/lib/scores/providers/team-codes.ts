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
};

export function teamNameToCode(name: string): string {
  const direct = TEAM_CODES[name];
  if (direct) return direct;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug.slice(0, 12) || "un";
}
