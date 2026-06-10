import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getCurrentUser } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import SettingsForm from "./SettingsForm";
import LogoutButton from "./LogoutButton";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "الإعدادات",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getCurrentUser();
  if (!session) redirect("/auth/login?next=/account/settings");
  const user = await findById(session.userId);
  if (!user) redirect("/auth/login");

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="" />
      <main className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-14">
        <header className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-sm text-sienna hover:underline mb-3"
          >
            <ArrowRight size={14} />
            حسابي
          </Link>
          <h1 className="text-3xl font-bold text-pepper">الإعدادات</h1>
        </header>

        <SettingsForm
          initialDisplayName={user.displayName || user.username}
          initialPhone={user.phone || ""}
          username={user.username}
          email={user.email}
        />

        <div className="mt-8 pt-6 border-t border-line text-center">
          <LogoutButton />
        </div>
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
