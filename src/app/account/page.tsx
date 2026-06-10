import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getCurrentUser } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { getSubmissionsForUser } from "@/lib/auth/submissions";
import { Mail, MessageSquare, Settings, ArrowLeft } from "lucide-react";
import VerifyBanner from "./VerifyBanner";

export const metadata = {
  title: "حسابي",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountHome() {
  const session = await getCurrentUser();
  if (!session) redirect("/auth/login?next=/account");

  const [user, subs] = await Promise.all([
    findById(session.userId),
    getSubmissionsForUser(session.userId),
  ]);
  if (!user) redirect("/auth/login");

  const lastThree = subs.slice(0, 3);

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="" />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-sm text-pepper/60 mb-1">مرحباً بك</p>
          <h1 className="text-3xl font-bold text-pepper">
            {user.displayName || user.username}
          </h1>
          <p className="mt-1 text-pepper/75 text-sm" dir="ltr" style={{ textAlign: "right" }}>
            {user.email}
          </p>
        </header>

        {!user.emailVerified && <VerifyBanner />}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Tile
            href="/account/inquiries"
            icon={<MessageSquare size={22} />}
            title="رسائلي ورؤاي"
            subtitle={`${subs.length} رسالة`}
          />
          <Tile
            href="/account/settings"
            icon={<Settings size={22} />}
            title="الإعدادات"
            subtitle="البيانات وكلمة المرور"
          />
          <Tile
            href="/services"
            icon={<Mail size={22} />}
            title="رسالة جديدة"
            subtitle="ابعث استفسارك أو رؤياك"
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-pepper">آخر رسائلك</h2>
            {subs.length > 0 && (
              <Link
                href="/account/inquiries"
                className="inline-flex items-center gap-1 text-sm text-sienna hover:underline"
              >
                عرض الكل <ArrowLeft size={14} />
              </Link>
            )}
          </div>

          {lastThree.length === 0 ? (
            <div className="rounded-3xl border border-line bg-card p-8 text-center">
              <p className="text-pepper font-bold mb-2">لا توجد رسائل بعد</p>
              <p className="text-pepper/70 text-sm mb-4">
                ابعث رؤياك أو استفسارك من بوابة التساؤل.
              </p>
              <Link
                href="/services"
                className="inline-block rounded-full px-6 py-2.5 bg-sienna text-white text-sm font-medium hover:bg-pepper transition-colors"
              >
                بَوّابةُ التَّساؤُل
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {lastThree.map((s) => (
                <li key={s._id}>
                  <SubmissionRow s={s} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}

function Tile({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-3xl border border-line bg-card p-5 hover:border-sienna transition-colors"
    >
      <div className="text-sienna mb-2">{icon}</div>
      <p className="font-bold text-pepper">{title}</p>
      <p className="text-xs text-pepper/65 mt-1">{subtitle}</p>
    </Link>
  );
}

const KIND_LABEL: Record<string, string> = {
  "public-vision": "رؤية عامة",
  "private-vision": "رؤية خاصة",
  "inquiry": "تساؤل واستعلام",
};

function SubmissionRow({
  s,
}: {
  s: {
    _id: string;
    kind?: string;
    subject?: string;
    message?: string;
    createdAt?: string;
    status?: string;
    accessToken?: string;
    replyMessage?: string;
  };
}) {
  const href = s.accessToken ? `/inquiry/${s.accessToken}` : "#";
  const date = s.createdAt
    ? new Date(s.createdAt).toLocaleDateString("ar", {
        dateStyle: "medium",
      })
    : "";
  const replied = Boolean(s.replyMessage);
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-line bg-card p-4 hover:border-sienna transition-colors"
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="text-xs text-pepper/60">
          {KIND_LABEL[s.kind || ""] || s.kind || "رسالة"} • {date}
        </span>
        <span
          className={
            replied
              ? "text-xs px-2 py-0.5 rounded-full bg-[#e6efdd] text-[#3f6a2f] border border-[#c5d8b9]"
              : "text-xs px-2 py-0.5 rounded-full bg-clay text-pepper border border-line"
          }
        >
          {replied ? "تم الرد" : "بانتظار الرد"}
        </span>
      </div>
      {s.subject && (
        <p className="font-bold text-pepper text-sm mb-1">{s.subject}</p>
      )}
      <p className="text-pepper/80 text-sm line-clamp-2">{s.message}</p>
    </Link>
  );
}
