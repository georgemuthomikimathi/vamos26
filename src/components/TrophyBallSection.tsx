"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Globe } from "lucide-react";
import TournamentImage from "@/components/TournamentImage";

const BALL_FEATURES = [
  {
    icon: Globe,
    title: "Three Nations, One Ball",
    desc: "TRIONDA — Spanish for 'three waves' — unites Canada (red), USA (blue), and Mexico (green) in a historic four-panel design.",
  },
  {
    icon: Zap,
    title: "Connected Technology",
    desc: "500Hz motion sensor chip sends real-time data to VAR for faster, more accurate officiating decisions.",
  },
  {
    icon: Sparkles,
    title: "Champion's Gold",
    desc: "Gold embellishments pay homage to the FIFA World Cup Trophy — the ultimate prize every player dreams of lifting.",
  },
];

const TROPHY_FACTS = [
  "18-karat gold-plated sterling silver",
  "Designed by Silvio Gazzaniga in 1974",
  "Weighs 6.1 kg (13.5 lbs)",
  "Stands 36.8 cm tall",
  "Only 5 nations have ever lifted it",
];

export default function TrophyBallSection() {
  return (
    <section id="trophy" className="relative py-24 bg-navy-light overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-pitch/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Official Gear
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            TROPHY & <span className="text-gradient-gold">TRIONDA</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            The golden prize every nation fights for — and the official Adidas
            match ball that will grace pitches across three countries.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-card border border-gold/20 rounded-3xl p-8 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] group-hover:bg-gold/20 transition-colors" />
            <div className="relative flex flex-col items-center">
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6">
                Official FIFA World Cup Trophy
              </span>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="tournament-stage min-h-[380px] w-full"
              >
                <TournamentImage
                  type="trophy"
                  width={340}
                  height={490}
                />
              </motion.div>
              <h3 className="font-display text-4xl text-gradient-gold mt-8 text-center">
                THE ULTIMATE PRIZE
              </h3>
              <p className="text-muted text-center mt-4 max-w-sm leading-relaxed">
                Designed by Silvio Gazzaniga in 1974 — two athletes triumphantly
                lifting the Earth. 18-karat gold plated, with the signature
                malachite green band. The most coveted prize in world football.
              </p>
              <ul className="mt-6 space-y-2 w-full max-w-sm">
                {TROPHY_FACTS.map((fact) => (
                  <li
                    key={fact}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-card border border-pitch/20 rounded-3xl p-8 overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-pitch/10 rounded-full blur-[80px] group-hover:bg-pitch/20 transition-colors" />
            <div className="relative flex flex-col items-center">
              <span className="text-pitch uppercase tracking-[0.3em] text-xs font-semibold mb-6">
                Adidas Official Match Ball
              </span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="tournament-stage min-h-[300px] w-full"
              >
                <TournamentImage
                  type="trionda"
                  width={280}
                  height={280}
                />
              </motion.div>
              <h3 className="font-display text-4xl text-gradient-pitch mt-8 text-center">
                TRIONDA
              </h3>
              <p className="text-muted text-center mt-4 max-w-sm leading-relaxed">
                Over 3.5 years in development. Four-panel construction with
                maple leaf, eagle, and star iconography celebrating the three
                host nations coming together for the first time.
              </p>
              <div className="flex gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-canada-red border-2 border-white/20" title="Canada" />
                <div className="w-10 h-10 rounded-full bg-usa-blue border-2 border-white/20" title="USA" />
                <div className="w-10 h-10 rounded-full bg-mexico-green border-2 border-white/20" title="Mexico" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {BALL_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/60 border border-white/10 rounded-2xl p-6 hover:border-pitch/30 transition-colors"
            >
              <feature.icon className="text-pitch mb-4" size={28} />
              <h4 className="font-display text-xl text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
