import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getCurrentUser } from "@/lib/auth/session";
import { getSubmissionsForUser } from "@/lib/auth/submissions";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "رسائلي ورؤاي",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  "public-vision": "رؤية عامة",
  "private-vision": "رؤية خاصة",
  "inquiry": "تساؤل واستعلام",
};

export default async function MyInquiries() {
  const session = await getCurrentUser();
  if (!session) redirect("/auth/login?next=/account/inquiries");

  const subs = await getSubmissionsForUser(session.userId);

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="" />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
        <header className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-sm text-sienna hover:underline mb-3"
          >
            <ArrowRight size={14} />
            حسابي
          </Link>
          <h1 className="text-3xl font-bold text-pepper">رسائلي ورؤاي</h1>
          <p className="mt-1 text-pepper/70 text-sm">
            كل رسالة بعثتها — مع حالتها والرد عليها.
          </p>
        </header>

        {subs.length === 0 ? (
          <div className="rounded-3xl border border-line bg-card p-10 text-center">
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
            {subs.map((s) => {
              const href = s.accessToken ? `/inquiry/${s.accessToken}` : "#";
              const date = s.createdAt
                ? new Date(s.createdAt).toLocaleDateString("ar", {
                    dateStyle: "medium",
                  })
                : "";
              const replied = Boolean(s.replyMessage);
              return (
                <li key={s._id}>
                  <Link
                    href={href}
                    className="block rounded-2xl border border-line bg-card p-4 sm:p-5 hover:border-sienna transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5">
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
                      <p className="font-bold text-pepper text-sm mb-1">
                        {s.subject}
                      </p>
                    )}
                    <p className="text-pepper/80 text-sm line-clamp-2">
                      {s.message}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
