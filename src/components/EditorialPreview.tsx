"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { useTournamentContext } from "@/hooks/useTournamentContext";

export default function EditorialPreview() {
  const ctx = useTournamentContext();
  const dayLabel = ctx.tournamentComplete
    ? "Champions · Spain 2026"
    : ctx.tournamentDay > 0
      ? ctx.groupStorylines.some((s) => s.letter === "R16" || s.letter === "R32")
        ? `Knockout Stage · Day ${ctx.tournamentDay}`
        : `Match Day ${ctx.tournamentDay}`
      : "Group Stage";

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-8"
      >
        <Newspaper size={22} className="text-gold" />
        <div>
          <p className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">
            {dayLabel} · Updated from live results
          </p>
          <h3 className="font-display text-3xl md:text-4xl text-white">
            STORYLINES TO WATCH
          </h3>
        </div>
      </motion.div>

      <p className="text-sm text-muted mb-6">
        USA Group D guide:{" "}
        <Link href="/guides/group-d-usa-preview" className="text-pitch hover:underline font-medium">
          read the preview →
        </Link>
      </p>

      {ctx.groupStorylines.length === 0 ? (
        <p className="text-sm text-muted rounded-2xl border border-white/10 bg-card/50 px-5 py-8 text-center">
          Group storylines appear as matches kick off and final whistles blow each day.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ctx.groupStorylines.map((item, i) => (
            <motion.article
              key={item.letter}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-card/80 border border-white/10 rounded-2xl p-5 hover:border-gold/30 transition-colors"
            >
              <span className="font-display text-4xl text-pitch/40">{item.letter}</span>
              <h4 className="font-display text-xl text-white mt-2 mb-2">{item.title}</h4>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
