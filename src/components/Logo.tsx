/**
 * Brand mark — wraps the client-supplied PNG files in `public/logos/`.
 *
 *   public/logos/full.png    — crescent + sun + yaz figure
 *   public/logos/figure.png  — yaz figure only (used in cards / icons)
 *
 * We render the PNG as a CSS mask so the visible color is driven by
 * the `variant` prop (matching the existing palette), while the shape
 * remains pixel-perfect to the file the client uploaded.
 */
type LogoProps = {
  size?: number;
  variant?: "pepper" | "sienna" | "gum" | "oak" | "clay";
  /** true → full mark (crescent + leaves), false → yaz figure only */
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

export default function Logo({
  size = 56,
  variant = "pepper",
  withRing = true,
  className,
}: LogoProps) {
  const c = COLOR[variant];
  const src = withRing ? "/logos/full.png" : "/logos/figure.png";

  return (
    <span
      role="img"
      aria-label="شعار علم تأويل الرؤى"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: c,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
