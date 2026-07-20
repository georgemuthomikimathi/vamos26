"use client";

import { Trophy } from "lucide-react";
import TeamFlagWithFallback from "@/components/TeamFlag";
import { CHAMPIONS, SITE_UPDATE_NOTICE } from "@/lib/champions";

export default function ChampionsBanner() {
  return (
    <div className="relative overflow-hidden border-b border-gold/30 bg-gradient-to-r from-navy via-navy-light to-navy">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-3 shrink-0">
            <Trophy className="text-gold shrink-0" size={28} aria-hidden />
            <TeamFlagWithFallback
              code={CHAMPIONS.code}
              name={CHAMPIONS.name}
              size={40}
            />
            <div>
              <p className="font-display text-2xl md:text-3xl text-gold tracking-wide leading-none">
                ¡ESPAÑA CAMPEONA!
              </p>
              <p className="text-xs text-white/80 mt-1">
                {CHAMPIONS.name} {CHAMPIONS.score} {CHAMPIONS.opponent} ·{" "}
                {CHAMPIONS.detail}
              </p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted leading-relaxed sm:border-l sm:border-gold/20 sm:pl-5">
            {SITE_UPDATE_NOTICE}
          </p>
        </div>
      </div>
    </div>
  );
}
