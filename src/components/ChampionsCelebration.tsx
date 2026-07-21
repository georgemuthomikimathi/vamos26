"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import TeamFlagWithFallback from "@/components/TeamFlag";
import { CHAMPIONS, SITE_UPDATE_NOTICE } from "@/lib/champions";

export default function ChampionsCelebration() {
  return (
    <section
      id="champions"
      className="section-anchor relative min-h-[88vh] md:min-h-screen flex items-end overflow-hidden"
    >
      <Image
        src="/images/spain-champions-rodri-trophy.png"
        alt="Rodri lifts the FIFA World Cup trophy as fireworks explode over MetLife Stadium"
        fill
        priority
        quality={95}
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-navy/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-transparent" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 pt-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="host-stripe h-1 w-24 rounded-full mb-6" />

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border bg-gold/15 border-gold/40">
            <Trophy className="text-gold shrink-0" size={16} aria-hidden />
            <span className="uppercase tracking-[0.25em] text-[10px] font-bold text-gold">
              World Champions 2026
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <TeamFlagWithFallback
              code={CHAMPIONS.code}
              name={CHAMPIONS.name}
              size={40}
            />
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gradient-gold leading-[0.95]">
              ¡ESPAÑA CAMPEONA!
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <p className="font-display text-3xl md:text-4xl text-white tracking-wide">
              {CHAMPIONS.name}{" "}
              <span className="text-gold">{CHAMPIONS.score}</span>{" "}
              {CHAMPIONS.opponent}
            </p>
            <span className="text-sm md:text-base text-white/90 bg-white/10 border border-white/15 rounded-full px-4 py-1.5">
              AET · Ferran Torres 106&apos;
            </span>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-xl mb-4 leading-relaxed">
            Congratulations to La Roja — FIFA World Cup 2026 champions at{" "}
            {CHAMPIONS.venue}.
          </p>

          <p className="text-sm md:text-base text-muted max-w-xl leading-relaxed border-l-2 border-gold/30 pl-4">
            {SITE_UPDATE_NOTICE}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
