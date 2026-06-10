import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import Logo from "@/components/Logo";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="" />
      <main className="mx-auto max-w-lg px-5 sm:px-8 py-10 sm:py-14">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={64} variant="sienna" />
          </div>
          <h1 className="text-3xl font-bold text-pepper">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-pepper/75 leading-loose text-[15px]">{subtitle}</p>
          )}
        </header>
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
          {children}
        </div>
        {footer && (
          <div className="mt-6 text-center text-sm text-pepper/70">{footer}</div>
        )}
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
