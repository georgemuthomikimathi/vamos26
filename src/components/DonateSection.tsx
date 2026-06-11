"use client";

import { motion } from "framer-motion";
import { HeartHandshake, ExternalLink, Server, Radio, MapPin } from "lucide-react";
import { DONATE_PRIMARY_URL, DONATE_TIERS, PAYPAL_EMAIL } from "@/lib/donate";

const PERKS = [
  { icon: Radio, text: "Live World Cup scores" },
  { icon: Server, text: "Hosting & API costs" },
  { icon: MapPin, text: "NYC bars & viewing party guide" },
];

export default function DonateSection() {
  return (
    <section id="donate" className="section-anchor relative py-24 bg-navy-light overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-usa-blue/5 via-transparent to-pitch/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center justify-center gap-2">
            <HeartHandshake size={14} />
            Fan-Powered
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            SUPPORT <span className="text-gradient-pitch">VAMOS26</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            VAMOS26 is free for every fan. Your donation helps cover hosting, live
            score data, and keeping the NYC guide up to date through the tournament.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {PERKS.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 bg-card border border-white/10 rounded-full px-4 py-2 text-sm text-muted"
            >
              <Icon size={16} className="text-pitch shrink-0" />
              {text}
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {DONATE_TIERS.map((tier, i) => (
            <motion.a
              key={tier.id}
              href={tier.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card border border-white/10 rounded-2xl p-6 text-center hover:border-pitch/40 hover:bg-pitch/5 transition-all"
            >
              <div className="font-display text-4xl text-gold mb-1">{tier.amount}</div>
              <div className="font-display text-xl text-white mb-2">{tier.label}</div>
              <p className="text-xs text-muted leading-relaxed">{tier.description}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-pitch text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Donate <ExternalLink size={12} />
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href={DONATE_PRIMARY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pitch to-emerald-600 text-navy font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform glow-pitch"
          >
            <HeartHandshake size={20} />
            Donate Any Amount
          </a>
          <p className="text-xs text-muted mt-4">
            Secure donations via PayPal ({PAYPAL_EMAIL}). Every contribution
            keeps VAMOS26 running for fans worldwide. ¡Gracias!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
