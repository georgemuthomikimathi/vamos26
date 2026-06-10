"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Filter } from "lucide-react";
import { TEAM_NEWS, type TeamNewsItem } from "@/lib/team-news";
import TeamFlagWithFallback from "@/components/TeamFlag";

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

export default function TeamNewsSection() {
  const [tag, setTag] = useState<"all" | TeamNewsItem["tag"]>("all");

  const filtered =
    tag === "all" ? TEAM_NEWS : TEAM_NEWS.filter((n) => n.tag === tag);

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
          <div className="flex items-center gap-3 mb-2">
            <Newspaper size={24} className="text-pitch" />
            <div>
              <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold">
                Squad Tracker
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-white">
                TEAM <span className="text-gradient-pitch">NEWS</span>
              </h2>
            </div>
          </div>
          <p className="text-muted text-sm max-w-xl">
            Follow squad updates, form, and tactics as nations prepare for kickoff.
          </p>
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-white/10 rounded-2xl p-4 hover:border-pitch/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <TeamFlagWithFallback code={item.code} name={item.team} size={28} />
                <span className="text-xs text-muted">{item.date}</span>
              </div>
              <span
                className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${TAG_COLOR[item.tag]}`}
              >
                {item.tag}
              </span>
              <h3 className="font-semibold text-white text-sm mt-2 leading-snug">
                {item.headline}
              </h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">{item.summary}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
