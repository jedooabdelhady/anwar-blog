import Link from "next/link";
import Logo from "./Logo";
import type { CardCopy } from "@/sanity/lib/settings";

type CardLook = {
  iconVariant: "pepper" | "sienna" | "gum" | "oak";
  cardBg: string;
  btnBg: string;
  btnHover: string;
  href: string;
};

const LOOK: Record<"cardPublic" | "cardPrivate" | "cardInquiry", CardLook> = {
  cardPublic: {
    iconVariant: "gum",
    cardBg: "#F0EBE0",
    btnBg: "#8F8C78",
    btnHover: "#75725f",
    href: "/forms/public-vision",
  },
  cardPrivate: {
    iconVariant: "sienna",
    cardBg: "#EDDFD2",
    btnBg: "#6B3F23",
    btnHover: "#5a341c",
    href: "/forms/private-vision",
  },
  cardInquiry: {
    iconVariant: "oak",
    cardBg: "#E8DDD0",
    btnBg: "#7a5c43",
    btnHover: "#664a35",
    href: "/forms/inquiry",
  },
};

/**
 * Card title — first word ("بوابة") rendered extra-bold, preceded by
 * a red dotted-circle (◌, U+25CC) ornament. No side dashes — they
 * forced the title onto two lines on small screens.
 */
function CardTitle({ children }: { children: string }) {
  const parts = children.trim().split(/\s+/);
  const head = parts[0];
  const tail = parts.slice(1).join(" ");
  return (
    <h3 className="text-center text-lg sm:text-xl text-pepper leading-tight">
      <span
        aria-hidden
        className="me-2 align-middle"
        style={{ color: "#b03a2e", fontSize: "0.85em", letterSpacing: 0 }}
      >
        ◌
      </span>
      <strong className="font-extrabold">{head}</strong>
      {tail ? ` ${tail}` : ""}
    </h3>
  );
}

/** First word of the body bolded, matching the mockup. */
function CardBody({ children }: { children: string }) {
  const text = children.trim();
  const i = text.indexOf(" ");
  const head = i === -1 ? text : text.slice(0, i);
  const tail = i === -1 ? "" : text.slice(i);
  return (
    <p className="text-pepper/85 text-[15px] sm:text-base leading-relaxed mb-7 min-h-[3.2em]">
      <strong className="font-bold text-pepper">{head}</strong>
      {tail}
    </p>
  );
}

type Props = {
  cardPublic: CardCopy;
  cardPrivate: CardCopy;
  cardInquiry: CardCopy;
};

export default function ThreeCards({
  cardPublic,
  cardPrivate,
  cardInquiry,
}: Props) {
  const cards = [
    { ...cardPublic,  look: LOOK.cardPublic  },
    { ...cardPrivate, look: LOOK.cardPrivate },
    { ...cardInquiry, look: LOOK.cardInquiry },
  ];

  return (
    <section
      aria-labelledby="cards-heading"
      className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16"
    >
      <h2 id="cards-heading" className="sr-only">
        البوابات
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {cards.map((c) => (
          <article
            key={c.title}
            className="border border-line pt-14 sm:pt-16 px-7 sm:px-8 pb-8 sm:pb-10 flex flex-col items-center text-center min-h-[500px] sm:min-h-[560px] shadow-[0_1px_0_rgba(56,38,28,0.04),0_18px_32px_-22px_rgba(56,38,28,0.22)] transition-transform duration-300 hover:-translate-y-1"
            style={{
              background: c.look.cardBg,
              /* Roshn-style silhouette: only the very TOP curves into a
                 dome, then straight vertical sides, then squared base.
                 We use mixed % / px:
                   - horizontal radius = 50% so the dome spans the width
                   - vertical radius = 110px (fixed) so the arch is the
                     same height regardless of how tall the card grows,
                     leaving long straight sides below it. */
              borderRadius: "50% 50% 22px 22px / 110px 110px 22px 22px",
            }}
          >
            {/* Icon at the top — sits inside the arch */}
            <div className="mb-5 sm:mb-6">
              <Logo size={88} variant={c.look.iconVariant} withRing={false} />
            </div>

            {/* Title below the icon */}
            <CardTitle>{c.title}</CardTitle>

            {/* Body — stretches to fill remaining height so the button
                pins to the bottom of the long silhouette. */}
            <div className="flex-1 flex items-center mt-5">
              <CardBody>{c.body}</CardBody>
            </div>

            {/* Button */}
            <Link
              href={c.look.href}
              className="inline-flex items-center justify-center rounded-full px-7 py-2.5 text-white text-sm sm:text-[15px] font-medium transition-colors bg-[var(--btn)] hover:bg-[var(--btn-h)]"
              style={
                {
                  ["--btn" as string]: c.look.btnBg,
                  ["--btn-h" as string]: c.look.btnHover,
                } as React.CSSProperties
              }
            >
              {c.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
