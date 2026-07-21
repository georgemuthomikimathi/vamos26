"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Filter, Newspaper } from "lucide-react";
import {
  AFTERMATH_NEWS,
  AFTERMATH_UPDATED,
  type AftermathNewsItem,
} from "@/lib/aftermath-news";

type FilterId = "all" | "celebration" | "reaction" | "banter" | "drama";

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "celebration", label: "Celebrations" },
  { id: "reaction", label: "Reactions" },
  { id: "banter", label: "Banter" },
  { id: "drama", label: "Drama" },
];

const CATEGORY_COLOR: Record<AftermathNewsItem["category"], string> = {
  celebration: "text-gold border-gold/30 bg-gold/10",
  reaction: "text-pitch border-pitch/30 bg-pitch/10",
  banter: "text-sky-300 border-sky-400/30 bg-sky-500/10",
  drama: "text-red-400 border-red-500/30 bg-red-500/10",
  team: "text-usa-blue border-usa-blue/30 bg-usa-blue/10",
};

const CATEGORY_LABEL: Record<AftermathNewsItem["category"], string> = {
  celebration: "Celebration",
  reaction: "Reaction",
  banter: "Banter",
  drama: "Drama",
  team: "Team",
};

function NewsCard({
  item,
  index,
}: {
  item: AftermathNewsItem;
  index: number;
}) {
  const featured = Boolean(item.featured);

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className={`group flex flex-col rounded-2xl p-5 transition-colors focus-ring ${
        featured
          ? "sm:col-span-2 lg:col-span-2 bg-card border-2 border-gold/50 hover:border-gold"
          : "bg-card border border-white/10 hover:border-pitch/40"
      }`}
      aria-label={`${item.headline} — ${item.source}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${CATEGORY_COLOR[item.category]}`}
        >
          {CATEGORY_LABEL[item.category]}
        </span>
        <span className="text-[10px] text-muted shrink-0">{item.date}</span>
      </div>

      <h3
        className={`font-semibold text-white leading-snug group-hover:text-pitch transition-colors ${
          featured ? "text-lg md:text-xl" : "text-sm md:text-base"
        }`}
      >
        {item.headline}
      </h3>

      <p
        className={`text-muted mt-2 leading-relaxed flex-1 ${
          featured ? "text-sm line-clamp-4" : "text-xs line-clamp-3"
        }`}
      >
        {item.summary}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-white/5">
        <span className="text-[10px] uppercase tracking-wider text-muted/80">
          {item.source}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-pitch group-hover:text-gold transition-colors">
          Full story
          <ExternalLink
            size={11}
            className="group-hover:translate-x-0.5 transition-transform"
            aria-hidden
          />
        </span>
      </div>
    </motion.a>
  );
}

export default function AftermathNewsSection() {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered =
    filter === "all"
      ? AFTERMATH_NEWS
      : AFTERMATH_NEWS.filter((n) => n.category === filter);

  const featured = filtered.filter((n) => n.featured);
  const rest = filtered.filter((n) => !n.featured);
  const ordered = [...featured, ...rest];

  return (
    <section id="news" className="section-anchor relative py-20 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-pitch/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Newspaper size={24} className="text-gold" aria-hidden />
            <div>
              <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold">
                Aftermath
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-white">
                NEWS <span className="text-gradient-gold">&amp; REACTIONS</span>
              </h2>
            </div>
          </div>
          <p className="text-[10px] text-muted/80 mt-2 uppercase tracking-wider">
            Updated {AFTERMATH_UPDATED}
          </p>
          <p className="text-muted text-sm max-w-xl mt-1">
            Links out to full stories · refreshed daily
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 min-h-[36px] rounded-full text-xs font-semibold border transition-all flex items-center gap-1 tap-scale focus-ring ${
                filter === f.id
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-muted hover:text-white"
              }`}
            >
              {f.id === "all" && <Filter size={12} aria-hidden />}
              {f.label}
            </button>
          ))}
        </div>

        {ordered.length === 0 ? (
          <p className="text-sm text-muted text-center py-12">
            No stories in this category yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordered.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
