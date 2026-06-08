type TrophyIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Faithful inline replica of the official FIFA World Cup Trophy
 * (Silvio Gazzaniga, 1974) — two athletes lifting the Earth.
 */
export default function TrophyIcon({
  className = "",
  width = 220,
  height = 320,
}: TrophyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 440"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="FIFA World Cup Trophy"
    >
      <defs>
        <linearGradient id="fifa-gold-a" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#FFF8C8" />
          <stop offset="18%" stopColor="#FFE566" />
          <stop offset="42%" stopColor="#D4AF37" />
          <stop offset="68%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#7A5A08" />
        </linearGradient>
        <linearGradient id="fifa-gold-b" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="18%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFF0A0" />
          <stop offset="82%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="fifa-gold-c" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="100%" stopColor="#9A7209" />
        </linearGradient>
        <radialGradient id="fifa-globe" cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#FFF4B0" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B6914" />
        </radialGradient>
        <radialGradient id="fifa-shine" cx="32%" cy="22%" r="45%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fifa-malachite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2ECC9A" />
          <stop offset="30%" stopColor="#148F6A" />
          <stop offset="60%" stopColor="#0B6B4F" />
          <stop offset="100%" stopColor="#064D3A" />
        </linearGradient>
        <linearGradient id="fifa-base" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
        <filter id="fifa-shadow" x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="150" cy="428" rx="88" ry="10" fill="#000" opacity="0.35" />

      {/* Black stepped base */}
      <path d="M72 396 L84 362 L216 362 L228 396 Z" fill="url(#fifa-base)" />
      <path d="M84 362 L96 340 L204 340 L216 362 Z" fill="#111" />
      <path
        d="M96 340 L108 322 L192 322 L204 340 Z"
        fill="url(#fifa-base)"
        opacity="0.9"
      />

      {/* Malachite band — signature green ring */}
      <ellipse cx="150" cy="322" rx="62" ry="11" fill="url(#fifa-malachite)" />
      <ellipse cx="150" cy="319" rx="58" ry="8" fill="#1BAB7D" opacity="0.45" />
      <path
        d="M92 322 Q110 316 130 320 Q150 324 170 320 Q190 316 208 322"
        fill="none"
        stroke="#3DDDA8"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M95 325 Q125 318 150 322 Q175 318 205 325"
        fill="none"
        stroke="#064D3A"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Stem */}
      <path d="M136 312 L140 286 L160 286 L164 312 Z" fill="url(#fifa-gold-b)" />
      <ellipse cx="150" cy="286" rx="22" ry="6" fill="url(#fifa-gold-a)" />

      {/* Main cup body with spiral fluting */}
      <path
        d="M150 38
           C95 38 58 82 58 132
           C58 172 74 208 96 232
           L96 286 L204 286 L204 232
           C226 208 242 172 242 132
           C242 82 205 38 150 38Z"
        fill="url(#fifa-gold-a)"
        filter="url(#fifa-shadow)"
      />
      <path
        d="M150 38 C95 38 58 82 58 132 C58 172 74 208 96 232 L96 286 L204 286 L204 232 C226 208 242 172 242 132 C242 82 205 38 150 38Z"
        fill="url(#fifa-shine)"
      />

      {/* Spiral grooves on cup body */}
      <path
        d="M72 200 Q150 170 228 200"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M68 170 Q150 145 232 170"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1.2"
        opacity="0.3"
      />
      <path
        d="M66 140 Q150 118 234 140"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1.2"
        opacity="0.25"
      />
      <path
        d="M70 230 Q150 205 230 230"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M78 255 Q150 240 222 255"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1.2"
        opacity="0.3"
      />

      {/* Left handle — athlete's outstretched arm */}
      <path
        d="M58 132
           C34 132 16 154 14 180
           C12 202 22 222 42 228
           C36 210 34 190 36 170
           C38 150 46 136 58 132Z"
        fill="url(#fifa-gold-c)"
      />
      <path
        d="M14 180 C12 198 18 214 32 222"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Right handle */}
      <path
        d="M242 132
           C266 132 284 154 286 180
           C288 202 278 222 258 228
           C264 210 266 190 264 170
           C262 150 254 136 242 132Z"
        fill="url(#fifa-gold-c)"
      />
      <path
        d="M286 180 C288 198 282 214 268 222"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Globe — the Earth */}
      <circle cx="150" cy="128" r="54" fill="url(#fifa-globe)" />
      <circle cx="150" cy="128" r="54" fill="url(#fifa-shine)" />

      {/* Globe latitude lines */}
      <ellipse
        cx="150"
        cy="128"
        rx="54"
        ry="16"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="0.9"
        opacity="0.4"
      />
      <ellipse
        cx="150"
        cy="128"
        rx="54"
        ry="32"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="0.8"
        opacity="0.32"
      />
      <ellipse
        cx="150"
        cy="128"
        rx="54"
        ry="46"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="0.7"
        opacity="0.22"
      />

      {/* Globe longitude / map lines */}
      <path
        d="M150 74 C128 78 110 96 104 118 C98 140 104 160 118 174"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1"
        opacity="0.38"
      />
      <path
        d="M150 74 C172 78 190 96 196 118 C202 140 196 160 182 174"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="1"
        opacity="0.38"
      />
      <path
        d="M96 128 C108 118 128 112 150 112 C172 112 192 118 204 128"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="0.9"
        opacity="0.32"
      />
      <path
        d="M98 142 C112 152 130 158 150 158 C170 158 188 152 202 142"
        fill="none"
        stroke="#7A5A08"
        strokeWidth="0.9"
        opacity="0.32"
      />
      <line
        x1="150"
        y1="74"
        x2="150"
        y2="182"
        stroke="#7A5A08"
        strokeWidth="0.8"
        opacity="0.28"
      />

      {/* Simplified continent outlines on globe */}
      <path
        d="M130 108 C138 100 148 98 158 102 C166 108 168 118 162 126 C154 132 140 130 132 122 C126 116 126 112 130 108Z"
        fill="#7A5A08"
        opacity="0.2"
      />
      <path
        d="M118 134 C126 128 138 126 148 130 C156 136 154 148 144 152 C132 154 116 146 118 134Z"
        fill="#7A5A08"
        opacity="0.18"
      />
      <path
        d="M168 112 C178 108 188 114 190 124 C188 134 178 138 170 132 C164 126 164 118 168 112Z"
        fill="#7A5A08"
        opacity="0.18"
      />

      {/* Left athlete figure */}
      <circle cx="108" cy="108" r="11" fill="url(#fifa-gold-b)" />
      <path
        d="M104 116 L88 158 L98 162 L108 136 L118 162 L128 158 L112 116Z"
        fill="url(#fifa-gold-c)"
      />
      <path
        d="M96 232 C88 224 82 208 82 190 C82 172 90 156 104 148"
        fill="url(#fifa-gold-b)"
        opacity="0.85"
      />
      <path
        d="M88 158 L76 172 L82 178 L92 166Z"
        fill="url(#fifa-gold-c)"
        opacity="0.9"
      />

      {/* Right athlete figure */}
      <circle cx="192" cy="108" r="11" fill="url(#fifa-gold-b)" />
      <path
        d="M196 116 L212 158 L202 162 L192 136 L182 162 L172 158 L188 116Z"
        fill="url(#fifa-gold-c)"
      />
      <path
        d="M204 232 C212 224 218 208 218 190 C218 172 210 156 196 148"
        fill="url(#fifa-gold-b)"
        opacity="0.85"
      />
      <path
        d="M212 158 L224 172 L218 178 L208 166Z"
        fill="url(#fifa-gold-c)"
        opacity="0.9"
      />

      {/* Rim highlight where figures meet globe */}
      <path
        d="M96 232 Q150 248 204 232"
        fill="none"
        stroke="#FFF8C8"
        strokeWidth="2"
        opacity="0.55"
      />

      {/* FIFA inscription band on malachite */}
      <text
        x="150"
        y="326"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#0B6B4F"
        fontFamily="Georgia, serif"
        letterSpacing="3"
        opacity="0.7"
      >
        FIFA
      </text>
    </svg>
  );
}
