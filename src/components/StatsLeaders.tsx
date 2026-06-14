"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Handshake,
  AlertTriangle,
  CircleDot,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";
import type { StatLeader } from "@/lib/stats";
import type { TournamentStatsSummary } from "@/lib/stats/compile-tournament-stats";
import { onDataRefresh } from "@/lib/realtime/cascade";
import { POLL_IDLE_MS, POLL_STATS_LIVE_MS } from "@/lib/realtime/polling";
import TeamFlagWithFallback from "@/components/TeamFlag";
import DataProviderBadge from "@/components/DataProviderBadge";

type StatsTab =
  | "scorers"
  | "assists"
  | "yellow"
  | "red"
  | "penalties"
  | "subs";

type StatsPayload = {
  updatedAt: string;
  matchesPlayed: number;
  scorers: StatLeader[];
  assists: StatLeader[];
  yellowCards: StatLeader[];
  redCards: StatLeader[];
  penalties: StatLeader[];
  substitutions: StatLeader[];
  summary?: TournamentStatsSummary;
  provider?: "api-football" | "worldcup26" | "static";
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
    <div className="bg-card border border-white/10 rounded-3xl p-5 md:p-6 hover:border-pitch/20 transition-colors">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl ${accent} flex items-center justify-center shrink-0`}>
          <Icon size={18} className="text-white" />
        </div>
        <h3 className="font-display text-xl md:text-2xl text-white">{title}</h3>
      </div>
      {hasData ? (
        <div className="space-y-2">
          {leaders.map((p) => (
            <div
              key={`${title}-${p.rank}-${p.name}`}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span
                className={`font-display text-xl w-7 text-center shrink-0 ${
                  p.rank === 1 ? "text-gold" : "text-muted"
                }`}
              >
                {p.rank}
              </span>
              <TeamFlagWithFallback code={p.code} name={p.country} size={32} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-[10px] text-muted truncate">{p.club}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-xl text-pitch">{p.value}</div>
                <div className="text-[9px] text-muted uppercase">{unit}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-6">{emptyMessage ?? "No data yet."}</p>
      )}
    </div>
  );
}

function SummaryStrip({ summary }: { summary: TournamentStatsSummary }) {
  const items = [
    { label: "Goals", value: summary.totalGoals },
    { label: "Assists", value: summary.totalAssists },
    { label: "Yellow", value: summary.totalYellow },
    { label: "Red", value: summary.totalRed },
    { label: "Penalties", value: summary.totalPenalties },
    { label: "Subs", value: summary.totalSubstitutions },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card/60 border border-white/10 rounded-2xl px-3 py-3 text-center"
        >
          <div className="font-display text-2xl text-pitch">{item.value}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function StatsLeaders() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [activeTab, setActiveTab] = useState<StatsTab>("scorers");
  const [pollMs, setPollMs] = useState(POLL_MS);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats?competition=world-cup", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as StatsPayload;
      setStats(data);
      if ((data.summary?.totalGoals ?? 0) > 0 || (data.matchesPlayed ?? 0) > 0) {
        setPollMs(POLL_STATS_LIVE_MS);
      }
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadStats();
    })();
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
          emptyMessage: "Goals appear as matches finish or go live.",
        },
        {
          id: "assists" as const,
          label: "Assists",
          icon: Handshake,
          leaders: stats?.assists ?? [],
          unit: "assists",
          accent: "bg-gradient-to-br from-pitch to-emerald-700",
          title: "Top Assists",
          emptyMessage: "Assists tracked from API match events.",
        },
        {
          id: "yellow" as const,
          label: "Yellow",
          icon: AlertTriangle,
          leaders: stats?.yellowCards ?? [],
          unit: "yellow",
          accent: "bg-gradient-to-br from-yellow-500 to-yellow-700",
          title: "Yellow Cards",
          emptyMessage: "Bookings build from match events.",
        },
        {
          id: "red" as const,
          label: "Red",
          icon: AlertTriangle,
          leaders: stats?.redCards ?? [],
          unit: "red",
          accent: "bg-gradient-to-br from-red-600 to-red-900",
          title: "Red Cards",
          emptyMessage: "Reds and second yellows tracked.",
        },
        {
          id: "penalties" as const,
          label: "Pens",
          icon: CircleDot,
          leaders: stats?.penalties ?? [],
          unit: "penalties",
          accent: "bg-gradient-to-br from-usa-blue to-blue-900",
          title: "Penalty Goals",
          emptyMessage: "Penalty goals scored in the tournament.",
        },
        {
          id: "subs" as const,
          label: "Subs",
          icon: ArrowLeftRight,
          leaders: stats?.substitutions ?? [],
          unit: "subs",
          accent: "bg-gradient-to-br from-purple-600 to-purple-900",
          title: "Most Sub Appearances",
          emptyMessage: "Players coming off the bench.",
        },
      ] as const,
    [stats]
  );

  const current = tabs.find((t) => t.id === activeTab)!;
  const summary = stats?.summary;
  const matchesPlayed = stats?.matchesPlayed ?? 0;
  const liveNote =
    summary && summary.liveMatches > 0
      ? ` · ${summary.liveMatches} live`
      : "";

  return (
    <section id="stats" className="section-anchor relative py-24 bg-navy">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center justify-center gap-2 flex-wrap">
            Tournament Leaders
            {stats?.provider && <DataProviderBadge provider={stats.provider} />}
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            STATS <span className="text-gradient-gold">BOARD</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm">
            Golden Boot, assists, cards, penalties & subs — compiled from every finished and
            live World Cup match via API-Football events.
          </p>
          <p className="text-[11px] text-muted/70 mt-3 uppercase tracking-wider">
            {matchesPlayed} finished match{matchesPlayed === 1 ? "" : "es"}
            {liveNote}
          </p>
        </motion.div>

        {summary && summary.totalGoals > 0 && <SummaryStrip summary={summary} />}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 snap-x snap-mandatory lg:flex-wrap lg:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "true" : undefined}
                className={`shrink-0 snap-start inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-semibold border transition-all tap-scale focus-ring ${
                  active ? "tab-active" : "border-white/10 text-muted hover:text-white"
                }`}
              >
                <Icon size={15} />
                {tab.label}
                {hasRealLeaders(tab.leaders) && (
                  <span className="text-[10px] bg-white/10 rounded-full px-1.5 py-0.5">
                    {tab.leaders[0]?.value}
                  </span>
                )}
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

        <div className="hidden lg:grid lg:grid-cols-3 gap-5">
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
