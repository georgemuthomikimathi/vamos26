/** Site-wide display timezone for kickoffs and timestamps */
export const DISPLAY_TIMEZONE = "America/New_York";
export const DISPLAY_TZ_LABEL = "ET";

const kickoffFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: DISPLAY_TIMEZONE,
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: DISPLAY_TIMEZONE,
  month: "short",
  day: "numeric",
});

const updatedFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: DISPLAY_TIMEZONE,
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

/** Convert local wall-clock in an IANA zone to UTC Date */
export function zonedLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const partsAtGuess = partsToRecord(formatter.formatToParts(new Date(utcGuess)));
  const asUtc = Date.UTC(
    Number(partsAtGuess.year),
    Number(partsAtGuess.month) - 1,
    Number(partsAtGuess.day),
    Number(partsAtGuess.hour),
    Number(partsAtGuess.minute)
  );
  const delta = utcGuess - asUtc;
  return new Date(utcGuess + delta);
}

function partsToRecord(parts: Intl.DateTimeFormatPart[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") out[p.type] = p.value;
  }
  return out;
}

export function formatKickoffET(isoOrDate: string | Date): { date: string; time: string } {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  const date = dateFormatter.format(d);
  const time = `${kickoffFormatter.format(d).split(", ").pop()} ${DISPLAY_TZ_LABEL}`;
  return { date, time };
}

export function formatUpdatedET(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return `${updatedFormatter.format(d)} ${DISPLAY_TZ_LABEL}`;
}

export function formatSubstitutionMinute(minute: number, extraMinute?: number): string {
  if (extraMinute && extraMinute > 0) return `${minute}+${extraMinute}'`;
  return `${minute}'`;
}

/** Infer stadium IANA zone from worldcup26 stadium metadata */
export function stadiumTimeZone(cityEn: string, countryEn: string): string {
  const city = cityEn.toLowerCase();
  if (countryEn === "Mexico") return "America/Mexico_City";
  if (countryEn === "Canada") {
    if (city.includes("vancouver")) return "America/Vancouver";
    return "America/Toronto";
  }
  if (/los angeles|inglewood|pasadena|santa clara|seattle|levis/.test(city)) {
    return "America/Los_Angeles";
  }
  if (/kansas|houston|dallas|arlington|chicago|nashville|miami|orlando|philadelphia|east rutherford|foxborough|atlanta|charlotte|baltimore/.test(city)) {
    if (city.includes("kansas")) return "America/Chicago";
    if (city.includes("houston") || city.includes("dallas") || city.includes("arlington")) {
      return "America/Chicago";
    }
    if (city.includes("miami") || city.includes("orlando") || city.includes("atlanta") || city.includes("charlotte")) {
      return "America/New_York";
    }
    return "America/New_York";
  }
  return "America/New_York";
}
