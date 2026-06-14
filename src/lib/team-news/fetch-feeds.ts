import type { TeamNewsItem } from "@/lib/team-news";
import { PREVIEW_NEWS } from "@/lib/team-news";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { generateVerifiedMatchReports } from "@/lib/team-news/match-reports";
import { filterVerifiedNews } from "@/lib/verification/verify-content";
import { buildMatchFacts } from "@/lib/verification/match-facts";

export type NewsFeedSource = {
  id: string;
  name: string;
  url: string;
};

export const NEWS_FEEDS: NewsFeedSource[] = [
  {
    id: "bbc-football",
    name: "BBC Sport",
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
  },
  {
    id: "fifa-news",
    name: "FIFA.com",
    url: "https://www.fifa.com/rss-feeds/news",
  },
  {
    id: "espn-soccer",
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/soccer/news",
  },
  {
    id: "guardian-football",
    name: "The Guardian",
    url: "https://www.theguardian.com/football/rss",
  },
  {
    id: "skysports-football",
    name: "Sky Sports",
    url: "https://feeds.skysports.com/rss/12040",
  },
  {
    id: "cbs-soccer",
    name: "CBS Sports",
    url: "https://www.cbssports.com/rss/headlines/soccer/",
  },
  {
    id: "reuters-sports",
    name: "Reuters",
    url: "https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best",
  },
  {
    id: "goal-worldcup",
    name: "Goal.com",
    url: "https://www.goal.com/feeds/en/news",
  },
];

const WC_KEYWORDS = [
  "world cup",
  "fifa",
  "mexico",
  "usa",
  "united states",
  "canada",
  "czechia",
  "czech republic",
  "korea",
  "south korea",
  "bosnia",
  "argentina",
  "brazil",
  "england",
  "germany",
  "france",
  "spain",
  "morocco",
  "south africa",
  "paraguay",
  "australia",
  "turkey",
  "türkiye",
  "pulisic",
  "son heung",
  "vinicius",
  "bellingham",
  "injury",
  "squad",
  "lineup",
  "transfer",
  "tuchel",
  "scaloni",
  "aguirre",
  "pochettino",
  "marsch",
];

type ParsedRssItem = {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
};

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function parseRssItems(xml: string): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = decodeXml(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const link = decodeXml(block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "");
    const description = decodeXml(
      block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? ""
    );
    const pubDate = decodeXml(block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "");

    if (title && link) {
      items.push({ title, link, description, pubDate: pubDate || undefined });
    }
  }

  return items;
}

function isRelevant(headline: string, summary: string): boolean {
  const haystack = `${headline} ${summary}`.toLowerCase();
  return WC_KEYWORDS.some((kw) => haystack.includes(kw));
}

function inferTag(headline: string, summary: string): TeamNewsItem["tag"] {
  const text = `${headline} ${summary}`.toLowerCase();
  if (/injur|doubt|fit|out for|ruled out|muscle|hamstring|knee/.test(text)) return "injury";
  if (/squad|lineup|roster|xi|bench|call-?up/.test(text)) return "squad";
  if (/tactic|formation|coach|manager|tuchel|scaloni|aguirre|pochettino|marsch/.test(text)) {
    return "tactics";
  }
  if (/transfer|fabrizio|roman|deal|sign/.test(text)) return "squad";
  return "form";
}

function inferTeamCode(headline: string, summary: string): { code: string; team: string } {
  const text = `${headline} ${summary}`.toLowerCase();
  const teams: [string, string, string][] = [
    ["mexico", "mx", "Mexico"],
    ["usa", "us", "USA"],
    ["united states", "us", "USA"],
    ["canada", "ca", "Canada"],
    ["czechia", "cz", "Czechia"],
    ["czech republic", "cz", "Czechia"],
    ["korea", "kr", "Korea Republic"],
    ["south korea", "kr", "Korea Republic"],
    ["bosnia", "ba", "Bosnia & Herzegovina"],
    ["brazil", "br", "Brazil"],
    ["argentina", "ar", "Argentina"],
    ["england", "gb-eng", "England"],
    ["germany", "de", "Germany"],
    ["france", "fr", "France"],
    ["spain", "es", "Spain"],
    ["morocco", "ma", "Morocco"],
    ["south africa", "za", "South Africa"],
    ["paraguay", "py", "Paraguay"],
    ["australia", "au", "Australia"],
    ["türkiye", "tr", "Türkiye"],
    ["turkey", "tr", "Türkiye"],
    ["senegal", "sn", "Senegal"],
    ["japan", "jp", "Japan"],
    ["italy", "it", "Italy"],
    ["portugal", "pt", "Portugal"],
    ["switzerland", "ch", "Switzerland"],
    ["croatia", "hr", "Croatia"],
    ["netherlands", "nl", "Netherlands"],
    ["belgium", "be", "Belgium"],
    ["colombia", "co", "Colombia"],
  ];

  for (const [needle, code, team] of teams) {
    if (text.includes(needle)) return { code, team };
  }

  return { code: "un", team: "World Cup" };
}

function formatFeedDate(pubDate?: string): string {
  if (!pubDate) return "Today";
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return "Today";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

function rssToNewsItem(
  item: ParsedRssItem,
  source: NewsFeedSource,
  index: number
): TeamNewsItem | null {
  if (!isRelevant(item.title, item.description)) return null;

  const { code, team } = inferTeamCode(item.title, item.description);

  return {
    id: `rss-${source.id}-${index}-${item.link.slice(-24)}`,
    code,
    team,
    headline: item.title,
    summary: item.description.slice(0, 220) + (item.description.length > 220 ? "…" : ""),
    date: formatFeedDate(item.pubDate),
    tag: inferTag(item.title, item.description),
    url: item.link,
    source: source.name,
    external: true,
    verified: false,
    kind: "rss",
  };
}

async function fetchFeed(source: NewsFeedSource): Promise<TeamNewsItem[]> {
  try {
    const res = await fetch(source.url, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "vamos26-news/1.0",
      },
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const parsed = parseRssItems(xml);

    return parsed
      .map((item, i) => rssToNewsItem(item, source, i))
      .filter((item): item is TeamNewsItem => item != null)
      .slice(0, 10);
  } catch {
    return [];
  }
}

function dedupeNews(items: TeamNewsItem[]): TeamNewsItem[] {
  const seen = new Set<string>();
  const out: TeamNewsItem[] = [];

  for (const item of items) {
    const key = item.headline.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

export type FetchTeamNewsResult = {
  items: TeamNewsItem[];
  sources: string[];
  fetchedAt: string;
  verifiedCount: number;
  rejectedCount: number;
  matchFactsCount: number;
};

/** Verified match reports + screened RSS/previews — misinformation filtered out. */
export async function fetchTeamNews(): Promise<FetchTeamNewsResult> {
  const [{ matches }, feedResults] = await Promise.all([
    fetchMatchesByCompetition("world-cup"),
    Promise.all(NEWS_FEEDS.map(fetchFeed)),
  ]);

  const verifiedReports = generateVerifiedMatchReports(matches);
  const facts = buildMatchFacts(matches);
  const rssItems = feedResults.flat();
  const activeSources = NEWS_FEEDS.filter((_, i) => feedResults[i].length > 0).map((s) => s.name);

  const candidatePool = dedupeNews([...verifiedReports, ...PREVIEW_NEWS, ...rssItems]);
  const { items: verifiedItems, rejected } = filterVerifiedNews(candidatePool, matches);

  const sorted = verifiedItems.sort((a, b) => {
    if (a.verified && !b.verified) return -1;
    if (!a.verified && b.verified) return 1;
    return 0;
  });

  return {
    items: sorted.slice(0, 32),
    sources: ["VAMOS26 Verified", ...activeSources],
    fetchedAt: new Date().toISOString(),
    verifiedCount: sorted.filter((i) => i.verified).length,
    rejectedCount: rejected.length,
    matchFactsCount: facts.length,
  };
}
