"use client";

import { useState } from "react";

type TeamFlagProps = {
  code: string;
  name: string;
  size?: 40 | 80 | 160;
  className?: string;
};

const SIZES = {
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
};

export default function TeamFlagWithFallback({
  code,
  name,
  size = 80,
  className = "",
}: TeamFlagProps) {
  const [failed, setFailed] = useState(false);
  const px = SIZES[size];
  const fallbackColor = FLAG_COLORS[code] ?? "bg-slate-600";

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
      src={`/flags/1x1/${code}.svg`}
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
