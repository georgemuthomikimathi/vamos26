"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Handshake, Shield, type LucideIcon } from "lucide-react";
import { TOP_SCORERS, TOP_ASSISTS, CLEAN_SHEETS } from "@/lib/stats";
import type { StatLeader } from "@/lib/stats";
import TeamFlagWithFallback from "@/components/TeamFlag";
import PlayerPortrait from "@/components/PlayerPortrait";

const STAT_TABS = [
  { id: "scorers", label: "Goals", icon: Target, leaders: TOP_SCORERS, unit: "goals", accent: "bg-gradient-to-br from-gold to-orange-600", title: "Top Scorers" },
  { id: "assists", label: "Assists", icon: Handshake, leaders: TOP_ASSISTS, unit: "assists", accent: "bg-gradient-to-br from-pitch to-emerald-700", title: "Top Assists" },
  { id: "clean", label: "Clean Sheets", icon: Shield, leaders: CLEAN_SHEETS, unit: "CS", accent: "bg-gradient-to-br from-usa-blue to-blue-900", title: "Clean Sheets" },
] as const;

type TabId = (typeof STAT_TABS)[number]["id"];

function LeaderRow({ p, unit }: { p: StatLeader; unit: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <span
        className={`font-display text-2xl w-8 text-center shrink-0 ${
          p.rank === 1 ? "text-gold" : "text-muted"
        }`}
      >
        {p.rank}
      </span>
      <PlayerPortrait imageSlug={p.imageSlug} name={p.name} size={48} />
      <TeamFlagWithFallback code={p.code} name={p.country} size={32} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{p.name}</div>
        <div className="text-[10px] text-muted truncate">
          {p.country} · {p.club}
          {p.detail ? ` · ${p.detail}` : ""}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-display text-2xl text-pitch">
          {p.value === 0 ? "—" : p.value}
        </div>
        <div className="text-[10px] text-muted uppercase">{unit}</div>
      </div>
    </div>
  );
}

function LeaderColumn({
  title,
  icon: Icon,
  leaders,
  unit,
  accent,
}: {
  title: string;
  icon: LucideIcon;
  leaders: StatLeader[];
  unit: string;
  accent: string;
}) {
  return (
    <div className="bg-card border border-white/10 rounded-3xl p-6 hover:border-pitch/20 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        <h3 className="font-display text-2xl text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {leaders.map((p) => (
          <LeaderRow key={`${title}-${p.rank}`} p={p} unit={unit} />
        ))}
      </div>
    </div>
  );
}

export default function StatsLeaders() {
  const [activeTab, setActiveTab] = useState<TabId>("scorers");
  const [leaders, setLeaders] = useState({
    scorers: TOP_SCORERS,
    assists: TOP_ASSISTS,
    cleanSheets: CLEAN_SHEETS,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.scorers) setLeaders(data);
      } catch {
        /* seed data fallback */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  const tabs = STAT_TABS.map((t) => ({
    ...t,
    leaders:
      t.id === "scorers"
        ? leaders.scorers
        : t.id === "assists"
          ? leaders.assists
          : leaders.cleanSheets,
  }));

  const current = tabs.find((t) => t.id === activeTab)!;

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
            Golden Boot, assists, and clean sheets — auto-refreshes every 60s during
            the tournament.
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
