import type { ReactNode } from "react";
import type { TeeColor } from "@/lib/dropship";

type TeePreviewProps = {
  color: TeeColor;
  phrase: string;
  accent?: string;
  className?: string;
  side?: "front" | "back";
  backLabel?: string;
  backSlogan?: string;
  flagCode?: string;
};

const TEE_BG: Record<TeeColor, string> = {
  white: "#f8fafc",
  yellow: "#facc15",
  navy: "#1e293b",
  red: "#dc2626",
  orange: "#f97316",
  skyblue: "#7dd3fc",
  green: "#22c55e",
};

const TEXT_COLOR: Record<TeeColor, string> = {
  white: "#0a0e1a",
  yellow: "#0a0e1a",
  navy: "#f8fafc",
  red: "#ffffff",
  orange: "#0a0e1a",
  skyblue: "#0a0e1a",
  green: "#0a0e1a",
};

function TeeShape({
  fill,
  color,
  children,
}: {
  fill: string;
  color: TeeColor;
  children: ReactNode;
}) {
  const stroke =
    color === "white" || color === "skyblue"
      ? "#cbd5e1"
      : "rgba(0,0,0,0.15)";

  return (
    <>
      <path
        d="M70 72 L40 100 L58 112 L70 96 L70 280 L210 280 L210 96 L222 112 L240 100 L210 72 Q140 58 70 72Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M210 96 L240 100 L248 130 L220 125 Z"
        fill={fill}
        stroke={
          color === "white" || color === "skyblue"
            ? "#cbd5e1"
            : "rgba(0,0,0,0.1)"
        }
        strokeWidth="1"
      />
      {children}
    </>
  );
}

function Trophy({ accent }: { accent: string }) {
  return (
    <g transform="translate(218, 102) scale(0.55)">
      <path d="M8 28 L12 18 L20 18 L24 28 Z" fill={accent} />
      <ellipse cx="16" cy="12" rx="10" ry="11" fill={accent} />
      <path
        d="M6 14 C2 14 0 18 0 22 C0 26 4 28 6 28 L8 22 C6 20 6 17 6 14Z"
        fill={accent}
      />
      <path
        d="M26 14 C30 14 32 18 32 22 C32 26 28 28 26 28 L24 22 C26 20 26 17 26 14Z"
        fill={accent}
      />
    </g>
  );
}

export default function TeePreview({
  color,
  phrase,
  accent = "#ffd700",
  className = "",
  side = "front",
  backLabel = "",
  backSlogan = "",
  flagCode = "us",
}: TeePreviewProps) {
  const fill = TEE_BG[color];
  const text = TEXT_COLOR[color];

  if (side === "back") {
    return (
      <svg viewBox="0 0 280 320" className={className} aria-hidden>
        <TeeShape fill={fill} color={color}>
          <text
            x="140"
            y="138"
            textAnchor="middle"
            fill={text}
            fontSize="14"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.06em"
          >
            {backLabel.slice(0, 18).toUpperCase()}
          </text>
          <text
            x="140"
            y="162"
            textAnchor="middle"
            fill={accent}
            fontSize="9"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.04em"
          >
            {backSlogan.slice(0, 32)}
          </text>
          <line
            x1="108"
            y1="172"
            x2="172"
            y2="172"
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.5"
          />
          <image
            href={`/flags/1x1/${flagCode}.svg`}
            x="118"
            y="182"
            width="44"
            height="44"
            preserveAspectRatio="xMidYMid slice"
          />
          <rect
            x="118"
            y="182"
            width="44"
            height="44"
            rx="4"
            fill="none"
            stroke={text}
            strokeWidth="1"
            opacity="0.25"
          />
        </TeeShape>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 280 320" className={className} aria-hidden>
      <TeeShape fill={fill} color={color}>
        <Trophy accent={accent} />
        <text
          x="140"
          y="155"
          textAnchor="middle"
          fill={text}
          fontSize="11"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.08em"
        >
          {phrase.split(" — ")[0]?.slice(0, 22)}
        </text>
        {phrase.includes(" — ") && (
          <text
            x="140"
            y="172"
            textAnchor="middle"
            fill={accent}
            fontSize="9"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.12em"
          >
            {phrase.split(" — ")[1]?.slice(0, 24)}
          </text>
        )}
        {!phrase.includes(" — ") && (
          <text
            x="140"
            y="172"
            textAnchor="middle"
            fill={text}
            fontSize="9"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
            opacity="0.7"
          >
            {phrase.split(" ").slice(-3).join(" ")}
          </text>
        )}
        <line
          x1="100"
          y1="185"
          x2="180"
          y2="185"
          stroke={accent}
          strokeWidth="2"
          opacity="0.6"
        />
      </TeeShape>
    </svg>
  );
}
