"use client";

import { motion } from "framer-motion";
import { Target, Handshake, Shield, type LucideIcon } from "lucide-react";
import { TOP_SCORERS, TOP_ASSISTS, CLEAN_SHEETS } from "@/lib/stats";
import type { StatLeader } from "@/lib/stats";
import TeamFlagWithFallback from "@/components/TeamFlag";

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
          <div
            key={p.rank}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
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
              <div className="font-display text-2xl text-pitch">
                {p.value === 0 ? "—" : p.value}
              </div>
              <div className="text-[10px] text-muted uppercase">{unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatsLeaders() {
  return (
    <section id="stats" className="relative py-24 bg-navy">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Tournament Leaders
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            STATS <span className="text-gradient-gold">BOARD</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Golden Boot race, assist kings, and clean sheets — updates when the tournament begins.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <LeaderColumn
            title="Top Scorers"
            icon={Target}
            leaders={TOP_SCORERS}
            unit="goals"
            accent="bg-gradient-to-br from-gold to-orange-600"
          />
          <LeaderColumn
            title="Top Assists"
            icon={Handshake}
            leaders={TOP_ASSISTS}
            unit="assists"
            accent="bg-gradient-to-br from-pitch to-emerald-700"
          />
          <LeaderColumn
            title="Clean Sheets"
            icon={Shield}
            leaders={CLEAN_SHEETS}
            unit="CS"
            accent="bg-gradient-to-br from-usa-blue to-blue-900"
          />
        </div>
      </div>
    </section>
  );
}
