"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Radio, RefreshCw } from "lucide-react";
import MatchCard from "@/components/MatchCard";
import { useLiveScores } from "@/context/LiveScoresContext";

export default function LiveMatchCenter() {
  const { worldCup, refreshing, refresh } = useLiveScores();
  const { matches, liveCount, updatedAt, changedMatchIds } = worldCup;
  const lastUpdate = updatedAt ? new Date(updatedAt).toLocaleTimeString() : "";

  return (
    <section id="live" className="section-anchor relative py-20 md:py-24 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-pitch/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-red-400 uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center gap-2">
              {liveCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
              World Cup 2026
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-white">
              LIVE <span className="text-gradient-pitch">SCORES</span>
            </h2>
            <p className="text-muted mt-2 max-w-xl text-sm">
              Tap any match for details. Scores refresh every 30s — cards pulse when
              updated.
              {lastUpdate && (
                <span className="text-pitch/70 block text-xs mt-1">
                  Last updated {lastUpdate}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refresh()}
              disabled={refreshing}
              aria-label="Refresh live scores"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-sm font-medium text-muted hover:text-white transition-colors tap-scale focus-ring disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            {liveCount > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-center flex items-center gap-3">
                <Radio size={20} className="text-red-400 animate-pulse" />
                <div>
                  <div className="font-display text-3xl text-red-400">{liveCount}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">Live Now</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid gap-2">
          <AnimatePresence mode="popLayout">
            {matches.map((match, i) => (
              <motion.div
                key={match.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <MatchCard
                  match={match}
                  highlight={changedMatchIds.includes(match.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
