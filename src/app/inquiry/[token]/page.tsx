import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { writeClient } from "@/sanity/lib/client";
import { sanityConfigured } from "@/sanity/env";

export const metadata = {
  title: "محادثتك",
  description: "عرض رسالتك وردّ المسؤول.",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

type Sub = {
  _id: string;
  name?: string;
  kind?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
  replyMessage?: string;
  replySentAt?: string;
  status?: string;
};

const KIND_LABEL: Record<string, string> = {
  "public-vision":  "رؤية عامة",
  "private-vision": "رؤية خاصة",
  "inquiry":        "تساؤل واستعلام",
};

async function getSubmissionByToken(token: string): Promise<Sub | null> {
  if (!sanityConfigured) return null;
  // accessToken is a UUID v4 — reject anything that isn't shaped like one
  // so we never hit Sanity with garbage paths.
  if (!/^[a-f0-9-]{20,60}$/i.test(token)) return null;
  try {
    return await writeClient.fetch<Sub | null>(
      `*[_type == "submission" && accessToken == $token][0]{
        _id, name, kind, subject, message, createdAt,
        replyMessage, replySentAt, status
      }`,
      { token },
      { next: { revalidate: 0 } }
    );
  } catch (err) {
    console.warn("[inquiry] fetch failed:", err);
    return null;
  }
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("ar", {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const sub = await getSubmissionByToken(token);
  if (!sub) notFound();

  const sentDate   = formatDate(sub.createdAt);
  const repliedDate = formatDate(sub.replySentAt);
  const hasReply = Boolean(sub.replyMessage && sub.replySentAt);

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="" />
      <main className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-14">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-line text-xs text-pepper/70 mb-4">
            <MessageSquare size={14} />
            {KIND_LABEL[sub.kind || ""] || "رسالة"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-pepper">محادثتك</h1>
          <p className="mt-2 text-sm text-pepper/60">{sentDate}</p>
        </header>

        {/* Original message */}
        <section className="rounded-3xl border border-line bg-card p-6 sm:p-8 mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-pepper/50 mb-3">
            رسالتك
          </div>
          {sub.name && (
            <div className="text-sm text-pepper/70 mb-2">من: {sub.name}</div>
          )}
          {sub.subject && (
            <div className="font-bold text-pepper mb-3">{sub.subject}</div>
          )}
          <div className="text-pepper/85 leading-loose whitespace-pre-wrap">
            {sub.message}
          </div>
        </section>

        {/* Reply or pending state */}
        {hasReply ? (
          <section
            className="rounded-3xl border-2 p-6 sm:p-8"
            style={{ borderColor: "#6B3F23", background: "#f7f1ea" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} style={{ color: "#5e8a4f" }} />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#6B3F23" }}
              >
                ردّ المسؤول
              </span>
            </div>
            <div className="text-pepper leading-loose whitespace-pre-wrap mb-5">
              {sub.replyMessage}
            </div>
            <div className="text-xs text-pepper/50 border-t border-line pt-3">
              أُرسل في {repliedDate}
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-line bg-card p-6 sm:p-8 text-center">
            <Clock
              size={36}
              className="mx-auto mb-3"
              style={{ color: "#B0997D" }}
            />
            <p className="text-pepper font-bold mb-1">لم يَرِد الرد بعد</p>
            <p className="text-pepper/70 text-sm leading-loose">
              وصلت رسالتك وسنردّ عليك في أقرب فرصة، وستصلك نسخة من الرد عبر
              البريد الإلكتروني، كما يظهر هنا في هذه الصفحة.
            </p>
          </section>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-pepper/50">
            احفظ هذا الرابط لمتابعة المحادثة لاحقًا.
          </p>
        </div>
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
