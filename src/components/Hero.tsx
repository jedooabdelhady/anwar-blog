import Logo from "./Logo";

type Props = {
  title: string;
  /** Subtitle is intentionally unused — kept in schema for future use. */
  subtitle?: string;
};

export default function Hero({ title }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-2 pb-4">
      {/* Visually-hidden H1 for SEO + screen readers (mockup has no visible title) */}
      <h1 className="sr-only">{title}</h1>

      {/* Brown banner — logo watermark anchored to the RIGHT, matching the
          client's approved mockup. No text inside or below. */}
      <div
        className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] h-[200px] sm:h-[260px]"
        style={{
          background:
            "linear-gradient(135deg, #8B6849 0%, #966F4F 50%, #8B6849 100%)",
        }}
        aria-hidden
      >
        {/* Soft inner highlight (top-right glow) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 80% 20%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />

        {/* Watermark logo, right-anchored. RTL → ms-auto/right behaviour;
            using absolute right placement for precise control on both LTR
            and RTL containers. */}
        <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 opacity-40">
          <Logo
            size={170}
            variant="clay"
            className="sm:!w-[230px] sm:!h-[230px]"
          />
        </div>
      </div>
    </section>
  );
}
