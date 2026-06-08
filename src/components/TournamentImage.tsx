"use client";

import Image from "next/image";
import { useState } from "react";
import TrophyIcon from "@/components/icons/TrophyIcon";
import TriondaIcon from "@/components/icons/TriondaIcon";
import { IMAGES } from "@/lib/data";

type TournamentImageProps = {
  type: "trophy" | "trionda";
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export default function TournamentImage({
  type,
  width,
  height,
  className = "",
  priority = false,
}: TournamentImageProps) {
  const [failed, setFailed] = useState(false);
  const src = type === "trophy" ? IMAGES.trophy : IMAGES.trionda;
  const alt =
    type === "trophy"
      ? "FIFA World Cup Trophy"
      : "Adidas Trionda — FIFA World Cup 2026 Official Match Ball";
  const cutoutClass =
    type === "trophy" ? "tournament-cutout-gold" : "tournament-cutout-pitch";

  if (failed) {
    if (type === "trophy") {
      return (
        <TrophyIcon width={width} height={height} className={className} />
      );
    }
    return <TriondaIcon width={width} height={height} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`tournament-cutout object-contain ${cutoutClass} ${className}`}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
