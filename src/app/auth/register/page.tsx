import RegisterForm from "./RegisterForm";
import AuthShell from "@/components/auth/AuthShell";
import Link from "next/link";

export const metadata = {
  title: "إنشاء حساب جديد",
  description: "أنشئ حساباً للتواصل ومتابعة محادثاتك مع علم تأويل الرؤى.",
  robots: { index: false, follow: false },
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next || "/account";
  return (
    <AuthShell
      title="إنشاء حساب"
      subtitle="حسابك يحفظ رؤاك ورسائلك، ويتيح لك العودة لمحادثاتك في أي وقت."
      footer={
        <>
          لديك حساب؟{" "}
          <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="text-sienna font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <RegisterForm next={next} />
    </AuthShell>
  );
}
