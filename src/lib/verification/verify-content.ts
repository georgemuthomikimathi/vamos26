import type { TeamNewsItem } from "@/lib/team-news";
import {
  buildMatchFacts,
  findFactBetween,
  formatFactScore,
  teamMatchesAlias,
  teamsMatch,
  type MatchFact,
} from "@/lib/verification/match-facts";
import type { Match } from "@/lib/scores/types";

const RESULT_LANGUAGE =
  /\b(beat|beats|defeat|defeats|defeated|stun|stuns|stunned|sink|sinks|sinked|overturn|overturned|win|wins|won|lose|loses|lost|held|hold|draw|drew|equaliz|comeback|final score|full time|ft)\b/i;

/** Pairings that never occurred but appeared in bad copy */
const BLOCKED_FALSE_PAIRINGS: [string, string][] = [
  ["korea republic", "mexico"],
  ["canada", "qatar"],
];

type BeatClaim = { winner: string; loser: string };

function extractBeatClaims(text: string): BeatClaim[] {
  const claims: BeatClaim[] = [];
  const patterns = [
    /([A-Za-z][A-Za-z\s&']+?)\s+(?:beat|beats|defeat(?:s|ed)?|stun(?:s|ned)?|sink(?:s)?|overturn(?:ed)?)\s+([A-Za-z][A-Za-z\s&']+?)(?:\s+\d|\s+in|\s+at|\s+on|\.|,|$)/gi,
    /([A-Za-z][A-Za-z\s&']+?)\s+(\d)\s*[-–]\s*(\d)\s+([A-Za-z][A-Za-z\s&']+?)/gi,
  ];

  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.length === 3) {
        claims.push({ winner: m[1].trim(), loser: m[2].trim() });
      } else if (m.length === 5) {
        const scoreA = Number(m[2]);
        const scoreB = Number(m[3]);
        if (scoreA > scoreB) claims.push({ winner: m[1].trim(), loser: m[4].trim() });
        else if (scoreB > scoreA) claims.push({ winner: m[4].trim(), loser: m[1].trim() });
      }
    }
  }

  return claims;
}

function looksLikeResultClaim(text: string): boolean {
  return RESULT_LANGUAGE.test(text) || /\d\s*[-–]\s*\d/.test(text);
}

function isBlockedPairing(text: string, facts: MatchFact[]): boolean {
  const hay = text.toLowerCase();
  if (!looksLikeResultClaim(text)) return false;

  for (const [a, b] of BLOCKED_FALSE_PAIRINGS) {
    const mentionsA = teamMatchesAlias(hay, a);
    const mentionsB = teamMatchesAlias(hay, b);
    if (mentionsA && mentionsB && !findFactBetween(facts, a, b)) {
      return true;
    }
  }
  return false;
}

function teamPlayedInFacts(facts: MatchFact[], team: string): boolean {
  return facts.some((f) => teamsMatch(f.home, team) || teamsMatch(f.away, team));
}

export type VerificationResult = {
  ok: boolean;
  reason?: string;
};

export function verifyTextAgainstFacts(text: string, facts: MatchFact[]): VerificationResult {
  if (isBlockedPairing(text, facts)) {
    return { ok: false, reason: "Claims a result between teams that did not face each other" };
  }

  const claims = extractBeatClaims(text);
  for (const { winner, loser } of claims) {
    const fixture = findFactBetween(facts, winner, loser);
    if (!fixture) {
      if (teamPlayedInFacts(facts, winner) && teamPlayedInFacts(facts, loser)) {
        return {
          ok: false,
          reason: `${winner} and ${loser} did not play each other in a finished match`,
        };
      }
      continue;
    }

    if (fixture.isDraw) {
      return { ok: false, reason: `Match ended ${formatFactScore(fixture)} (draw)` };
    }

    if (fixture.winner && !teamsMatch(fixture.winner, winner)) {
      return {
        ok: false,
        reason: `Verified result: ${fixture.winner} beat ${fixture.loser} ${formatFactScore(fixture)}`,
      };
    }
  }

  return { ok: true };
}

export function verifyNewsItem(item: TeamNewsItem, facts: MatchFact[]): VerificationResult {
  if (item.verified === true && item.kind === "match-report") {
    return { ok: true };
  }

  if (item.kind === "preview" || item.external === false) {
    const text = `${item.headline} ${item.summary}`;
    if (isBlockedPairing(text, facts)) {
      return { ok: false, reason: "Preview text contradicts verified results" };
    }
    return { ok: true };
  }

  const text = `${item.headline} ${item.summary}`;
  return verifyTextAgainstFacts(text, facts);
}

export function filterVerifiedNews(
  items: TeamNewsItem[],
  matches: Match[]
): { items: TeamNewsItem[]; rejected: { item: TeamNewsItem; reason: string }[] } {
  const facts = buildMatchFacts(matches);
  const accepted: TeamNewsItem[] = [];
  const rejected: { item: TeamNewsItem; reason: string }[] = [];

  for (const item of items) {
    const result = verifyNewsItem(item, facts);
    if (result.ok) {
      accepted.push(item);
    } else {
      rejected.push({ item, reason: result.reason ?? "Failed verification" });
    }
  }

  return { items: accepted, rejected };
}
