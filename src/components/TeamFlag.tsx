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

const FLAG_COLORS: Record<string, string> = {
  us: "bg-blue-700",
  mx: "bg-green-600",
  ca: "bg-red-600",
  br: "bg-green-500",
  ar: "bg-sky-400",
  fr: "bg-blue-600",
  de: "bg-yellow-500",
  es: "bg-red-600",
  pt: "bg-green-700",
  "gb-eng": "bg-blue-800",
  "gb-sct": "bg-blue-700",
  kr: "bg-red-700",
  cz: "bg-blue-800",
  ba: "bg-blue-600",
  za: "bg-green-700",
  py: "bg-red-700",
  ma: "bg-red-600",
  hr: "bg-red-700",
  nl: "bg-orange-600",
  be: "bg-yellow-600",
  au: "bg-yellow-500",
  tr: "bg-red-700",
  sn: "bg-green-600",
  jp: "bg-red-600",
  ci: "bg-orange-600",
  cw: "bg-blue-600",
};

const CODE_ALIASES: Record<string, string> = {
  curacao: "cw",
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
