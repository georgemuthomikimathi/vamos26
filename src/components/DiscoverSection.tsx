"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Beer,
  MapPin,
  Tv,
  PartyPopper,
  ExternalLink,
  Filter,
  UtensilsCrossed,
  Search,
  Hotel,
  Train,
} from "lucide-react";
import { NYC_VENUES, type Venue } from "@/lib/data";
import {
  AFFILIATE_REL,
  AFFILIATE_TARGET,
  NYC_TRAVEL_AFFILIATES,
} from "@/lib/affiliates";

const FILTERS = ["All", "Bar", "Restaurant", "Fan Zone", "Viewing Party"] as const;
type FilterType = (typeof FILTERS)[number];

const TYPE_ICONS = {
  Bar: Beer,
  Restaurant: UtensilsCrossed,
  "Fan Zone": Tv,
  "Viewing Party": PartyPopper,
};

const BOROUGH_COLORS: Record<string, string> = {
  Manhattan: "from-usa-blue/30 to-usa-blue/10 border-usa-blue/30",
  Brooklyn: "from-mexico-green/30 to-mexico-green/10 border-mexico-green/30",
  Queens: "from-gold/30 to-gold/10 border-gold/30",
  Bronx: "from-canada-red/30 to-canada-red/10 border-canada-red/30",
  "Staten Island": "from-pitch/30 to-pitch/10 border-pitch/30",
  "NY/NJ": "from-usa-blue/30 to-canada-red/10 border-usa-blue/30",
};

function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const Icon = TYPE_ICONS[venue.type];
  const colorClass =
    BOROUGH_COLORS[venue.borough] ?? "from-white/20 to-white/5 border-white/20";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gradient-to-br ${colorClass} border rounded-3xl p-6 hover:scale-[1.02] transition-transform duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-navy/60 flex items-center justify-center">
            <Icon size={20} className="text-pitch" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-pitch font-semibold">
              {venue.type}
            </span>
            <h3 className="font-display text-xl text-white leading-tight">
              {venue.name}
            </h3>
          </div>
        </div>
        {venue.highlight && (
          <span className="text-[10px] bg-gold/20 text-gold border border-gold/30 rounded-full px-2.5 py-1 whitespace-nowrap">
            {venue.highlight}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-sm text-muted mb-3">
        <MapPin size={14} className="text-pitch shrink-0" />
        <span>
          {venue.neighborhood}, {venue.borough}
        </span>
      </div>

      <p className="text-sm font-medium text-white/80 mb-2">{venue.vibe}</p>
      <p className="text-sm text-muted leading-relaxed mb-5">
        {venue.description}
      </p>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-pitch hover:text-white transition-colors font-medium min-h-[44px] tap-scale focus-ring rounded-lg px-1"
      >
        View on Maps
        <ExternalLink size={14} />
      </a>
    </motion.article>
  );
}

export default function DiscoverSection() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [query, setQuery] = useState("");

  const filtered = NYC_VENUES.filter((v) => {
    const matchesType = filter === "All" || v.type === filter;
    if (!matchesType) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.neighborhood.toLowerCase().includes(q) ||
      v.borough.toLowerCase().includes(q) ||
      v.vibe.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
    );
  });

  return (
    <section id="discover" className="section-anchor relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff87' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            NYC Guide
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            DISCOVER <span className="text-gradient-pitch">NYC</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Where to watch, where to eat, and where the city comes alive for
            World Cup 2026. Bars, restaurants, fan zones, and viewing parties
            across all five boroughs.
          </p>
        </motion.div>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bars, neighborhoods, boroughs…"
            aria-label="Search NYC venues"
            className="w-full bg-card border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 min-h-[48px] text-sm text-white placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/20"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <Filter size={16} className="text-muted mr-1" aria-hidden />
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-5 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-all border tap-scale focus-ring ${
                filter === f
                  ? "tab-active"
                  : "border-white/10 text-muted hover:text-white hover:border-white/20"
              }`}
            >
              {f}
              {f !== "All" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({NYC_VENUES.filter((v) => v.type === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted mb-8">
          {filtered.length} venue{filtered.length === 1 ? "" : "s"} found
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          {NYC_TRAVEL_AFFILIATES.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={AFFILIATE_TARGET}
              rel={AFFILIATE_REL}
              className="group flex flex-col bg-card/80 border border-white/10 rounded-2xl p-4 hover:border-pitch/40 hover:bg-pitch/5 transition-all tap-scale focus-ring"
            >
              <div className="flex items-center gap-2 mb-2">
                {link.id.includes("booking") ? (
                  <Hotel size={18} className="text-pitch" />
                ) : link.id.includes("amtrak") ? (
                  <Train size={18} className="text-usa-blue" />
                ) : (
                  <MapPin size={18} className="text-gold" />
                )}
                <span className="font-display text-lg text-white group-hover:text-pitch transition-colors">
                  {link.label}
                </span>
                <ExternalLink size={14} className="text-muted ml-auto shrink-0" />
              </div>
              <p className="text-xs text-muted leading-relaxed">{link.description}</p>
            </a>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((venue, i) => (
                <VenueCard key={venue.name} venue={venue} index={i} />
              ))
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-muted py-12"
              >
                No venues match your search. Try a borough or neighborhood name.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-pitch/10 via-usa-blue/10 to-gold/10 border border-white/10 rounded-3xl p-8 text-center"
        >
          <h3 className="font-display text-3xl text-white mb-3">
            METLIFE STADIUM — THE FINAL
          </h3>
          <p className="text-muted max-w-xl mx-auto">
            The World Cup Final lands in East Rutherford, NJ on July 19, 2026.
            Take NJ Transit from Penn Station — about 30 minutes to the
            Meadowlands. NYC fan zones bring the party to every borough.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
