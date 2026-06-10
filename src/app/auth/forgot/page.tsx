import ForgotForm from "./ForgotForm";
import AuthShell from "@/components/auth/AuthShell";
import Link from "next/link";

export const metadata = {
  title: "استرداد كلمة المرور",
  description: "أرسل رابط استرداد كلمة المرور إلى بريدك.",
  robots: { index: false, follow: false },
};

export default function ForgotPage() {
  return (
    <AuthShell
      title="استرداد كلمة المرور"
      subtitle="أدخل بريدك أو اسم المستخدم، وسنرسل لك رابط إعادة تعيين كلمة المرور."
      footer={
        <>
          تذكّرت كلمة المرور؟{" "}
          <Link href="/auth/login" className="text-sienna font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
