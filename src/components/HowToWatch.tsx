"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tv, ExternalLink, BookOpen } from "lucide-react";
import { AFFILIATE_REL, STREAMING_AFFILIATES } from "@/lib/affiliates";

export default function HowToWatch() {
  return (
    <section id="watch" className="section-anchor relative py-24 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-usa-blue/5 via-transparent to-canada-red/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Broadcast Guide
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            HOW TO <span className="text-gradient-pitch">WATCH</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto mb-6">
            Every match, every time zone. Fox holds English rights in the USA; Telemundo
            covers Spanish. Stream on the go or catch replays with these trusted services.
          </p>
          <Link
            href="/guides/how-to-watch"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pitch hover:text-white border border-pitch/30 rounded-full px-5 py-2.5 tap-scale focus-ring transition-colors"
          >
            <BookOpen size={16} />
            Read full USA broadcast guide
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STREAMING_AFFILIATES.map((link, i) => (
            <motion.a
              key={link.partner}
              href={link.href}
              target="_blank"
              rel={AFFILIATE_REL}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-card border border-white/10 rounded-2xl p-6 hover:border-pitch/40 hover:bg-pitch/5 transition-all tap-scale focus-ring"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-pitch/10 flex items-center justify-center group-hover:bg-pitch/20 transition-colors">
                  <Tv size={20} className="text-pitch" />
                </div>
                <ExternalLink
                  size={16}
                  className="text-muted group-hover:text-pitch transition-colors shrink-0 mt-1"
                />
              </div>
              <h3 className="font-display text-2xl text-white mb-2">{link.label}</h3>
              <p className="text-sm text-muted leading-relaxed">{link.description}</p>
              <span className="inline-block mt-4 text-xs text-pitch font-semibold">
                Start streaming →
              </span>
            </motion.a>
          ))}
        </div>

        <p className="text-center text-[10px] text-muted/60 mt-8 max-w-lg mx-auto">
          Affiliate links — we may earn a commission if you subscribe through these
          partners. Availability varies by region and match.
        </p>
      </div>
    </section>
  );
}
