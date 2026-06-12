"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

const GROUP_STORYLINES = [
  {
    letter: "A",
    title: "Korea Republic stun Mexico",
    body: "Group A flipped on its head — Korea Republic beat Mexico 2-1 in Guadalajara. South Africa and Czechia still to play as the group tightens after the opening day.",
  },
  {
    letter: "B",
    title: "Canada held in Toronto opener",
    body: "Co-hosts Canada drew 1-1 with Qatar at BMO Field. Alphonso Davies scored but Marsch's side couldn't find a winner — Switzerland and Bosnia & Herzegovina await.",
  },
  {
    letter: "D",
    title: "USA host Paraguay tonight",
    body: "The big one tonight: USA vs Paraguay at SoFi Stadium, 9PM ET. Pochettino's hosts need a statement win in Group D before Australia and Türkiye arrive.",
  },
  {
    letter: "C",
    title: "Brazil vs Morocco at MetLife",
    body: "Seleção face the Atlas Lions in East Rutherford — a sell-out and the first World Cup match in the NY/NJ corridor. Regragui's compact block meets Vinícius Jr's pace.",
  },
];

export default function EditorialPreview() {
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
              June 12 · Match Day 2
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-white">
              STORYLINES TO WATCH
            </h3>
          </div>
        </motion.div>

        <p className="text-sm text-muted mb-6">
          USA opener preview:{" "}
          <Link href="/guides/group-d-usa-preview" className="text-pitch hover:underline font-medium">
            Group D guide →
          </Link>
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GROUP_STORYLINES.map((item, i) => (
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
    </div>
  );
}
