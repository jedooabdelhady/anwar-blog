import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import Logo from "@/components/Logo";

type Props = {
  title: string;
  subtitle?: string;
  iconVariant?: "pepper" | "sienna" | "gum" | "oak";
  children: React.ReactNode;
};

export default function FormPageShell({
  title,
  subtitle,
  iconVariant = "sienna",
  children,
}: Props) {
  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="/contact" />
      <main>
        <section className="mx-auto max-w-2xl px-5 sm:px-8 py-10">
          <header className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size={72} variant={iconVariant} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-pepper">{title}</h1>
            {subtitle && (
              <p className="mt-4 text-pepper/80 max-w-2xl mx-auto leading-loose text-[15px] sm:text-base text-right">
                {subtitle}
              </p>
            )}
          </header>
          {children}
        </section>
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
