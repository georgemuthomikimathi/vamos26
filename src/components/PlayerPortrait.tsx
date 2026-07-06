"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { playerImagePath } from "@/lib/playerImages";

type PlayerPortraitProps = {
  imageSlug?: string;
  name: string;
  size?: number;
  hd?: boolean;
};

export default function PlayerPortrait({
  imageSlug,
  name,
  size = 48,
  hd = true,
}: PlayerPortraitProps) {
  const [err, setErr] = useState(false);
  const src = imageSlug ? playerImagePath(imageSlug) : undefined;
  const displaySize = hd ? Math.round(size * 2) : size;

  if (!src || err) {
    return (
      <div
        className="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
        title={name}
      >
        <User size={size * 0.45} className="text-muted" aria-hidden />
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden shrink-0 border border-white/10 ring-1 ring-white/5"
      style={{ width: size, height: size }}
      title={name}
    >
      <Image
        src={src}
        alt={`${name} photo`}
        fill
        className="object-cover object-top"
        sizes={`${displaySize}px`}
        quality={90}
        onError={() => setErr(true)}
      />
    </div>
  );
}
