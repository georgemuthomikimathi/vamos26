"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Star } from "lucide-react";
import type { StatLeader } from "@/lib/stats";
import type { MatchMvp } from "@/lib/scores/match-mvp";
import { onDataRefresh } from "@/lib/realtime/cascade";
import { POLL_STATS_MS } from "@/lib/realtime/polling";
import TeamFlagWithFallback from "@/components/TeamFlag";
import DataProviderBadge from "@/components/DataProviderBadge";

type StatsPayload = {
  updatedAt: string;
  matchesPlayed: number;
  scorers: StatLeader[];
  manOfTheMatch?: MatchMvp | null;
  provider?: "api-football" | "static";
};

function ScorerRow({ player }: { player: StatLeader }) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <span
        className={`font-display text-xl w-7 text-center shrink-0 ${
          player.rank === 1 ? "text-gold" : "text-muted"
        }`}
      >
        {player.rank}
      </span>
      <TeamFlagWithFallback code={player.code} name={player.country} size={32} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{player.name}</div>
        <div className="text-[10px] text-muted truncate">{player.club}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-display text-xl text-pitch">{player.value}</div>
        <div className="text-[9px] text-muted uppercase">goals</div>
      </div>
    </div>
  );
}

export default function StatsLeaders() {
  const [stats, setStats] = useState<StatsPayload | null>(null);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats?competition=world-cup", { cache: "no-store" });
      if (!res.ok) return;
      setStats((await res.json()) as StatsPayload);
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    void loadStats();
    const interval = setInterval(() => void loadStats(), POLL_STATS_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return onDataRefresh(() => void loadStats());
  }, []);

  const scorers = stats?.scorers ?? [];
  const motm = stats?.manOfTheMatch;

  return (
    <section id="stats" className="section-anchor relative py-24 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center gap-2 flex-wrap">
            Tournament stats
            {stats?.provider && <DataProviderBadge provider={stats.provider} />}
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-3">
            GOALS & <span className="text-gradient-pitch">MOTM</span>
          </h2>
          <p className="text-muted text-sm max-w-2xl">
            Top scorers and man of the match from API-Football. Updates when matches finish.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card border border-white/10 rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-orange-600 flex items-center justify-center">
                <Target size={18} className="text-white" />
              </div>
              <h3 className="font-display text-2xl text-white">Goal scorers</h3>
            </div>
            {scorers.some((p) => p.value > 0) ? (
              <div className="space-y-2">
                {scorers.slice(0, 8).map((p) => (
                  <ScorerRow key={`${p.rank}-${p.name}`} player={p} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-8">
                Scorers appear as matches finish.
              </p>
            )}
          </div>

          <div className="bg-card border border-white/10 rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pitch to-emerald-700 flex items-center justify-center">
                <Star size={18} className="text-white" />
              </div>
              <h3 className="font-display text-2xl text-white">Man of the match</h3>
            </div>
            {motm ? (
              <div className="flex flex-col items-center text-center py-6 gap-4">
                <TeamFlagWithFallback code={motm.teamCode} name={motm.teamName} size={80} />
                <div>
                  <p className="font-display text-3xl text-white">{motm.name}</p>
                  <p className="text-sm text-muted mt-1">{motm.teamName}</p>
                  <p className="text-pitch font-semibold mt-2">
                    {motm.goals} goal{motm.goals !== 1 ? "s" : ""}
                    {motm.assists > 0 &&
                      ` · ${motm.assists} assist${motm.assists !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-8">
                Latest standout from the most recent full-time result.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
