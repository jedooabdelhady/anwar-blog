import LoginForm from "./LoginForm";
import AuthShell from "@/components/auth/AuthShell";
import Link from "next/link";

export const metadata = {
  title: "تسجيل الدخول",
  description: "ادخل لحسابك لمتابعة رؤاك والتواصل.",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next || "/account";
  return (
    <AuthShell
      title="تسجيل الدخول"
      subtitle="ادخل باسم المستخدم أو البريد الإلكتروني."
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link
            href={`/auth/register?next=${encodeURIComponent(next)}`}
            className="text-sienna font-medium hover:underline"
          >
            أنشئ حساباً
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
