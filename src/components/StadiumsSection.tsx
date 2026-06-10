"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Trophy, Building2, ChevronRight, ExternalLink, Hotel } from "lucide-react";
import { ALL_STADIUMS, US_STADIUMS } from "@/lib/stadiums";
import type { Stadium } from "@/lib/stadiums";
import { formatCapacity, formatStadiumLocation, getTeeForStadium } from "@/lib/stadium-tees";
import StadiumDetailPanel from "@/components/StadiumDetailPanel";
import { AFFILIATE_REL, AFFILIATE_TARGET, HOST_CITY_TRAVEL_AFFILIATES } from "@/lib/affiliates";

function StadiumCard({
  stadium,
  selected,
  onSelect,
  compact = false,
}: {
  stadium: Stadium;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  const tee = getTeeForStadium(stadium);
  const isFinal = stadium.id === "metlife";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: compact ? 12 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group w-full text-left bg-card border rounded-2xl transition-all focus-ring ${
        selected
          ? "border-pitch/50 ring-1 ring-pitch/30 shadow-lg shadow-pitch/10"
          : isFinal
            ? "border-gold/30 bg-gold/5 hover:border-gold/50"
            : "border-white/10 hover:border-pitch/30"
      } ${compact ? "p-5" : "p-6"}`}
      aria-expanded={selected}
    >
      {isFinal && (
        <span className="inline-flex items-center gap-1 text-gold text-[10px] uppercase tracking-wider font-bold mb-3">
          <Trophy size={12} /> Final Venue
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-display text-white group-hover:text-pitch transition-colors ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          {stadium.name}
        </h3>
        <ChevronRight
          size={18}
          className={`shrink-0 text-muted transition-transform ${
            selected ? "rotate-90 text-pitch" : "group-hover:translate-x-0.5"
          }`}
        />
      </div>
      <p className="text-pitch text-sm font-semibold mt-1">{stadium.nickname}</p>
      <div className="flex items-center gap-1.5 text-muted text-sm mt-2">
        <MapPin size={14} className="text-usa-blue shrink-0" />
        <span className="truncate">{formatStadiumLocation(stadium)}</span>
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <Users size={16} className="text-pitch mx-auto mb-1" />
            <div className="font-display text-xl text-white">
              {formatCapacity(stadium.capacity)}
            </div>
            <div className="text-[10px] text-muted uppercase">Capacity</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <Building2 size={16} className="text-usa-blue mx-auto mb-1" />
            <div className="font-display text-xl text-white">{stadium.matches}</div>
            <div className="text-[10px] text-muted uppercase">Matches</div>
          </div>
        </div>
      )}

      {compact && (
        <p className="text-xs text-muted mt-2">
          {formatCapacity(stadium.capacity)} capacity · {stadium.matches} matches
        </p>
      )}

      {tee && (
        <p className="text-[10px] text-gold/90 mt-3 truncate">
          Fan tee: {tee.phrase}
        </p>
      )}

      <p className="text-[10px] text-muted/70 mt-2">
        Tap for capacity, location & fan gallery
      </p>
    </motion.button>
  );
}

export default function StadiumsSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ALL_STADIUMS.find((s) => s.id === selectedId);

  const toggle = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="stadiums" className="relative py-24 bg-navy-light overflow-hidden section-anchor">
      <div className="absolute inset-0 bg-gradient-to-br from-usa-blue/5 via-transparent to-pitch/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-usa-blue uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            16 Host Venues
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            STADIUM <span className="text-gradient-pitch">GUIDE</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Tap any venue for full capacity, location, city fan tee, and a diverse fan
            gallery wearing the official design.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {selected && (
            <div className="mb-8">
              <StadiumDetailPanel
                key={selected.id}
                stadium={selected}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}
        </AnimatePresence>

        <p className="text-pitch uppercase tracking-[0.3em] text-xs font-semibold mb-6">
          United States — {US_STADIUMS.length} venues
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {US_STADIUMS.map((s) => (
            <StadiumCard
              key={s.id}
              stadium={s}
              selected={selectedId === s.id}
              onSelect={() => toggle(s.id)}
            />
          ))}
        </div>

        <p className="text-muted uppercase tracking-[0.3em] text-xs font-semibold mb-6">
          Canada & Mexico
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_STADIUMS.filter((s) => s.hostNation !== "USA").map((s) => (
            <StadiumCard
              key={s.id}
              stadium={s}
              selected={selectedId === s.id}
              onSelect={() => toggle(s.id)}
              compact
            />
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {HOST_CITY_TRAVEL_AFFILIATES.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={AFFILIATE_TARGET}
              rel={AFFILIATE_REL}
              className="group flex items-start gap-3 bg-card border border-white/10 rounded-2xl p-4 hover:border-usa-blue/40 transition-all tap-scale focus-ring"
            >
              <div className="w-10 h-10 rounded-xl bg-usa-blue/10 flex items-center justify-center shrink-0">
                <Hotel size={18} className="text-usa-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg text-white group-hover:text-pitch transition-colors">
                    {link.label}
                  </span>
                  <ExternalLink size={14} className="text-muted shrink-0" />
                </div>
                <p className="text-xs text-muted mt-1">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
