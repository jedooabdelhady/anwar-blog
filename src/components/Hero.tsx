import Logo from "./Logo";

type Props = {
  title: string;
  /** Subtitle is intentionally unused in the new layout — kept in the
   *  schema for future use but no longer rendered in the hero band. */
  subtitle?: string;
};

export default function Hero({ title }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-2 pb-6">
      {/* Brown banner — no text inside, just a faded watermark of the
          full brand mark (crescent + sun + yaz). */}
      <div
        className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] h-[200px] sm:h-[260px] flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #8B6849 0%, #966F4F 50%, #8B6849 100%)",
        }}
        aria-hidden
      >
        {/* Soft inner highlight (top-right) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 80% 20%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />

        {/* Transparent watermark logo — large, low opacity, no background */}
        <div className="opacity-25 sm:opacity-30">
          <Logo
            size={220}
            variant="clay"
            className="sm:!w-[280px] sm:!h-[280px]"
          />
        </div>
      </div>

      {/* Small heading below the banner */}
      <h1 className="text-center mt-5 sm:mt-6 text-base sm:text-lg font-bold text-pepper">
        {title}
      </h1>
    </section>
  );
}
