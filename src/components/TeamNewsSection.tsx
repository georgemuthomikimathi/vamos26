"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Filter, Newspaper, RefreshCw } from "lucide-react";
import { isExternalNews, type TeamNewsItem } from "@/lib/team-news";
import { onDataRefresh } from "@/lib/realtime/cascade";
import { POLL_NEWS_MS } from "@/lib/realtime/polling";
import TeamFlagWithFallback from "@/components/TeamFlag";
import { formatUpdatedET } from "@/lib/timezone";

const TAGS: Array<{ id: "all" | TeamNewsItem["tag"]; label: string }> = [
  { id: "all", label: "All" },
  { id: "squad", label: "Squads" },
  { id: "form", label: "Form" },
  { id: "tactics", label: "Tactics" },
  { id: "injury", label: "Injuries" },
];

const TAG_COLOR: Record<TeamNewsItem["tag"], string> = {
  squad: "text-pitch border-pitch/30 bg-pitch/10",
  form: "text-gold border-gold/30 bg-gold/10",
  tactics: "text-usa-blue border-usa-blue/30 bg-usa-blue/10",
  injury: "text-red-400 border-red-500/30 bg-red-500/10",
};

function ArticleReadMore({ item }: { item: TeamNewsItem }) {
  const external = isExternalNews(item);
  const className =
    "inline-flex items-center gap-1.5 text-xs font-semibold text-pitch hover:text-white transition-colors mt-3 group/link";

  if (external) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`Read more: ${item.headline}`}
      >
        Read more
        <ExternalLink size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
      </a>
    );
  }

  return (
    <Link href={item.url} className={className} aria-label={`Read more: ${item.headline}`}>
      Read more
      <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
    </Link>
  );
}

export default function TeamNewsSection() {
  const [tag, setTag] = useState<"all" | TeamNewsItem["tag"]>("all");
  const [items, setItems] = useState<TeamNewsItem[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.items?.length) setItems(data.items);
      if (data.sources) setSources(data.sources);
      if (data.updatedAt) setLastUpdate(formatUpdatedET(data.updatedAt));
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNews();
    const interval = setInterval(() => void fetchNews(), POLL_NEWS_MS);
    return () => clearInterval(interval);
  }, [fetchNews]);

  useEffect(() => {
    return onDataRefresh((reason) => {
      if (reason === "match-finished") void fetchNews();
    });
  }, [fetchNews]);

  const filtered = tag === "all" ? items : items.filter((n) => n.tag === tag);

  return (
    <section id="news" className="section-anchor relative py-20 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-usa-blue/5 via-transparent to-pitch/5 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Newspaper size={24} className="text-pitch" />
                <div>
                  <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold">
                    Live Coverage
                  </p>
                  <h2 className="font-display text-3xl md:text-5xl text-white">
                    TEAM <span className="text-gradient-pitch">NEWS</span>
                  </h2>
                </div>
              </div>
              <p className="text-muted text-sm max-w-xl">
                Match reports, squad updates, and tactical takes — curated headlines plus live RSS
                from BBC Sport, FIFA, ESPN, and The Guardian.
              </p>
              {lastUpdate && (
                <p className="text-[10px] text-muted/70 mt-2 uppercase tracking-wider">
                  Updated {lastUpdate}
                  {sources.length > 0 && ` · ${sources.join(", ")}`}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => void fetchNews()}
              className="inline-flex items-center gap-2 text-xs text-pitch hover:text-white transition-colors"
              aria-label="Refresh team news"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTag(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 ${
                tag === t.id
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-muted hover:text-white"
              }`}
            >
              {t.id === "all" && <Filter size={12} />}
              {t.label}
            </button>
          ))}
        </div>

        {loading && items.length === 0 ? (
          <p className="text-sm text-muted text-center py-12">Loading team news…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted text-center py-12">No articles in this category yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group bg-card border border-white/10 rounded-2xl p-4 hover:border-pitch/30 transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamFlagWithFallback code={item.code} name={item.team} size={28} />
                    <span className="text-xs text-muted shrink-0">{item.date}</span>
                  </div>
                  <span className="text-[9px] text-muted/80 truncate max-w-[40%]">{item.source}</span>
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${TAG_COLOR[item.tag]}`}
                >
                  {item.tag}
                </span>
                <h3 className="font-semibold text-white text-sm mt-2 leading-snug">{item.headline}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3 flex-1">
                  {item.summary}
                </p>
                <ArticleReadMore item={item} />
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
