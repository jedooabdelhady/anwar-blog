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
 * Anwar brand mark — abstract human figure (Tifinagh-inspired "yaz")
 * inside a sun/leaf crescent ring. Faithful to client's approved logo.
 */
export default function Logo({
  size = 56,
  variant = "pepper",
  withRing = true,
  className,
}: LogoProps) {
  const c = COLOR[variant];
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="شعار أنوار"
      className={className}
    >
      {withRing && (
        <>
          {/* Outer crescent ring */}
          <path
            d="M 86 50 A 36 36 0 1 0 50 86"
            fill="none"
            stroke={c}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Leaves (sun rays — small ellipses pointing outward) */}
          {[-65, -50, -35, -20, -5].map((deg, i) => (
            <g key={i} transform={`rotate(${deg} 50 50)`}>
              <ellipse
                cx="50"
                cy="9"
                rx="2.2"
                ry="5.5"
                fill={c}
                opacity={0.92}
              />
            </g>
          ))}
        </>
      )}

      {/* Human figure — arms up (Y) + base (H) */}
      <g stroke={c} strokeWidth="4.5" strokeLinecap="round" fill="none">
        {/* head dot */}
        <circle cx="50" cy="40" r="2.6" fill={c} />
        {/* arms (Y open) */}
        <path d="M 38 32 L 50 42 L 62 32" />
        {/* body */}
        <path d="M 50 42 L 50 58" />
        {/* small connector dot */}
        <circle cx="50" cy="60" r="1.8" fill={c} />
        {/* base legs (open H) */}
        <path d="M 38 78 L 38 64 Q 50 56 62 64 L 62 78" />
      </g>
    </svg>
  );
}
