import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-2 pb-10">
      <div
        className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] px-8 sm:px-12 py-14 sm:py-20"
        style={{
          // Warm caramel brown — matches client's approved mockup
          background:
            "linear-gradient(135deg, #8B6849 0%, #966F4F 50%, #8B6849 100%)",
        }}
      >
        {/* Decorative oversized logo (background) */}
        <div
          aria-hidden
          className="absolute -left-4 sm:left-6 top-1/2 -translate-y-1/2 opacity-90"
        >
          <Logo size={260} variant="clay" />
        </div>

        {/* Soft inner highlight */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[32px] sm:rounded-[40px] pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 80% 20%, rgba(255,255,255,0.08), transparent 60%)",
          }}
        />

        {/* Text content (RTL → starts on right) */}
        <div className="relative z-10 max-w-2xl text-right text-clay">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            مرحباً بك في أنوار
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-clay/90 leading-relaxed">
            مساحة عربية أنيقة للأفكار الملهمة، المحتوى الريادي، وقصص النمو
            الشخصي والمهني. اقرأ، شاركنا رؤيتك، وكن جزءاً من المجتمع.
          </p>
        </div>
      </div>
    </section>
  );
}
