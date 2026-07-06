"use client";

import { useState } from "react";

type TeamFlagProps = {
  code: string;
  name: string;
  size?: 16 | 28 | 32 | 40 | 80 | 160;
  className?: string;
};

const SIZES = {
  16: 16,
  28: 28,
  32: 32,
  40: 32,
  80: 48,
  160: 80,
} as const;

/** Fallback colors when SVG fails — all 48 World Cup teams */
const FLAG_COLORS: Record<string, string> = {
  mx: "bg-green-700",
  za: "bg-green-600",
  kr: "bg-red-700",
  cz: "bg-blue-800",
  ca: "bg-red-600",
  ba: "bg-blue-600",
  qa: "bg-red-900",
  ch: "bg-red-600",
  br: "bg-green-500",
  ma: "bg-red-600",
  ht: "bg-blue-700",
  "gb-sct": "bg-blue-700",
  us: "bg-blue-700",
  py: "bg-red-700",
  au: "bg-yellow-500",
  tr: "bg-red-700",
  de: "bg-yellow-500",
  cw: "bg-blue-600",
  ci: "bg-orange-600",
  ec: "bg-yellow-500",
  nl: "bg-orange-600",
  jp: "bg-red-600",
  se: "bg-blue-700",
  tn: "bg-red-700",
  be: "bg-yellow-600",
  eg: "bg-red-700",
  ir: "bg-green-700",
  nz: "bg-blue-800",
  es: "bg-red-600",
  cv: "bg-blue-700",
  sa: "bg-green-700",
  uy: "bg-sky-400",
  fr: "bg-blue-600",
  sn: "bg-green-600",
  iq: "bg-red-700",
  no: "bg-red-700",
  ar: "bg-sky-400",
  dz: "bg-green-700",
  at: "bg-red-600",
  jo: "bg-red-700",
  pt: "bg-green-700",
  cd: "bg-sky-500",
  uz: "bg-blue-700",
  co: "bg-yellow-500",
  "gb-eng": "bg-blue-800",
  hr: "bg-red-700",
  gh: "bg-yellow-500",
  pa: "bg-red-700",
};

const CODE_ALIASES: Record<string, string> = {
  curacao: "cw",
  turkey: "tr",
  "congo-dr": "cd",
};

export default function TeamFlagWithFallback({
  code,
  name,
  size = 80,
  className = "",
}: TeamFlagProps) {
  const [failed, setFailed] = useState(false);
  const px = SIZES[size];
  const flagCode = CODE_ALIASES[code] ?? code;
  const fallbackColor = FLAG_COLORS[flagCode] ?? FLAG_COLORS[code] ?? "bg-slate-600";

  if (failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded shadow-sm text-white text-[9px] font-bold uppercase ${fallbackColor} ${className}`}
        style={{ width: px, height: px }}
        title={name}
      >
        {code.slice(0, 3)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/1x1/${flagCode}.svg`}
      alt={`${name} flag`}
      width={px}
      height={px}
      className={`inline-block rounded shadow-sm object-cover ${className}`}
      style={{ width: px, height: px }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
