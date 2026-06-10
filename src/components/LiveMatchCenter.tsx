"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import MatchCard from "@/components/MatchCard";

export default function LiveMatchCenter() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/live?competition=world-cup");
        const data = await res.json();
        setMatches(data.matches);
        setLiveCount(data.liveCount);
        setLastUpdate(new Date(data.updatedAt).toLocaleTimeString());
      } catch {
        /* fallback silent */
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="live" className="relative py-20 md:py-24 bg-navy overflow-hidden">
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
              Pre-tournament fixtures show nil-nil until kickoff. Auto-refreshes every 30s.
              {lastUpdate && (
                <span className="text-pitch/70 block text-xs mt-1">
                  Last updated {lastUpdate}
                </span>
              )}
            </p>
          </div>
          {liveCount > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-center flex items-center gap-3">
              <Radio size={20} className="text-red-400 animate-pulse" />
              <div>
                <div className="font-display text-3xl text-red-400">{liveCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted">Live Now</div>
              </div>
            </div>
          )}
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
                <MatchCard match={match} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
