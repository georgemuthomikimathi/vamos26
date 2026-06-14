"use client";

import { motion } from "framer-motion";
import { GROUPS } from "@/lib/data";
import TeamFlagWithFallback from "@/components/TeamFlag";
import EditorialPreview from "@/components/EditorialPreview";
import GroupStandingsMini from "@/components/GroupStandingsMini";

export default function GroupsSection() {
  return (
    <section id="groups" className="section-anchor relative py-24 bg-navy-light">
      <div className="absolute inset-0 pitch-lines opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            The Draw
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            GROUP <span className="text-gradient-pitch">STAGE</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            12 groups of 4. Top two plus eight best third-place teams advance to
            the Round of 32. Every flag, every rivalry, every dream.
          </p>
        </motion.div>

        <EditorialPreview />

        <GroupStandingsMini />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.letter}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.05 }}
              className="group bg-card border border-white/10 rounded-3xl overflow-hidden hover:border-pitch/40 hover:shadow-lg hover:shadow-pitch/5 transition-all duration-300"
            >
              <div className="relative h-16 bg-gradient-to-r from-pitch/20 via-usa-blue/20 to-gold/20 flex items-center justify-between px-5">
                <span className="font-display text-5xl text-white/90">
                  {group.letter}
                </span>
                <div className="flex -space-x-2">
                  {group.teams.slice(0, 4).map((team) => (
                    <div key={team.code} className="border-2 border-card rounded overflow-hidden">
                      <TeamFlagWithFallback
                        code={team.code}
                        name={team.name}
                        size={40}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-2">
                {group.teams.map((team, ti) => (
                  <div
                    key={team.code}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                      ti === 0
                        ? "bg-pitch/10 border border-pitch/20"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span className="font-display text-lg text-muted w-5">
                      {ti + 1}
                    </span>
                    <TeamFlagWithFallback
                      code={team.code}
                      name={team.name}
                      size={40}
                    />
                    <span className="text-sm font-medium flex-1 truncate">
                      {team.name}
                    </span>
                    {ti === 0 && (
                      <span className="text-[9px] uppercase tracking-wider text-pitch bg-pitch/10 px-2 py-0.5 rounded-full">
                        Seed
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {group.highlight && (
                <div className="px-4 pb-4">
                  <p className="text-[11px] text-gold/80 bg-gold/5 border border-gold/20 rounded-lg px-3 py-2">
                    ⚡ {group.highlight}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
