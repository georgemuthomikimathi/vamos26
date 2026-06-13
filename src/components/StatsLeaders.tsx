"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Target, Handshake, AlertTriangle, type LucideIcon } from "lucide-react";
import type { StatLeader } from "@/lib/stats";
import { onDataRefresh } from "@/lib/realtime/cascade";
import { POLL_IDLE_MS, POLL_STATS_LIVE_MS } from "@/lib/realtime/polling";
import TeamFlagWithFallback from "@/components/TeamFlag";

type StatsPayload = {
  updatedAt: string;
  matchesPlayed: number;
  scorers: StatLeader[];
  assists: StatLeader[];
  mostCards: StatLeader[];
  provider?: "worldcup26" | "static";
};

const POLL_MS = POLL_IDLE_MS;

function hasRealLeaders(leaders: StatLeader[]): boolean {
  return leaders.some((p) => p.value > 0 && p.name !== "—");
}

function LeaderColumn({
  title,
  icon: Icon,
  leaders,
  unit,
  accent,
  emptyMessage,
}: {
  title: string;
  icon: LucideIcon;
  leaders: StatLeader[];
  unit: string;
  accent: string;
  emptyMessage?: string;
}) {
  const hasData = hasRealLeaders(leaders);

  return (
    <div className="bg-card border border-white/10 rounded-3xl p-6 hover:border-pitch/20 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        <h3 className="font-display text-2xl text-white">{title}</h3>
      </div>
      {hasData ? (
        <div className="space-y-3">
          {leaders.map((p) => (
            <div
              key={`${title}-${p.rank}-${p.name}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span
                className={`font-display text-2xl w-8 text-center ${
                  p.rank === 1 ? "text-gold" : "text-muted"
                }`}
              >
                {p.rank}
              </span>
              <TeamFlagWithFallback code={p.code} name={p.country} size={40} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-[10px] text-muted truncate">{p.club}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-pitch">{p.value}</div>
                <div className="text-[10px] text-muted uppercase">{unit}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-8">{emptyMessage ?? "No data yet."}</p>
      )}
    </div>
  );
}

export default function StatsLeaders() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [activeTab, setActiveTab] = useState<"scorers" | "assists" | "cards">("scorers");
  const [pollMs, setPollMs] = useState(POLL_MS);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats?competition=world-cup", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as StatsPayload;
      setStats(data);
      if ((data.matchesPlayed ?? 0) > 0) {
        setPollMs(POLL_STATS_LIVE_MS);
      }
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!cancelled) await loadStats();
    }

    void init();
    const interval = setInterval(() => void loadStats(), pollMs);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollMs]);

  useEffect(() => {
    return onDataRefresh((reason) => {
      if (reason === "match-finished" || reason === "kickoff") {
        void loadStats();
      }
    });
  }, []);

  const tabs = useMemo(
    () =>
      [
        {
          id: "scorers" as const,
          label: "Goals",
          icon: Target,
          leaders: stats?.scorers ?? [],
          unit: "goals",
          accent: "bg-gradient-to-br from-gold to-orange-600",
          title: "Top Scorers",
          emptyMessage: "Goals will appear as matches finish.",
        },
        {
          id: "assists" as const,
          label: "Assists",
          icon: Handshake,
          leaders: stats?.assists ?? [],
          unit: "assists",
          accent: "bg-gradient-to-br from-pitch to-emerald-700",
          title: "Top Assists",
          emptyMessage: "Assists tracked when available in match data.",
        },
        {
          id: "cards" as const,
          label: "Cards",
          icon: AlertTriangle,
          leaders: stats?.mostCards ?? [],
          unit: "cards",
          accent: "bg-gradient-to-br from-usa-blue to-blue-900",
          title: "Most Cards",
          emptyMessage: "Discipline table builds from finished fixtures.",
        },
      ] as const,
    [stats]
  );

  const current = tabs.find((t) => t.id === activeTab)!;
  const matchesPlayed = stats?.matchesPlayed ?? 0;

  return (
    <section id="stats" className="section-anchor relative py-24 bg-navy">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Tournament Leaders
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            STATS <span className="text-gradient-gold">BOARD</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Golden Boot race, assist kings, and discipline — compiled live from finished World Cup
            matches.
          </p>
          <p className="text-[11px] text-muted/70 mt-3 uppercase tracking-wider">
            Updated from {matchesPlayed} match{matchesPlayed === 1 ? "" : "es"} played
          </p>
        </motion.div>

        <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-hide mb-6 snap-x snap-mandatory">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "true" : undefined}
                className={`shrink-0 snap-start inline-flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-full text-sm font-semibold border transition-all tap-scale focus-ring ${
                  active ? "tab-active" : "border-white/10 text-muted"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="lg:hidden">
          <LeaderColumn
            title={current.title}
            icon={current.icon}
            leaders={current.leaders}
            unit={current.unit}
            accent={current.accent}
            emptyMessage={current.emptyMessage}
          />
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {tabs.map((tab) => (
            <LeaderColumn
              key={tab.id}
              title={tab.title}
              icon={tab.icon}
              leaders={tab.leaders}
              unit={tab.unit}
              accent={tab.accent}
              emptyMessage={tab.emptyMessage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
