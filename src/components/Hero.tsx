"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Radio, HeartHandshake } from "lucide-react";
import { HOST_NATIONS, TOURNAMENT_STATS, KEY_DATES } from "@/lib/data";
import CountdownTimer from "@/components/CountdownTimer";
import TeamFlagWithFallback from "@/components/TeamFlag";
import TournamentImage from "@/components/TournamentImage";
import { scrollToSection } from "@/lib/scroll";

type HeroProps = {
  onNavigate?: (id: string) => void;
};

const HERO_ACTIONS = [
  { id: "live", label: "Live Scores", icon: Radio },
  { id: "discover", label: "NYC Guide", icon: MapPin },
  { id: "donate", label: "Support Us", icon: HeartHandshake },
] as const;

export default function Hero({ onNavigate }: HeroProps) {
  const go = (id: string) => {
    onNavigate?.(id);
    scrollToSection(id);
  };
  return (
    <section
      id="home"
      className="section-anchor relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden pitch-lines"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy-light" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-pitch/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-usa-blue/15 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="host-stripe h-1.5 w-32 rounded-full mb-6" />
            <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-4">
              USA · MEXICO · CANADA
            </p>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.9] mb-6">
              <span className="text-white">WORLD</span>
              <br />
              <span className="text-gradient-pitch">CUP</span>
              <br />
              <span className="text-gradient-gold">2026</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-lg mb-8 leading-relaxed">
              48 nations. 12 groups. One trophy. One ball. Follow every
              team&apos;s journey from the group stage to glory at MetLife
              Stadium.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Calendar size={16} className="text-pitch" />
                <span className="text-sm">Jun 11 – Jul 19, 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <MapPin size={16} className="text-gold" />
                <span className="text-sm">16 Host Cities</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <Users size={16} className="text-usa-blue" />
                <span className="text-sm">48 Teams</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {HERO_ACTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => go(id)}
                  className="inline-flex items-center gap-2 bg-pitch/10 hover:bg-pitch/20 border border-pitch/30 text-pitch font-semibold px-5 py-3 rounded-full tap-scale focus-ring min-h-[48px] transition-colors"
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-8 max-w-md">
              <CountdownTimer />
            </div>

            <div className="flex lg:hidden flex-col items-center gap-2 mb-8 py-2">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="tournament-stage"
              >
                <TournamentImage
                  type="trophy"
                  width={200}
                  height={300}
                  priority
                />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="tournament-stage -mt-6"
              >
                <TournamentImage
                  type="trionda"
                  width={160}
                  height={160}
                  priority
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-md">
              {TOURNAMENT_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card/80 border border-white/10 rounded-2xl p-3 text-center hover:border-pitch/30 transition-colors"
                >
                  <div className="font-display text-3xl text-pitch">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:flex flex-col items-center justify-center min-h-[620px] py-4"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="tournament-stage z-10"
            >
              <TournamentImage
                type="trophy"
                width={360}
                height={500}
                priority
              />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="tournament-stage -mt-8 z-20"
            >
              <TournamentImage
                type="trionda"
                width={200}
                height={200}
                priority
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mt-12 flex-wrap"
        >
          {HOST_NATIONS.map((host) => (
            <div
              key={host.code}
              className="flex items-center gap-3 bg-card/60 border border-white/10 rounded-2xl px-5 py-3 hover:border-pitch/40 transition-all"
            >
              <TeamFlagWithFallback code={host.code} name={host.name} size={80} />
              <div>
                <span className="text-sm font-semibold block">{host.name}</span>
                <span className="text-[10px] text-muted">{host.city}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {KEY_DATES.map((item, i) => (
            <div
              key={item.date}
              className={`bg-card/50 border border-white/10 rounded-2xl p-4 hover:border-pitch/30 transition-all ${
                i === KEY_DATES.length - 1
                  ? "sm:col-span-2 lg:col-span-1 border-gold/30 bg-gold/5"
                  : ""
              }`}
            >
              <div
                className={`font-display text-2xl ${i === KEY_DATES.length - 1 ? "text-gold" : "text-pitch"}`}
              >
                {item.date}
              </div>
              <div className="font-semibold text-sm mt-1">{item.event}</div>
              <div className="text-xs text-muted mt-1">{item.detail}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
