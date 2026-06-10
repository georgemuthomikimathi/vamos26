"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Trophy, Building2 } from "lucide-react";
import { ALL_STADIUMS, US_STADIUMS } from "@/lib/stadiums";

export default function StadiumsSection() {
  return (
    <section id="stadiums" className="relative py-24 bg-navy-light overflow-hidden">
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
            Every pitch where history will be made — from the Empire State Final at
            MetLife to the Magic City in Miami.
          </p>
        </motion.div>

        <p className="text-pitch uppercase tracking-[0.3em] text-xs font-semibold mb-6">
          United States — {US_STADIUMS.length} venues
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {US_STADIUMS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`group bg-card border rounded-2xl p-6 hover:border-pitch/30 transition-all ${
                s.id === "metlife" ? "border-gold/30 bg-gold/5" : "border-white/10"
              }`}
            >
              {s.id === "metlife" && (
                <span className="inline-flex items-center gap-1 text-gold text-[10px] uppercase tracking-wider font-bold mb-3">
                  <Trophy size={12} /> Final Venue
                </span>
              )}
              <h3 className="font-display text-2xl text-white group-hover:text-pitch transition-colors">
                {s.name}
              </h3>
              <p className="text-pitch text-sm font-semibold mt-1">{s.nickname}</p>
              <div className="flex items-center gap-1.5 text-muted text-sm mt-2">
                <MapPin size={14} className="text-usa-blue shrink-0" />
                {s.city}, {s.state}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Users size={16} className="text-pitch mx-auto mb-1" />
                  <div className="font-display text-xl text-white">
                    {(s.capacity / 1000).toFixed(0)}K
                  </div>
                  <div className="text-[10px] text-muted uppercase">Capacity</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Building2 size={16} className="text-usa-blue mx-auto mb-1" />
                  <div className="font-display text-xl text-white">{s.matches}</div>
                  <div className="text-[10px] text-muted uppercase">Matches</div>
                </div>
              </div>
              <p className="text-xs text-muted mt-4 leading-relaxed">{s.highlight}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-muted uppercase tracking-[0.3em] text-xs font-semibold mb-6">
          Canada & Mexico
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_STADIUMS.filter((s) => s.hostNation !== "USA").map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card/60 border border-white/10 rounded-2xl p-5 hover:border-pitch/20 transition-colors"
            >
              <h4 className="font-display text-xl text-white">{s.name}</h4>
              <p className="text-xs text-pitch mt-1">{s.nickname}</p>
              <p className="text-xs text-muted mt-2">
                {s.city} · {(s.capacity / 1000).toFixed(0)}K cap
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
