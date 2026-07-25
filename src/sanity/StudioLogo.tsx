"use client";

/**
 * Studio navbar logo. Self-contained on purpose: the Studio is now built
 * standalone by `sanity build` (Vite, not Next), so it can't use the
 * Next `@/` path alias or read files from the site's `public/` folder.
 * We inline the same CSS-mask mark the site uses and point it at the
 * logo on the live site via an absolute URL so it renders on
 * sahaarr299.sanity.studio too.
 */
export function StudioLogo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "4px 8px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <span
        role="img"
        aria-label="شعار علم تأويل الرؤى"
        style={{
          display: "inline-block",
          width: 28,
          height: 28,
          backgroundColor: "#6B3F23",
          WebkitMaskImage: "url(https://sahaarr299.com/logos/full.png)",
          maskImage: "url(https://sahaarr299.com/logos/full.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <span
        style={{
          fontWeight: 700,
          fontSize: "15px",
          color: "#38261C",
          letterSpacing: "0.5px",
        }}
      >
        علم تأويل الرؤى
      </span>
    </div>
  );
}
