"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

const GROUP_STORYLINES = [
  {
    letter: "A",
    title: "Mexico open with a win",
    body: "El Tri kicked off the entire tournament at Estadio Azteca on June 11. South Africa and Korea Republic still loom — every point matters in a tight Group A.",
  },
  {
    letter: "D",
    title: "USA's group stage begins",
    body: "The hosts face Paraguay, Australia, and Türkiye in Group D. Pochettino's side need a strong start before the road turns toward MetLife and beyond.",
  },
  {
    letter: "J",
    title: "Argentina defend the crown",
    body: "La Albiceleste navigate Algeria, Austria, and Jordan as Scaloni manages Messi's minutes. Squad depth will be tested from the first whistle.",
  },
  {
    letter: "K",
    title: "DR Congo's long-awaited return",
    body: "Les Léopards are back on football's biggest stage. Portugal, Colombia, and Uzbekistan make Group K a blend of European structure and African flair.",
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
              Group Stage Live
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-white">
              STORYLINES TO WATCH
            </h3>
          </div>
        </motion.div>

        <p className="text-sm text-muted mb-6">
          Deep dive on USA&apos;s group:{" "}
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
