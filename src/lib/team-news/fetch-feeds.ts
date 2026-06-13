import type { TeamNewsItem } from "@/lib/team-news";
import { TEAM_NEWS } from "@/lib/team-news";

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
];

const WC_KEYWORDS = [
  "world cup",
  "fifa",
  "mexico",
  "usa",
  "united states",
  "canada",
  "argentina",
  "brazil",
  "england",
  "germany",
  "france",
  "spain",
  "morocco",
  "south africa",
  "paraguay",
  "injury",
  "squad",
  "lineup",
  "transfer",
  "fabrizio",
  "roman",
  "tuchel",
  "scaloni",
  "aguirre",
  "pochettino",
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
  if (/tactic|formation|coach|manager|tuchel|scaloni|aguirre|pochettino/.test(text)) {
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
    ["brazil", "br", "Brazil"],
    ["argentina", "ar", "Argentina"],
    ["england", "gb-eng", "England"],
    ["germany", "de", "Germany"],
    ["france", "fr", "France"],
    ["spain", "es", "Spain"],
    ["morocco", "ma", "Morocco"],
    ["south africa", "za", "South Africa"],
    ["paraguay", "py", "Paraguay"],
    ["croatia", "hr", "Croatia"],
    ["netherlands", "nl", "Netherlands"],
    ["belgium", "be", "Belgium"],
    ["colombia", "co", "Colombia"],
    ["korea", "kr", "Korea Republic"],
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
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" });
}

function rssToNewsItem(item: ParsedRssItem, source: NewsFeedSource, index: number): TeamNewsItem | null {
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
      .slice(0, 8);
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

/** Merge curated headlines with live RSS — curated items take priority. */
export async function fetchTeamNews(): Promise<{
  items: TeamNewsItem[];
  sources: string[];
  fetchedAt: string;
}> {
  const feedResults = await Promise.all(NEWS_FEEDS.map(fetchFeed));
  const rssItems = feedResults.flat();
  const activeSources = NEWS_FEEDS.filter((_, i) => feedResults[i].length > 0).map((s) => s.name);

  const merged = dedupeNews([...TEAM_NEWS, ...rssItems]).slice(0, 24);

  return {
    items: merged,
    sources: activeSources,
    fetchedAt: new Date().toISOString(),
  };
}
