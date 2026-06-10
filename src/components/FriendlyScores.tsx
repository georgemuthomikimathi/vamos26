"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import MatchCard from "@/components/MatchCard";

export default function FriendlyScores() {
  const [matches, setMatches] = useState<Match[]>(FRIENDLY_MATCHES);

  useEffect(() => {
    const fetchFriendlies = async () => {
      try {
        const res = await fetch("/api/live?competition=friendly");
        const data = await res.json();
        setMatches(data.matches ?? []);
      } catch {
        /* silent */
      }
    };
    const boot = window.setTimeout(() => {
      void fetchFriendlies();
    }, 0);
    return () => window.clearTimeout(boot);
  }, []);

  return (
    <section id="friendlies" className="section-anchor relative py-16 bg-navy-light">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <Users size={24} className="text-gold" />
            <div>
              <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold">
                Pre-Tournament
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-white">
                FRIENDLY <span className="text-gradient-gold">SCORES</span>
              </h2>
            </div>
          </div>
          <p className="text-muted text-sm mt-2 max-w-xl">
            International friendlies before kickoff — all nil-nil until matches are played.
          </p>
        </motion.div>

        <div className="grid gap-2 sm:grid-cols-2">
          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <MatchCard match={match} showCompetition />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
