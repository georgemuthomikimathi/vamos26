"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Trophy,
  Building2,
  Shirt,
  ExternalLink,
  X,
  Navigation,
} from "lucide-react";
import type { Stadium } from "@/lib/stadiums";
import {
  formatCapacity,
  formatStadiumLocation,
  getTeeForStadium,
  mapsUrl,
} from "@/lib/stadium-tees";
import { getFanModelsForStadium } from "@/lib/stadium-fans";
import { scrollToSection } from "@/lib/scroll";
import TeePreview from "@/components/TeePreview";
import TeeOnModel from "@/components/TeeOnModel";

type StadiumDetailPanelProps = {
  stadium: Stadium;
  onClose: () => void;
};

export default function StadiumDetailPanel({ stadium, onClose }: StadiumDetailPanelProps) {
  const tee = getTeeForStadium(stadium);
  const fans = getFanModelsForStadium(stadium.id);

  const goToShop = () => {
    onClose();
    scrollToSection("shop");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="col-span-full bg-card border border-pitch/30 rounded-2xl overflow-hidden shadow-xl shadow-pitch/10"
    >
      <div className="flex items-start justify-between gap-3 p-5 border-b border-white/10 bg-gradient-to-r from-pitch/10 via-transparent to-usa-blue/10">
        <div className="min-w-0">
          {stadium.id === "metlife" && (
            <span className="inline-flex items-center gap-1 text-gold text-[10px] uppercase tracking-wider font-bold mb-2">
              <Trophy size={12} /> Final Venue
            </span>
          )}
          <h3 className="font-display text-3xl text-white">{stadium.name}</h3>
          <p className="text-pitch text-sm font-semibold mt-1">{stadium.nickname}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close stadium details"
          className="shrink-0 p-2 rounded-full border border-white/10 text-muted hover:text-white hover:bg-white/10 transition-colors focus-ring"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 grid lg:grid-cols-2 gap-8">
        {/* Location & capacity */}
        <div className="space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-semibold mb-3">
              Venue Details
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-pitch mb-2">
                  <Users size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Capacity</span>
                </div>
                <p className="font-display text-3xl text-white">{formatCapacity(stadium.capacity)}</p>
                <p className="text-xs text-muted mt-1">seated fans</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-usa-blue mb-2">
                  <Building2 size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Matches</span>
                </div>
                <p className="font-display text-3xl text-white">{stadium.matches}</p>
                <p className="text-xs text-muted mt-1">tournament fixtures</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-gold mb-2">
              <MapPin size={16} />
              <span className="text-[10px] uppercase tracking-wider font-bold">Location</span>
            </div>
            <p className="text-white font-medium">{formatStadiumLocation(stadium)}</p>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Opened {stadium.opened} · {stadium.surface}
            </p>
            <p className="text-sm text-muted mt-3 leading-relaxed">{stadium.highlight}</p>
            <a
              href={mapsUrl(stadium)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-pitch hover:text-white transition-colors"
            >
              <Navigation size={12} />
              Open in Maps
              <ExternalLink size={10} />
            </a>
          </div>

          {tee && (
            <div className="bg-gradient-to-br from-gold/10 to-pitch/5 rounded-xl p-4 border border-gold/25">
              <div className="flex items-center gap-2 text-gold mb-3">
                <Shirt size={16} />
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  Favorite City Tee
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <TeePreview
                  side="front"
                  color={tee.teeColor}
                  phrase={tee.phrase}
                  accent={tee.accent}
                  flagCode={tee.flagCode}
                  className="h-24 w-auto shrink-0 drop-shadow-lg"
                />
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-sm">{tee.name}</h4>
                  <p className="text-xs text-gold mt-1">&ldquo;{tee.phrase}&rdquo;</p>
                  <p className="text-xs text-muted mt-1">{tee.tagline}</p>
                  <p className="font-display text-xl text-pitch mt-2">${tee.price}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={goToShop}
                className="mt-4 w-full sm:w-auto bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
              >
                Shop this tee
              </button>
            </div>
          )}
        </div>

        {/* Fan gallery */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-semibold mb-1">
            Fan Gallery
          </p>
          <p className="text-xs text-muted mb-4">
            Real fans, diverse backgrounds — rocking the official {stadium.city} tee.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {tee &&
              fans.map((model) => (
                <TeeOnModel key={`${stadium.id}-${model.id}`} model={model} tee={tee} />
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
