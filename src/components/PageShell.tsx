import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";

export default function PageShell({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active={active} />
      <main>{children}</main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
