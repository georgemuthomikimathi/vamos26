"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

const GROUP_PREVIEWS = [
  {
    letter: "A",
    title: "Mexico opens at home",
    body: "El Tri kick off the entire tournament at Estadio Azteca on June 11. South Africa and Korea Republic bring pace on the counter; Czechia could surprise as a compact defensive side.",
  },
  {
    letter: "D",
    title: "USA's MetLife corridor",
    body: "The hosts share a group with Paraguay, Australia, and Türkiye — all capable of stealing points on the road. Expect loud crowds whenever the Stars and Stripes play within reach of New York.",
  },
  {
    letter: "J",
    title: "Argentina's title defense",
    body: "La Albiceleste face Algeria, Austria, and Jordan in a group that looks manageable on paper but rarely is at a World Cup. Messi's successors will need every ounce of squad depth.",
  },
  {
    letter: "K",
    title: "DR Congo's long return",
    body: "Les Léopards are back on football's biggest stage after more than five decades. Portugal, Colombia, and Uzbekistan make Group K a blend of European structure and African flair.",
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
              Tournament Preview
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-white">
              GROUP STAGE STORYLINES
            </h3>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GROUP_PREVIEWS.map((item, i) => (
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
