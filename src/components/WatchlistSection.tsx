"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, ShoppingBag, ExternalLink, type LucideIcon } from "lucide-react";
import { DEFENDERS_TO_WATCH, PLAYMAKERS_TO_WATCH } from "@/lib/watchlist";
import type { WatchPlayer } from "@/lib/watchlist";
import TeamFlagWithFallback from "@/components/TeamFlag";
import PlayerPortrait from "@/components/PlayerPortrait";
import { playerSlugFromName } from "@/lib/playerImages";
import { AFFILIATE_REL, AFFILIATE_TARGET, GEAR_AFFILIATE } from "@/lib/affiliates";

function PlayerAvatar({ player }: { player: WatchPlayer }) {
  const imageSlug = playerSlugFromName(player.name);
  return <PlayerPortrait imageSlug={imageSlug} name={player.name} size={64} />;
}

function PlayerGrid({
  players,
  title,
  icon: Icon,
  subtitle,
}: {
  players: WatchPlayer[];
  title: string;
  icon: LucideIcon;
  subtitle: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Icon size={28} className="text-pitch" />
        <div>
          <h3 className="font-display text-3xl md:text-4xl text-white">{title}</h3>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group relative bg-card border border-white/10 rounded-2xl p-4 overflow-hidden hover:border-pitch/30 transition-all"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
            />
            <div className="relative flex items-start gap-3">
              <PlayerAvatar player={p} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl text-pitch/50">#{p.number}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted bg-white/5 px-2 py-0.5 rounded-full">
                    {p.position}
                  </span>
                </div>
                <h4 className="font-display text-xl text-white mt-0.5 truncate">{p.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <TeamFlagWithFallback code={p.code} name={p.country} size={16} />
                  <p className="text-xs text-muted truncate">
                    {p.country} · {p.club}
                  </p>
                </div>
              </div>
            </div>
            <p className="relative text-sm text-muted mt-3 leading-relaxed line-clamp-3">{p.tagline}</p>
            <div className="relative mt-2 inline-block bg-pitch/10 text-pitch text-xs font-semibold px-3 py-1 rounded-full">
              {p.stat}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function WatchlistSection() {
  return (
    <section id="watchlist" className="relative py-24 bg-navy-light">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Scouting Report
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white">
            PLAYERS <span className="text-gradient-pitch">TO WATCH</span>
          </h2>
        </motion.div>

        <PlayerGrid
          players={DEFENDERS_TO_WATCH}
          title="Defenders"
          icon={Shield}
          subtitle="The walls — center-backs and fullbacks dominating the tournament"
        />
        <PlayerGrid
          players={PLAYMAKERS_TO_WATCH}
          title="Playmakers"
          icon={Sparkles}
          subtitle="The architects — creators who unlock every defense"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-4"
        >
          <a
            href={GEAR_AFFILIATE.href}
            target={AFFILIATE_TARGET}
            rel={AFFILIATE_REL}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-pitch transition-colors font-medium min-h-[44px] tap-scale focus-ring rounded-lg px-3"
          >
            <ShoppingBag size={16} />
            Shop soccer gear
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
