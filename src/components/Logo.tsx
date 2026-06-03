type LogoProps = {
  size?: number;
  variant?: "pepper" | "sienna" | "gum" | "oak" | "clay";
  /** When true, draws the full mark (yaz + crescent + leaves).
   *  When false, draws only the yaz figure (no surrounding ring/sun). */
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
 * علم تأويل الرؤى — brand mark.
 * Faithfully redrawn to match the client's authoritative reference images:
 * a Tifinagh-inspired "yaz" figure (dot head, open-Y arms, vertical body,
 * filled diamond mid-joint, lower body, inverted-U legs) surrounded — in
 * the full version — by a left-side open crescent and almond-shaped sun
 * leaves on the right.
 */
export default function Logo({
  size = 56,
  variant = "pepper",
  withRing = true,
  className,
}: LogoProps) {
  const c = COLOR[variant];

  // viewBox dimensions chosen to give the figure room to breathe within
  // the surrounding crescent+leaves while staying close to a 1:1 square.
  const VB_W = 240;
  const VB_H = 240;
  const CX  = VB_W / 2;     // 120 — figure center X
  const CY  = VB_H / 2;     // 120 — used as the rotational pivot for leaves

  // Yaz figure coordinates (proportional to viewBox).
  // The figure sits roughly between y=42 (arm tips) and y=210 (leg base).
  const FIG = {
    headCy: 65,
    headR:  8,
    armLeftTip:  { x: 80,  y: 42 },
    armRightTip: { x: 160, y: 42 },
    armJunction: { x: 120, y: 90 },
    bodyMidTop:    120,   // y where upper body ends / diamond begins
    diamondTopY:   120,
    diamondMidY:   142,   // half-height
    diamondBottomY:166,
    diamondHalfW:  14,
    bodyMidBottom: 180,   // y where lower body ends / legs begin (rise)
    legArcPeakY:   180,   // top of the inverted-U arc
    legLeftX:      78,
    legRightX:    162,
    legBottomY:   212,
  };

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width={size}
      height={size}
      role="img"
      aria-label="شعار علم تأويل الرؤى"
      className={className}
    >
      {withRing && (
        <g>
          {/* Crescent on the LEFT — open semi-circle (opens right) */}
          <path
            d={`M ${CX} 30
                C 56 30, 24 70, 24 ${CY}
                C 24 170, 56 210, ${CX} 210`}
            fill="none"
            stroke={c}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Decorative whisker at the bottom of the crescent (stem-like) */}
          <path
            d={`M ${CX} 210 q 4 6 -2 14 q -2 4 4 6`}
            fill="none"
            stroke={c}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Sun/leaf rays on the right — 9 almond shapes radiating outward,
              each rotated around (CX,CY) and translated to the rim. */}
          {[
            { a: -82, len: 50 },
            { a: -62, len: 60 },
            { a: -42, len: 66 },
            { a: -22, len: 70 },
            { a:  -2, len: 72 },
            { a:  18, len: 70 },
            { a:  38, len: 66 },
            { a:  58, len: 60 },
            { a:  78, len: 50 },
          ].map(({ a, len }, i) => (
            <g key={i} transform={`rotate(${a} ${CX} ${CY}) translate(${CX} ${CY - 88})`}>
              {/* Pointed almond / leaf — base at (0,0), tip at (0,-len). */}
              <path
                d={`M 0 0
                    C -6 -${len * 0.3}, -6 -${len * 0.7}, 0 -${len}
                    C 6 -${len * 0.7},  6 -${len * 0.3},  0 0
                    Z`}
                fill={c}
              />
            </g>
          ))}
        </g>
      )}

      {/* ─────────── Yaz human figure (centered on CX) ─────────── */}
      <g
        stroke={c}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Head — small solid disc */}
        <circle cx={CX} cy={FIG.headCy} r={FIG.headR} fill={c} stroke="none" />

        {/* Arms — two strokes from the junction going up & out */}
        <path d={`M ${FIG.armJunction.x} ${FIG.armJunction.y} L ${FIG.armLeftTip.x}  ${FIG.armLeftTip.y}`} />
        <path d={`M ${FIG.armJunction.x} ${FIG.armJunction.y} L ${FIG.armRightTip.x} ${FIG.armRightTip.y}`} />

        {/* Upper body */}
        <path d={`M ${CX} ${FIG.armJunction.y} L ${CX} ${FIG.diamondTopY}`} />

        {/* Diamond mid-joint (solid) */}
        <path
          d={`M ${CX} ${FIG.diamondTopY}
              L ${CX + FIG.diamondHalfW} ${FIG.diamondMidY}
              L ${CX} ${FIG.diamondBottomY}
              L ${CX - FIG.diamondHalfW} ${FIG.diamondMidY} Z`}
          fill={c}
        />

        {/* Lower body */}
        <path d={`M ${CX} ${FIG.diamondBottomY} L ${CX} ${FIG.bodyMidBottom}`} />

        {/* Legs — inverted U: two verticals connected by an arched top */}
        <path
          d={`M ${FIG.legLeftX}  ${FIG.legBottomY}
              L ${FIG.legLeftX}  ${FIG.legArcPeakY + 30}
              Q ${CX} ${FIG.legArcPeakY - 8}, ${FIG.legRightX} ${FIG.legArcPeakY + 30}
              L ${FIG.legRightX} ${FIG.legBottomY}`}
        />
      </g>
    </svg>
  );
}
