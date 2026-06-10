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

const BODY_PATH =
  "M70 72 L40 100 L58 112 L70 96 L70 280 L210 280 L210 96 L222 112 L240 100 L210 72 Q140 58 70 72Z";
const LEFT_SLEEVE_PATH = "M70 96 L40 100 L32 132 L62 126 Z";
const RIGHT_SLEEVE_PATH = "M210 96 L240 100 L248 130 L220 125 Z";

function isDarkTee(color: TeeColor): boolean {
  return color === "navy" || color === "red" || color === "green";
}

/** Subtle club-kit diamond lattice clipped to the shirt */
function ClubPatternDefs({
  patternId,
  accent,
  color,
}: {
  patternId: string;
  accent: string;
  color: TeeColor;
}) {
  const dark = isDarkTee(color);
  const line = dark ? "rgba(255,255,255,0.22)" : accent;
  const dot = dark ? "rgba(255,255,255,0.14)" : accent;
  const wash = dark ? "rgba(255,255,255,0.04)" : `${accent}14`;

  return (
    <defs>
      <pattern
        id={patternId}
        width="22"
        height="22"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="22" height="22" fill={wash} />
        <path
          d="M0 11 L11 0 L22 11 L11 22 Z"
          fill="none"
          stroke={line}
          strokeWidth="0.65"
          opacity="0.55"
        />
        <path
          d="M11 0 L11 22 M0 11 L22 11"
          stroke={line}
          strokeWidth="0.35"
          opacity="0.35"
        />
        <circle cx="11" cy="11" r="1.2" fill={dot} opacity="0.5" />
        <circle cx="0" cy="0" r="0.8" fill={dot} opacity="0.35" />
        <circle cx="22" cy="22" r="0.8" fill={dot} opacity="0.35" />
      </pattern>
      <clipPath id={`${patternId}-body`}>
        <path d={BODY_PATH} />
      </clipPath>
      <clipPath id={`${patternId}-left`}>
        <path d={LEFT_SLEEVE_PATH} />
      </clipPath>
      <clipPath id={`${patternId}-right`}>
        <path d={RIGHT_SLEEVE_PATH} />
      </clipPath>
      <clipPath id={`${patternId}-all`}>
        <path d={BODY_PATH} />
        <path d={LEFT_SLEEVE_PATH} />
        <path d={RIGHT_SLEEVE_PATH} />
      </clipPath>
    </defs>
  );
}

function ClubPatternOverlay({ patternId }: { patternId: string }) {
  return (
    <g clipPath={`url(#${patternId}-all)`} pointerEvents="none">
      <rect x="0" y="0" width="280" height="320" fill={`url(#${patternId})`} />
    </g>
  );
}

function TeeShape({
  fill,
  color,
  accent,
  patternId,
  children,
}: {
  fill: string;
  color: TeeColor;
  accent: string;
  patternId: string;
  children: ReactNode;
}) {
  const stroke =
    color === "white" || color === "skyblue"
      ? "#cbd5e1"
      : "rgba(0,0,0,0.15)";

  return (
    <>
      <ClubPatternDefs patternId={patternId} accent={accent} color={color} />
      {/* Body */}
      <path
        d={BODY_PATH}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Left sleeve */}
      <path
        d={LEFT_SLEEVE_PATH}
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      {/* Right sleeve */}
      <path
        d={RIGHT_SLEEVE_PATH}
        fill={fill}
        stroke={
          color === "white" || color === "skyblue"
            ? "#cbd5e1"
            : "rgba(0,0,0,0.1)"
        }
        strokeWidth="1"
      />
      <ClubPatternOverlay patternId={patternId} />
      {/* Country-color shoulder trim */}
      <path
        d="M72 74 Q140 62 208 74"
        fill="none"
        stroke={accent}
        strokeWidth="3"
        opacity="0.85"
      />
      <path
        d="M74 280 L206 280"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        opacity="0.45"
      />
      {children}
    </>
  );
}

function Vamos26Sleeve({ accent }: { accent: string }) {
  return (
    <g transform="translate(46, 108) rotate(-72)">
      <text
        x="0"
        y="0"
        fill={accent}
        fontSize="7"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        letterSpacing="0.14em"
      >
        VAMOS26
      </text>
    </g>
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

function FlagBadge({
  flagCode,
  x,
  y,
  size,
}: {
  flagCode: string;
  x: number;
  y: number;
  size: number;
}) {
  return (
    <g>
      <circle cx={x + size / 2} cy={y + size / 2} r={size / 2 + 2} fill="rgba(0,0,0,0.08)" />
      <clipPath id={`flag-clip-${flagCode}-${x}`}>
        <circle cx={x + size / 2} cy={y + size / 2} r={size / 2} />
      </clipPath>
      <image
        href={`/flags/1x1/${flagCode}.svg`}
        x={x}
        y={y}
        width={size}
        height={size}
        clipPath={`url(#flag-clip-${flagCode}-${x})`}
        preserveAspectRatio="xMidYMid slice"
      />
      <circle
        cx={x + size / 2}
        cy={y + size / 2}
        r={size / 2}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
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
  const patternId = `club-pattern-${flagCode}-${color}-${side}`;

  if (side === "back") {
    return (
      <svg viewBox="0 0 280 320" className={className} aria-hidden>
        <defs>
          <linearGradient id={`tee-back-glow-${flagCode}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <TeeShape fill={fill} color={color} accent={accent} patternId={patternId}>
          <rect x="90" y="118" width="100" height="120" fill={`url(#tee-back-glow-${flagCode})`} rx="8" />
          <Vamos26Sleeve accent={accent} />
          <text
            x="140"
            y="132"
            textAnchor="middle"
            fill={text}
            fontSize="15"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.08em"
          >
            {backLabel.slice(0, 16).toUpperCase()}
          </text>
          <text
            x="140"
            y="152"
            textAnchor="middle"
            fill={accent}
            fontSize="9"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.05em"
          >
            {backSlogan.slice(0, 34)}
          </text>
          <line
            x1="108"
            y1="162"
            x2="172"
            y2="162"
            stroke={accent}
            strokeWidth="2"
            opacity="0.6"
          />
          <FlagBadge flagCode={flagCode} x={114} y={172} size={52} />
        </TeeShape>
      </svg>
    );
  }

  const line1 = phrase.split(" — ")[0]?.slice(0, 20) ?? phrase.slice(0, 20);
  const line2 = phrase.includes(" — ")
    ? phrase.split(" — ")[1]?.slice(0, 22)
    : phrase.split(" ").slice(-3).join(" ");

  return (
    <svg viewBox="0 0 280 320" className={className} aria-hidden>
      <TeeShape fill={fill} color={color} accent={accent} patternId={patternId}>
        <Vamos26Sleeve accent={accent} />
        <Trophy accent={accent} />
        <FlagBadge flagCode={flagCode} x={126} y={118} size={28} />
        <text
          x="140"
          y="158"
          textAnchor="middle"
          fill={text}
          fontSize="10"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.1em"
        >
          {line1}
        </text>
        <text
          x="140"
          y="174"
          textAnchor="middle"
          fill={accent}
          fontSize="8.5"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.12em"
        >
          {line2}
        </text>
        <line
          x1="98"
          y1="186"
          x2="182"
          y2="186"
          stroke={accent}
          strokeWidth="2.5"
          opacity="0.7"
        />
      </TeeShape>
    </svg>
  );
}
