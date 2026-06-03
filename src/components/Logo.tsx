type LogoProps = {
  size?: number;
  variant?: "pepper" | "sienna" | "gum" | "oak" | "clay";
  withRing?: boolean;
  className?: string;
};

const COLOR: Record<NonNullable<LogoProps["variant"]>, string> = {
  pepper: "#38261C",
  sienna: "#6B3F23",
  gum:    "#8F8C78",
  oak:    "#B0997D",
  clay:   "#EDE5DE",
};

/**
 * تأويل الرؤى — brand mark (Tifinagh-inspired "yaz" figure with sun/leaf crescent).
 * Rebuilt to match the client's authoritative PNG: dot-head, open Y arms,
 * diamond mid-joint, U-shaped legs, semi-circle crescent on the left,
 * curved almond leaves on the right.
 */
export default function Logo({
  size = 56,
  variant = "pepper",
  withRing = true,
  className,
}: LogoProps) {
  const c = COLOR[variant];
  const stroke = 4.5;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="شعار تأويل الرؤى"
      className={className}
    >
      {withRing && (
        <>
          {/* Crescent on the LEFT — open semi-circle */}
          <path
            d="M 100 28 C 60 28 32 60 32 100 C 32 140 60 172 100 172"
            fill="none"
            stroke={c}
            strokeWidth={stroke - 0.5}
            strokeLinecap="round"
          />
          {/* Subtle inner crescent shadow for depth */}
          <path
            d="M 100 36 C 65 36 42 65 42 100 C 42 135 65 164 100 164"
            fill="none"
            stroke={c}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Sun/leaf rays — 9 almond-shaped leaves on right, spanning the arc */}
          {[
            { angle: -100, r: 38 },
            { angle: -75,  r: 42 },
            { angle: -55,  r: 44 },
            { angle: -35,  r: 45 },
            { angle: -15,  r: 44 },
            { angle: 10,   r: 42 },
            { angle: 35,   r: 40 },
            { angle: 60,   r: 38 },
            { angle: 85,   r: 36 },
          ].map(({ angle, r }, i) => (
            <g
              key={i}
              transform={`rotate(${angle} 100 100) translate(100 ${100 - 88})`}
            >
              {/* Almond / leaf shape pointing outward */}
              <path
                d={`M 0 0 Q -3.5 ${-r * 0.5} 0 ${-r} Q 3.5 ${-r * 0.5} 0 0 Z`}
                fill={c}
                opacity={0.95}
              />
            </g>
          ))}
        </>
      )}

      {/* Human figure (yaz) — centered around (100, 100) */}
      <g
        stroke={c}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Head — solid dot */}
        <circle cx="100" cy="58" r="5" fill={c} stroke="none" />

        {/* Upper arms — open Y reaching up & out */}
        <path d="M 76 56 L 100 80 L 124 56" />

        {/* Upper body (between arms-junction and diamond) */}
        <path d="M 100 80 L 100 96" />

        {/* Diamond mid-joint */}
        <path d="M 100 96 L 109 106 L 100 116 L 91 106 Z" fill={c} />

        {/* Lower body (below diamond, into legs arc) */}
        <path d="M 100 116 L 100 132" />

        {/* Lower legs — U-shape (open arc with two vertical sides) */}
        <path d="M 74 168 L 74 144 Q 100 122 126 144 L 126 168" />
      </g>
    </svg>
  );
}
