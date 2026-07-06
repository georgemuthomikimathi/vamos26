"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Star,
  HandHelping,
  Shield,
  Square,
  Repeat,
  Trophy,
  Calendar,
} from "lucide-react";
import type { StatLeader } from "@/lib/stats";
import type { MatchMvp } from "@/lib/scores/match-mvp";
import type { MatchStatHighlight, TournamentStatsSummary } from "@/lib/stats/compile-tournament-stats";
import { STATS_LEADER_LIMIT } from "@/lib/stats/compile-tournament-stats";
import { onDataRefresh } from "@/lib/realtime/cascade";
import { POLL_STATS_MS } from "@/lib/realtime/polling";
import TeamFlagWithFallback from "@/components/TeamFlag";
import PlayerPortrait from "@/components/PlayerPortrait";
import { playerSlugFromName } from "@/lib/playerImages";
import DataProviderBadge from "@/components/DataProviderBadge";

type StatsTab =
  | "scorers"
  | "assists"
  | "cleanSheets"
  | "yellowCards"
  | "redCards"
  | "penalties"
  | "substitutions"
  | "byMatch";

type StatsPayload = {
  updatedAt: string;
  matchesPlayed: number;
  scorers: StatLeader[];
  assists: StatLeader[];
  cleanSheets: StatLeader[];
  yellowCards: StatLeader[];
  redCards: StatLeader[];
  penalties: StatLeader[];
  substitutions: StatLeader[];
  matchHighlights: MatchStatHighlight[];
  manOfTheMatch?: MatchMvp | null;
  summary?: TournamentStatsSummary;
  provider?: "worldcup26" | "api-football" | "hybrid" | "static";
};

const TABS: { id: StatsTab; label: string; icon: typeof Target; valueLabel: string }[] = [
  { id: "scorers", label: "Scorers", icon: Target, valueLabel: "goals" },
  { id: "assists", label: "Assists", icon: HandHelping, valueLabel: "assists" },
  { id: "cleanSheets", label: "Clean sheets", icon: Shield, valueLabel: "sheets" },
  { id: "yellowCards", label: "Yellows", icon: Square, valueLabel: "🟨" },
  { id: "redCards", label: "Reds", icon: Square, valueLabel: "🟥" },
  { id: "penalties", label: "Penalties", icon: Target, valueLabel: "pens" },
  { id: "substitutions", label: "Subs", icon: Repeat, valueLabel: "subs" },
  { id: "byMatch", label: "By match", icon: Calendar, valueLabel: "" },
];

function LeaderRow({
  player,
  valueLabel,
}: {
  player: StatLeader;
  valueLabel: string;
}) {
  const imageSlug = player.imageSlug ?? playerSlugFromName(player.name);

  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.99] transition-all cursor-default min-h-[52px]">
      <span
        className={`font-display text-xl w-7 text-center shrink-0 ${
          player.rank === 1 ? "text-gold" : "text-muted"
        }`}
      >
        {player.rank}
      </span>
      <PlayerPortrait imageSlug={imageSlug} name={player.name} size={52} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-sm truncate">{player.name}</span>
          <TeamFlagWithFallback code={player.code} name={player.country} size={16} />
        </div>
        <div className="text-[10px] text-muted truncate">
          {player.country} · {player.club}
          {player.detail ? ` · ${player.detail}` : ""}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-display text-xl text-pitch">{player.value}</div>
        {valueLabel && (
          <div className="text-[9px] text-muted uppercase">{valueLabel}</div>
        )}
      </div>
    </div>
  );
}

function SummaryChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center min-w-[4.5rem]">
      <div className="font-display text-2xl text-white tabular-nums">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function MatchHighlightRow({ match }: { match: MatchStatHighlight }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-[0.99] transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{match.label}</p>
          <p className="text-[10px] text-muted truncate">
            {match.stage} · {match.date}
          </p>
        </div>
        <span className="text-[10px] text-muted shrink-0 tabular-nums">
          🟨{match.cards.yellow} 🟥{match.cards.red}
        </span>
      </div>
      {match.scorers.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {match.scorers.map((s) => (
            <span
              key={`${s.name}-${s.teamCode}`}
              className="inline-flex items-center gap-1 text-[10px] bg-pitch/10 border border-pitch/20 rounded-full px-2 py-0.5 text-pitch"
            >
              <TeamFlagWithFallback code={s.teamCode} name={s.teamName} size={16} />
              {s.name}
              {s.goals > 1 && <span className="font-bold">×{s.goals}</span>}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-muted">0–0 · no goals</p>
      )}
    </div>
  );
}

export default function StatsLeaders() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [tab, setTab] = useState<StatsTab>("scorers");

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

  const activeTab = TABS.find((t) => t.id === tab)!;
  const summary = stats?.summary;

  const leadersForTab = (): StatLeader[] => {
    if (!stats) return [];
    switch (tab) {
      case "scorers":
        return stats.scorers ?? [];
      case "assists":
        return stats.assists ?? [];
      case "cleanSheets":
        return stats.cleanSheets ?? [];
      case "yellowCards":
        return stats.yellowCards ?? [];
      case "redCards":
        return stats.redCards ?? [];
      case "penalties":
        return stats.penalties ?? [];
      case "substitutions":
        return stats.substitutions ?? [];
      default:
        return [];
    }
  };

  const leaders = leadersForTab().slice(0, STATS_LEADER_LIMIT);
  const motm = stats?.manOfTheMatch;
  const hasLeaderData = tab === "byMatch"
    ? (stats?.matchHighlights?.length ?? 0) > 0
    : leaders.some((p) => p.value > 0);

  return (
    <section id="stats" className="section-anchor relative py-24 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center gap-2 flex-wrap">
            Tournament stats
            {stats?.provider && <DataProviderBadge provider={stats.provider} />}
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-3">
            LEADER<span className="text-gradient-pitch">BOARDS</span>
          </h2>
          <p className="text-muted text-sm max-w-2xl">
            Tallied after each full-time result — top {STATS_LEADER_LIMIT} in every category.
            Player photos shown where available.
          </p>
        </motion.div>

        {summary && (
          <div className="flex flex-wrap gap-2 mb-6">
            <SummaryChip label="Matches" value={summary.finishedMatches} />
            <SummaryChip label="Goals" value={summary.totalGoals} />
            <SummaryChip label="Assists" value={summary.totalAssists} />
            <SummaryChip label="Yellows" value={summary.totalYellow} />
            <SummaryChip label="Reds" value={summary.totalRed} />
            <SummaryChip label="Clean sheets" value={summary.totalCleanSheets} />
            <SummaryChip label="Subs" value={summary.totalSubstitutions} />
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-1 px-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border transition-all tap-scale focus-ring min-h-[44px] ${
                tab === id
                  ? "bg-pitch/15 border-pitch/40 text-pitch"
                  : "border-white/10 text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-white/10 rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-orange-600 flex items-center justify-center">
                <Trophy size={18} className="text-white" />
              </div>
              <h3 className="font-display text-2xl text-white">{activeTab.label}</h3>
            </div>

            {tab === "byMatch" ? (
              stats?.matchHighlights?.length ? (
                <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
                  {stats.matchHighlights.map((m) => (
                    <MatchHighlightRow key={m.matchId} match={m} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted text-center py-8">
                  Per-match tallies appear as results come in.
                </p>
              )
            ) : hasLeaderData ? (
              <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
                {leaders.map((p) => (
                  <LeaderRow
                    key={`${tab}-${p.rank}-${p.name}`}
                    player={p}
                    valueLabel={activeTab.valueLabel}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-8">
                {activeTab.label} update after each match finishes.
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
                <PlayerPortrait
                  imageSlug={playerSlugFromName(motm.name)}
                  name={motm.name}
                  size={96}
                />
                <TeamFlagWithFallback code={motm.teamCode} name={motm.teamName} size={32} />
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
