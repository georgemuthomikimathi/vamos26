"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { OPENING_MATCHES } from "@/lib/data";
import { formatMatchScheduleLine } from "@/lib/timezone";
import TeamFlagWithFallback from "@/components/TeamFlag";

export default function UpcomingMatches() {
  return (
    <section id="fixtures" className="relative py-24 bg-navy">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Coming Up
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            OPENING <span className="text-gradient-pitch">FIXTURES</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            The first matches of World Cup 2026 — all 48 teams confirmed after
            the March playoffs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {OPENING_MATCHES.map((match, i) => (
            <motion.article
              key={`${match.home.code}-${match.away.code}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`bg-card border rounded-3xl p-5 hover:border-pitch/40 transition-all ${
                i === 0
                  ? "border-gold/40 bg-gold/5 md:col-span-2 lg:col-span-1"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${
                    i === 0
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "bg-pitch/10 text-pitch border border-pitch/20"
                  }`}
                >
                  {match.stage}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Calendar size={12} />
                  {formatMatchScheduleLine(match)}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <TeamFlagWithFallback
                    code={match.home.code}
                    name={match.home.name}
                    size={80}
                  />
                  <span className="text-sm font-semibold text-center leading-tight">
                    {match.home.name}
                  </span>
                </div>

                <span className="font-display text-2xl text-muted shrink-0">VS</span>

                <div className="flex flex-col items-center gap-2 flex-1">
                  <TeamFlagWithFallback
                    code={match.away.code}
                    name={match.away.name}
                    size={80}
                  />
                  <span className="text-sm font-semibold text-center leading-tight">
                    {match.away.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted mt-4 pt-4 border-t border-white/10">
                <MapPin size={12} className="text-pitch shrink-0" />
                {match.venue}, {match.city}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
