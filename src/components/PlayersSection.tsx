"use client";

import { motion } from "framer-motion";
import { STAR_PLAYERS } from "@/lib/data";
import TeamFlagWithFallback from "@/components/TeamFlag";

export default function PlayersSection() {
  return (
    <section id="stars" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-usa-blue/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pitch/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Superstars
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            PLAYERS TO <span className="text-gradient-gold">WATCH</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            The icons, the rising stars, and the home heroes who will define
            World Cup 2026.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {STAR_PLAYERS.map((player, i) => (
            <motion.article
              key={player.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative bg-card border border-white/10 rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-300"
            >
              <div
                className={`h-36 bg-gradient-to-br ${player.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-end justify-between p-4">
                  <span className="font-display text-7xl text-white/20 leading-none">
                    {player.number}
                  </span>
                  <div className="border-2 border-white/30 rounded-lg overflow-hidden shadow-lg">
                    <TeamFlagWithFallback
                      code={player.code}
                      name={player.country}
                      size={80}
                    />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-semibold">
                  {player.position}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display text-2xl text-white leading-tight">
                  {player.name}
                </h3>
                <p className="text-pitch text-sm font-medium mt-1">
                  {player.country} · {player.club}
                </p>
                <p className="text-muted text-sm mt-3 leading-relaxed">
                  {player.tagline}
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
