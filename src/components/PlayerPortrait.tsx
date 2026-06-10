"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { playerImagePath } from "@/lib/playerImages";

type PlayerPortraitProps = {
  imageSlug?: string;
  name: string;
  size?: number;
};

export default function PlayerPortrait({ imageSlug, name, size = 48 }: PlayerPortraitProps) {
  const [err, setErr] = useState(false);
  const src = imageSlug ? playerImagePath(imageSlug) : undefined;

  if (!src || err) {
    return (
      <div
        className="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <User size={size * 0.45} className="text-muted" />
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden shrink-0 border border-white/10"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${name} portrait`}
        fill
        className="object-cover object-top"
        sizes={`${size}px`}
        onError={() => setErr(true)}
      />
    </div>
  );
}
