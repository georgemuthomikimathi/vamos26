"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Truck,
  ExternalLink,
  MapPin,
  Shirt,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { TEE_PRODUCTS, DROPSHIP_PARTNERS, type TeeColor } from "@/lib/dropship";
import TeePreview from "@/components/TeePreview";
import TeamFlagWithFallback from "@/components/TeamFlag";

const COLOR_FILTERS: Array<{ id: "all" | TeeColor; label: string; swatch?: string }> = [
  { id: "all", label: "All" },
  { id: "white", label: "White", swatch: "bg-white border border-white/30" },
  { id: "yellow", label: "Yellow", swatch: "bg-yellow-400" },
  { id: "navy", label: "Navy", swatch: "bg-slate-800" },
  { id: "red", label: "Red", swatch: "bg-red-600" },
  { id: "orange", label: "Orange", swatch: "bg-orange-500" },
  { id: "skyblue", label: "Sky", swatch: "bg-sky-300" },
  { id: "green", label: "Green", swatch: "bg-green-500" },
];

const TEE_CARD_BG: Record<TeeColor, string> = {
  white: "bg-gradient-to-br from-white/10 via-navy to-navy",
  yellow: "bg-gradient-to-br from-yellow-400/20 via-navy to-navy",
  navy: "bg-gradient-to-br from-blue-900/30 via-navy to-navy",
  red: "bg-gradient-to-br from-red-500/20 via-navy to-navy",
  orange: "bg-gradient-to-br from-orange-500/20 via-navy to-navy",
  skyblue: "bg-gradient-to-br from-sky-400/20 via-navy to-navy",
  green: "bg-gradient-to-br from-green-500/20 via-navy to-navy",
};

const TEE_BADGE_CLASS: Record<TeeColor, string> = {
  white: "bg-white/90 text-navy border-white/50",
  yellow: "bg-yellow-400/90 text-navy border-yellow-500",
  navy: "bg-slate-800/90 text-white border-slate-600",
  red: "bg-red-600/90 text-white border-red-500",
  orange: "bg-orange-500/90 text-navy border-orange-400",
  skyblue: "bg-sky-300/90 text-navy border-sky-400",
  green: "bg-green-500/90 text-white border-green-400",
};

type CategoryFilter = "all" | "country" | "city";

export default function DropshipSection() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<"all" | TeeColor>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const states = useMemo(
    () => ["all", ...new Set(TEE_PRODUCTS.map((p) => p.state))],
    []
  );

  const featured = useMemo(
    () => TEE_PRODUCTS.find((p) => p.badge === "OPENING MATCH") ?? TEE_PRODUCTS[0],
    []
  );

  const filtered = TEE_PRODUCTS.filter((p) => {
    const matchCat =
      category === "all" ||
      (category === "country" && p.category === "country") ||
      (category === "city" && p.category === "city");
    const matchState = stateFilter === "all" || p.state === stateFilter;
    const matchColor = colorFilter === "all" || p.teeColor === colorFilter;
    return matchCat && matchState && matchColor;
  });

  const spotlight = activeId
    ? TEE_PRODUCTS.find((p) => p.id === activeId) ?? featured
    : featured;

  return (
    <section id="shop" className="relative py-24 bg-navy overflow-hidden section-anchor">
      <div className="absolute inset-0 bg-gradient-to-t from-gold/8 via-pitch/5 to-usa-blue/8 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} />
            Official Fan Tees
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            CITY & <span className="text-gradient-gold">NATION</span> TEES
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm md:text-base">
            Country-color accents, flag on chest, FIFA trophy on the right sleeve, and
            VAMOS26 calligraphy on the left. Flip to reveal city or nation on the back.
          </p>
        </motion.div>

        {/* Featured spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card to-navy overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative p-8 flex items-center justify-center min-h-[280px] bg-gradient-to-br from-white/5 to-transparent">
              <div className="tee-flip h-56 w-full max-w-xs mx-auto" tabIndex={0}>
                <div className="tee-flip-inner">
                  <div className="tee-flip-face flex items-center justify-center">
                    <TeePreview
                      side="front"
                      color={spotlight.teeColor}
                      phrase={spotlight.phrase}
                      accent={spotlight.accent}
                      flagCode={spotlight.flagCode}
                      className="h-52 w-auto drop-shadow-2xl"
                    />
                  </div>
                  <div className="tee-flip-face tee-flip-back flex items-center justify-center">
                    <TeePreview
                      side="back"
                      color={spotlight.teeColor}
                      phrase={spotlight.phrase}
                      accent={spotlight.accent}
                      backLabel={spotlight.backLabel}
                      backSlogan={spotlight.backSlogan}
                      flagCode={spotlight.flagCode}
                      className="h-52 w-auto drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-gold/70 uppercase tracking-wider flex items-center gap-1">
                <RotateCcw size={10} />
                Hover to flip
              </span>
            </div>
            <div className="p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gold/20">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-2">
                Featured Drop
              </span>
              <h3 className="font-display text-3xl text-white mb-2">{spotlight.name}</h3>
              <p className="font-display text-xl text-gold mb-3">&ldquo;{spotlight.phrase}&rdquo;</p>
              <p className="text-sm text-muted mb-4">{spotlight.tagline}</p>
              <div className="flex items-center gap-3 mb-6">
                {spotlight.countryCode && (
                  <TeamFlagWithFallback
                    code={spotlight.countryCode}
                    name={spotlight.theme}
                    size={40}
                  />
                )}
                <span className="font-display text-3xl text-pitch">${spotlight.price}</span>
              </div>
              <button className="self-start bg-gold hover:bg-gold/90 text-navy font-bold rounded-xl px-6 py-3 text-sm flex items-center gap-2 transition-colors">
                <ShoppingBag size={18} />
                Shop Featured Tee
              </button>
            </div>
          </div>
        </motion.div>

        {/* Category + filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {(
            [
              { id: "all" as const, label: "All Tees" },
              { id: "country" as const, label: "Nations" },
              { id: "city" as const, label: "Host Cities" },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                category === c.id
                  ? "tab-active"
                  : "border-white/10 text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {states.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStateFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                stateFilter === s
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-muted hover:text-white"
              }`}
            >
              {s === "all" ? "All Regions" : s === "INTL" ? "International" : s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {COLOR_FILTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColorFilter(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 ${
                colorFilter === c.id
                  ? "bg-pitch/20 border-pitch/40 text-pitch"
                  : "border-white/10 text-muted hover:text-white"
              }`}
            >
              {c.swatch && <span className={`w-3 h-3 rounded-full ${c.swatch}`} />}
              {c.label}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted mb-6">
          Showing {filtered.length} design{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onMouseEnter={() => setActiveId(product.id)}
                onFocus={() => setActiveId(product.id)}
                className={`group bg-card border rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-gold/10 ${
                  activeId === product.id
                    ? "border-gold/50 ring-1 ring-gold/30"
                    : "border-white/10 hover:border-gold/30"
                }`}
              >
                <div
                  className={`relative h-56 overflow-hidden ${TEE_CARD_BG[product.teeColor]}`}
                  style={{ borderBottom: `3px solid ${product.accent ?? "#22c55e"}` }}
                >
                  <div className="tee-flip h-full w-full" tabIndex={0}>
                    <div className="tee-flip-inner">
                      <div className="tee-flip-face flex items-center justify-center pt-2">
                        <TeePreview
                          side="front"
                          color={product.teeColor}
                          phrase={product.phrase}
                          accent={product.accent}
                          flagCode={product.flagCode}
                          className="h-48 w-auto drop-shadow-2xl transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="tee-flip-face tee-flip-back flex items-center justify-center pt-2">
                        <TeePreview
                          side="back"
                          color={product.teeColor}
                          phrase={product.phrase}
                          accent={product.accent}
                          backLabel={product.backLabel}
                          backSlogan={product.backSlogan}
                          flagCode={product.flagCode}
                          className="h-48 w-auto drop-shadow-2xl"
                        />
                      </div>
                    </div>
                  </div>

                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full z-10">
                      {product.badge}
                    </span>
                  )}

                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border z-10 ${TEE_BADGE_CLASS[product.teeColor]}`}
                  >
                    {product.teeColor}
                  </span>

                  <div className="absolute bottom-2 left-3 text-[9px] text-white/50 uppercase tracking-wider z-10 flex items-center gap-1">
                    <RotateCcw size={9} />
                    Flip
                  </div>
                  <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[9px] text-gold/80 uppercase tracking-wider z-10">
                    <Shirt size={10} />
                    Flag · VAMOS26
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {product.countryCode && (
                      <TeamFlagWithFallback
                        code={product.countryCode}
                        name={product.theme}
                        size={32}
                      />
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted min-w-0">
                      <MapPin size={10} className="text-pitch shrink-0" />
                      <span className="truncate">
                        {product.category === "country"
                          ? product.theme
                          : `${product.city}, ${product.state}`}
                      </span>
                    </div>
                  </div>

                  <p className="font-display text-lg text-gold leading-tight tracking-wide mb-1">
                    &ldquo;{product.phrase}&rdquo;
                  </p>

                  <h3 className="font-semibold text-white text-sm group-hover:text-pitch transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed line-clamp-2">
                    {product.tagline}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-display text-2xl text-pitch">${product.price}</span>
                    <span className="text-[10px] text-muted">via {product.partner}</span>
                  </div>

                  <button className="w-full mt-4 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-muted uppercase tracking-[0.3em] text-xs font-semibold mb-6">
            Vetted US Fulfillment Partners
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DROPSHIP_PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card/60 border border-white/10 rounded-2xl p-5 hover:border-pitch/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display text-xl text-white group-hover:text-pitch transition-colors">
                    {partner.name}
                  </h4>
                  <ExternalLink size={14} className="text-muted" />
                </div>
                <div className="flex items-center gap-1 text-gold text-sm mb-2">
                  <Star size={14} fill="currentColor" />
                  {partner.rating} · {partner.reviews} reviews
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
                  <Truck size={12} className="text-pitch" />
                  {partner.avgShipDays}
                </div>
                <p className="text-xs text-pitch/80 mt-2">{partner.specialty}</p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
