"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Truck, ExternalLink, MapPin, Shirt } from "lucide-react";
import { TEE_PRODUCTS, DROPSHIP_PARTNERS, type TeeColor } from "@/lib/dropship";
import TeePreview from "@/components/TeePreview";
import TeamFlagWithFallback from "@/components/TeamFlag";

const COLOR_FILTERS: Array<{ id: "all" | TeeColor; label: string; swatch?: string }> = [
  { id: "all", label: "All Colors" },
  { id: "white", label: "White Tees", swatch: "bg-white border border-white/30" },
  { id: "yellow", label: "Yellow Tees", swatch: "bg-yellow-400" },
  { id: "navy", label: "Navy Tees", swatch: "bg-slate-800" },
  { id: "red", label: "Red Tees", swatch: "bg-red-600" },
  { id: "orange", label: "Orange Tees", swatch: "bg-orange-500" },
  { id: "skyblue", label: "Sky Blue Tees", swatch: "bg-sky-300" },
  { id: "green", label: "Green Tees", swatch: "bg-green-500" },
];

const TEE_CARD_BG: Record<TeeColor, string> = {
  white: "bg-gradient-to-b from-white/5 to-navy",
  yellow: "bg-gradient-to-b from-yellow-400/10 to-navy",
  navy: "bg-gradient-to-b from-blue-900/20 to-navy",
  red: "bg-gradient-to-b from-red-500/10 to-navy",
  orange: "bg-gradient-to-b from-orange-500/10 to-navy",
  skyblue: "bg-gradient-to-b from-sky-400/10 to-navy",
  green: "bg-gradient-to-b from-green-500/10 to-navy",
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

export default function DropshipSection() {
  const [filter, setFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<"all" | TeeColor>("all");

  const states = ["all", ...new Set(TEE_PRODUCTS.map((p) => p.state))];

  const filtered = TEE_PRODUCTS.filter((p) => {
    const matchState = filter === "all" || p.state === filter;
    const matchColor = colorFilter === "all" || p.teeColor === colorFilter;
    return matchState && matchColor;
  });

  return (
    <section id="shop" className="relative py-24 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-usa-blue/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Official Fan Tees
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            CITY & <span className="text-gradient-gold">NATION</span> TEES
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Catchy phrases on the chest, FIFA trophy on the right sleeve. Flip
            any tee to see the back — city or country name, slogan, and flag.
            White tees for US host cities; nation kits in authentic team colors.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                filter === s
                  ? "tab-active"
                  : "border-white/10 text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {s === "all" ? "All" : s === "INTL" ? "Nations" : s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {COLOR_FILTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColorFilter(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 ${
                colorFilter === c.id
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-muted hover:text-white"
              }`}
            >
              {c.swatch && <span className={`w-3 h-3 rounded-full ${c.swatch}`} />}
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all hover:shadow-xl hover:shadow-gold/10"
            >
              <div
                className={`relative h-52 overflow-hidden ${TEE_CARD_BG[product.teeColor]}`}
              >
                <div className="tee-flip h-full w-full" tabIndex={0}>
                  <div className="tee-flip-inner">
                    <div className="tee-flip-face">
                      <TeePreview
                        side="front"
                        color={product.teeColor}
                        phrase={product.phrase}
                        accent={product.accent}
                        className="h-44 w-auto drop-shadow-2xl"
                      />
                    </div>
                    <div className="tee-flip-face tee-flip-back">
                      <TeePreview
                        side="back"
                        color={product.teeColor}
                        phrase={product.phrase}
                        accent={product.accent}
                        backLabel={product.backLabel}
                        backSlogan={product.backSlogan}
                        flagCode={product.flagCode}
                        className="h-44 w-auto drop-shadow-2xl"
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
                  {product.teeColor} tee
                </span>

                <div className="absolute bottom-2 left-3 text-[9px] text-muted uppercase tracking-wider z-10">
                  Hover to flip
                </div>
                <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[9px] text-gold/80 uppercase tracking-wider z-10">
                  <Shirt size={10} />
                  Trophy · right sleeve
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {product.countryCode && (
                    <TeamFlagWithFallback
                      code={product.countryCode}
                      name={product.theme}
                      size={40}
                    />
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-muted min-w-0">
                    <MapPin size={10} className="text-pitch shrink-0" />
                    <span className="truncate">
                      {product.category === "country" ? product.theme : `${product.city}, ${product.state}`}
                    </span>
                  </div>
                </div>

                <p className="font-display text-lg text-gold leading-tight tracking-wide mb-1">
                  &ldquo;{product.phrase}&rdquo;
                </p>

                <h3 className="font-semibold text-white text-sm group-hover:text-pitch transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">{product.tagline}</p>

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
