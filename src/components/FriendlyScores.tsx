"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Users, Trophy, CalendarClock } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES, getFriendlySummary } from "@/lib/friendlies";
import FriendlyMatchCard from "@/components/FriendlyMatchCard";

type Filter = "all" | "finished" | "upcoming";

export default function FriendlyScores() {
  const [matches, setMatches] = useState<Match[]>(FRIENDLY_MATCHES);
  const [filter, setFilter] = useState<Filter>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchFriendlies = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch("/api/live?competition=friendly");
      const data = await res.json();
      if (data.matches?.length) setMatches(data.matches);
    } catch {
      /* silent */
    } finally {
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const boot = window.setTimeout(() => {
      void fetchFriendlies();
    }, 0);
    const interval = setInterval(() => {
      void fetchFriendlies();
    }, 60000);
    return () => {
      window.clearTimeout(boot);
      clearInterval(interval);
    };
  }, [fetchFriendlies]);

  const summary = useMemo(() => getFriendlySummary(matches), [matches]);

  const filtered = useMemo(() => {
    if (filter === "finished") return matches.filter((m) => m.status === "finished");
    if (filter === "upcoming") return matches.filter((m) => m.status === "scheduled");
    return matches;
  }, [matches, filter]);

  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: summary.total },
    { id: "finished", label: "Results", count: summary.finished },
    { id: "upcoming", label: "Upcoming", count: summary.upcoming },
  ];

  return (
    <section id="friendlies" className="section-anchor relative py-16 bg-navy-light overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-pitch/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Users size={24} className="text-gold" />
                <div>
                  <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold">
                    Pre-Tournament
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-white">
                    FRIENDLY <span className="text-gradient-gold">SCORES</span>
                  </h2>
                </div>
              </div>
              <p className="text-muted text-sm mt-2 max-w-xl">
                Recent international warm-ups with goal scorers and projected XIs from current
                squads. Tap a match — or a flag — for lineups.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchFriendlies(true)}
              disabled={refreshing}
              className="flex items-center gap-2 self-start bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
            <div className="bg-card/80 border border-white/10 rounded-xl p-3 text-center">
              <Trophy size={16} className="text-gold mx-auto mb-1" />
              <div className="font-display text-2xl text-white">{summary.finished}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted">Played</div>
            </div>
            <div className="bg-card/80 border border-white/10 rounded-xl p-3 text-center">
              <CalendarClock size={16} className="text-pitch mx-auto mb-1" />
              <div className="font-display text-2xl text-white">{summary.upcoming}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted">Upcoming</div>
            </div>
            <div className="bg-card/80 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-lg leading-none block mb-1">⚽</span>
              <div className="font-display text-2xl text-white">{summary.goals}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted">Goals</div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filter === f.id
                  ? "bg-gold/15 border-gold/40 text-gold"
                  : "border-white/10 text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">({f.count})</span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((match, i) => (
              <motion.div
                key={match.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedId(match.id)}
              >
                <FriendlyMatchCard
                  match={match}
                  defaultExpanded={selectedId === match.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
