import PageShell from "@/components/PageShell";

export const metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-10 prose-anwar">
        <h1 className="text-3xl font-bold text-pepper mb-6">سياسة الخصوصية</h1>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">البيانات التي نجمعها</h2>
        <p className="text-pepper/85 leading-loose mb-4">
          نجمع فقط البيانات التي ترسلها طوعاً عبر نماذج التواصل: الاسم، البريد الإلكتروني، رقم
          الهاتف (اختياري)، الموضوع، والرسالة.
        </p>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">كيف نستخدم بياناتك</h2>
        <ul className="list-disc pe-6 text-pepper/85 leading-loose mb-4 space-y-1">
          <li>الرد على رسائلك واستفساراتك.</li>
          <li>تحسين خدماتنا ومحتوى الموقع.</li>
          <li>أرشفة المراسلات للرجوع إليها لاحقاً.</li>
        </ul>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">مشاركة البيانات</h2>
        <p className="text-pepper/85 leading-loose mb-4">
          لا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية. نستخدم خدمات مزودة (مثل Sanity للحفظ
          و Resend لإرسال الإشعارات) ضمن الحدود اللازمة لتشغيل الموقع فقط.
        </p>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">حقوقك</h2>
        <p className="text-pepper/85 leading-loose">
          يحق لك طلب الاطلاع على بياناتك المخزّنة أو حذفها في أي وقت عبر التواصل معنا.
        </p>
      </article>
    </PageShell>
  );
}
