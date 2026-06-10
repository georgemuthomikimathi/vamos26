"use client";

import Image from "next/image";
import type { FanModel } from "@/lib/stadium-fans";
import type { TeeProduct } from "@/lib/dropship";
import TeePreview from "@/components/TeePreview";

type TeeOnModelProps = {
  model: FanModel;
  tee: TeeProduct;
};

const GENDER_LABEL: Record<FanModel["gender"], string> = {
  woman: "She/Her",
  man: "He/Him",
  nonbinary: "They/Them",
};

export default function TeeOnModel({ model, tee }: TeeOnModelProps) {
  return (
    <article className="group rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-pitch/30 transition-colors">
      <div className="relative aspect-[3/4] bg-navy overflow-hidden">
        <Image
          src={model.photo}
          alt={`${model.name} wearing ${tee.name}`}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80" />

        {tee.image ? (
          <div
            className="absolute pointer-events-none"
            style={{
              top: model.teePlacement.top,
              left: model.teePlacement.left,
              width: model.teePlacement.width,
            }}
          >
            {/* multiply: white tee bg reveals photo underneath */}
            <Image
              src={tee.image}
              alt=""
              width={280}
              height={320}
              className="w-full h-auto mix-blend-multiply drop-shadow-lg opacity-95"
              aria-hidden
            />
            <div
              className="absolute inset-0 mix-blend-multiply opacity-[0.18] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, ${tee.accent} 12%, transparent 12%, transparent 50%, ${tee.accent} 50%, ${tee.accent} 62%, transparent 62%, transparent 100%),
                  linear-gradient(-45deg, ${tee.accent} 12%, transparent 12%, transparent 50%, ${tee.accent} 50%, ${tee.accent} 62%, transparent 62%, transparent 100%)
                `,
                backgroundSize: "14px 14px",
              }}
              aria-hidden
            />
          </div>
        ) : (
          <div className="absolute inset-x-4 bottom-16 flex justify-center opacity-90">
            <TeePreview
              side="front"
              color={tee.teeColor}
              phrase={tee.phrase}
              accent={tee.accent}
              flagCode={tee.flagCode}
              className="h-28 w-auto drop-shadow-2xl"
            />
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-3">
          <p className="text-sm font-semibold text-white">{model.name}</p>
          <p className="text-[10px] text-muted leading-snug">{model.origin}</p>
          <span className="inline-block mt-1 text-[9px] uppercase tracking-wider text-pitch/80">
            {GENDER_LABEL[model.gender]}
          </span>
        </div>
      </div>
      <div className="px-3 py-2 border-t border-white/10">
        <p className="text-[10px] text-gold font-semibold truncate">&ldquo;{tee.phrase}&rdquo;</p>
      </div>
    </article>
  );
}
