type TriondaIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function TriondaIcon({
  className = "",
  width = 260,
  height = 260,
}: TriondaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      width={width}
      height={height}
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="tri-base" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f4f6f8" />
          <stop offset="75%" stopColor="#d8dee8" />
          <stop offset="100%" stopColor="#a8b4c4" />
        </radialGradient>
        <radialGradient id="tri-shade" cx="65%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </radialGradient>
        <linearGradient id="tri-usa" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B7FFF" />
          <stop offset="50%" stopColor="#3C5BFF" />
          <stop offset="100%" stopColor="#1E3080" />
        </linearGradient>
        <linearGradient id="tri-can" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="50%" stopColor="#E8001D" />
          <stop offset="100%" stopColor="#A00010" />
        </linearGradient>
        <linearGradient id="tri-mex" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C96E" />
          <stop offset="50%" stopColor="#00A651" />
          <stop offset="100%" stopColor="#006B35" />
        </linearGradient>
        <linearGradient id="tri-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF0A0" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <clipPath id="tri-clip">
          <circle cx="200" cy="200" r="178" />
        </clipPath>
        <filter id="tri-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="388" rx="120" ry="10" fill="#000" opacity="0.2" />

      {/* Ball sphere base */}
      <circle cx="200" cy="200" r="178" fill="url(#tri-base)" />
      <circle cx="200" cy="200" r="178" fill="url(#tri-shade)" />

      <g clipPath="url(#tri-clip)">
        {/* Panel 1 - top (USA dominant blue waves) */}
        <path
          d="M200 22 C120 22 60 80 38 160 C70 100 130 60 200 60 C270 60 330 100 362 160 C340 80 280 22 200 22Z"
          fill="url(#tri-usa)"
          opacity="0.92"
        />
        <path
          d="M200 60 C150 60 100 90 78 130 C105 95 150 72 200 72 C250 72 295 95 322 130 C300 90 250 60 200 60Z"
          fill="#6B8FFF"
          opacity="0.25"
        />

        {/* Panel 2 - right (Canada red) */}
        <path
          d="M362 160 C382 210 378 270 340 320 C360 270 370 215 365 175 Z"
          fill="url(#tri-can)"
          opacity="0.92"
        />
        <path
          d="M340 320 C310 350 260 370 200 378 C260 365 305 345 330 310 Z"
          fill="url(#tri-mex)"
          opacity="0.88"
        />

        {/* Panel 3 - left (Canada red + Mexico green) */}
        <path
          d="M38 160 C18 210 22 270 60 320 C40 270 30 215 35 175 Z"
          fill="url(#tri-can)"
          opacity="0.92"
        />
        <path
          d="M60 320 C90 350 140 370 200 378 C140 365 95 345 70 310 Z"
          fill="url(#tri-mex)"
          opacity="0.88"
        />

        {/* Panel 4 - bottom center fill */}
        <path
          d="M200 378 C155 375 115 355 85 320 C115 360 155 382 200 385 C245 382 285 360 315 320 C285 355 245 375 200 378Z"
          fill="url(#tri-mex)"
          opacity="0.7"
        />

        {/* Wave arms - blue (USA) sweeping across top panels */}
        <path
          d="M38 160 Q120 130 200 140 Q280 130 362 160"
          fill="none"
          stroke="url(#tri-usa)"
          strokeWidth="22"
          opacity="0.35"
          strokeLinecap="round"
        />
        <path
          d="M60 320 Q130 250 200 240 Q270 250 340 320"
          fill="none"
          stroke="url(#tri-usa)"
          strokeWidth="18"
          opacity="0.2"
          strokeLinecap="round"
        />

        {/* Wave arms - red (Canada) */}
        <path
          d="M38 160 Q90 200 120 250 Q80 210 55 175"
          fill="none"
          stroke="url(#tri-can)"
          strokeWidth="16"
          opacity="0.4"
          strokeLinecap="round"
        />
        <path
          d="M362 160 Q310 200 280 250 Q320 210 345 175"
          fill="none"
          stroke="url(#tri-can)"
          strokeWidth="16"
          opacity="0.4"
          strokeLinecap="round"
        />

        {/* Wave arms - green (Mexico) */}
        <path
          d="M85 320 Q140 290 200 285 Q260 290 315 320"
          fill="none"
          stroke="url(#tri-mex)"
          strokeWidth="20"
          opacity="0.35"
          strokeLinecap="round"
        />

        {/* Central triangle - three nations unite */}
        <path
          d="M200 118 L148 248 L252 248 Z"
          fill="none"
          stroke="url(#tri-gold)"
          strokeWidth="3.5"
          filter="url(#tri-soft)"
        />
        <path
          d="M200 130 L160 238 L240 238 Z"
          fill="url(#tri-gold)"
          opacity="0.18"
        />

        {/* Triangle color fills at vertices */}
        <path d="M200 118 L175 200 L200 200 Z" fill="url(#tri-usa)" opacity="0.35" />
        <path d="M200 118 L225 200 L200 200 Z" fill="url(#tri-can)" opacity="0.3" />
        <path d="M160 238 L240 238 L200 200 Z" fill="url(#tri-mex)" opacity="0.3" />

        {/* Gold trim lines on panels */}
        <path
          d="M200 60 C150 60 100 90 78 130"
          fill="none"
          stroke="url(#tri-gold)"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <path
          d="M200 60 C250 60 300 90 322 130"
          fill="none"
          stroke="url(#tri-gold)"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <path
          d="M70 310 Q135 280 200 275"
          fill="none"
          stroke="url(#tri-gold)"
          strokeWidth="1.2"
          opacity="0.6"
        />
        <path
          d="M330 310 Q265 280 200 275"
          fill="none"
          stroke="url(#tri-gold)"
          strokeWidth="1.2"
          opacity="0.6"
        />

        {/* Four-panel deep seams */}
        <line
          x1="200"
          y1="22"
          x2="200"
          y2="378"
          stroke="#1a2030"
          strokeWidth="3"
          opacity="0.55"
        />
        <line
          x1="38"
          y1="160"
          x2="362"
          y2="160"
          stroke="#1a2030"
          strokeWidth="3"
          opacity="0.55"
        />
        <path
          d="M38 160 Q200 100 362 160"
          fill="none"
          stroke="#1a2030"
          strokeWidth="2.5"
          opacity="0.4"
        />
        <path
          d="M60 320 Q200 260 340 320"
          fill="none"
          stroke="#1a2030"
          strokeWidth="2.5"
          opacity="0.4"
        />

        {/* USA star icon - top panel */}
        <g transform="translate(200, 95)" opacity="0.9">
          <path
            d="M0,-14 L3.6,-4.3 L14,-4.3 L5.8,2.2 L9.4,12.5 L0,6 L-9.4,12.5 L-5.8,2.2 L-14,-4.3 L-3.6,-4.3 Z"
            fill="#ffffff"
            stroke="url(#tri-gold)"
            strokeWidth="0.8"
          />
        </g>

        {/* Canada maple leaf - left panel */}
        <g transform="translate(95, 210) scale(0.9)" opacity="0.9">
          <path
            d="M0,-16 L-4,-6 L-14,-6 L-6,0 L-10,12 L0,6 L10,12 L6,0 L14,-6 L4,-6 Z"
            fill="#ffffff"
            stroke="url(#tri-gold)"
            strokeWidth="0.7"
          />
          <path
            d="M0,-16 L0,14 M-8,-2 L8,-2 M-6,6 L6,6"
            fill="none"
            stroke="#E8001D"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>

        {/* Mexico eagle icon - right panel */}
        <g transform="translate(305, 210)" opacity="0.9">
          <path
            d="M0,-12 C-10,-12 -14,-4 -12,4 C-8,10 0,14 0,14 C0,14 8,10 12,4 C14,-4 10,-12 0,-12Z"
            fill="#ffffff"
            stroke="url(#tri-gold)"
            strokeWidth="0.7"
          />
          <path
            d="M-8,2 L-14,10 M8,2 L14,10 M0,6 L0,14"
            fill="none"
            stroke="#006B35"
            strokeWidth="1.2"
            opacity="0.6"
          />
          <circle cx="0" cy="-4" r="3" fill="#006B35" opacity="0.5" />
        </g>

        {/* TRIONDA branding */}
        <text
          x="200"
          y="318"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fill="#1E3080"
          letterSpacing="5"
          fontFamily="Arial, Helvetica, sans-serif"
          opacity="0.85"
        >
          TRIONDA
        </text>

        {/* adidas-style three stripes hint */}
        <g transform="translate(130, 175)" opacity="0.5">
          <rect x="0" y="0" width="28" height="3" rx="1" fill="#ffffff" transform="rotate(-30)" />
          <rect x="4" y="8" width="28" height="3" rx="1" fill="#ffffff" transform="rotate(-30)" />
          <rect x="8" y="16" width="28" height="3" rx="1" fill="#ffffff" transform="rotate(-30)" />
        </g>
      </g>

      {/* Specular highlight */}
      <ellipse
        cx="155"
        cy="130"
        rx="55"
        ry="35"
        fill="#ffffff"
        opacity="0.12"
        transform="rotate(-25 155 130)"
      />
      <ellipse
        cx="145"
        cy="115"
        rx="25"
        ry="12"
        fill="#ffffff"
        opacity="0.2"
        transform="rotate(-30 145 115)"
      />

      {/* Outer rim */}
      <circle
        cx="200"
        cy="200"
        r="178"
        fill="none"
        stroke="#8899aa"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}
