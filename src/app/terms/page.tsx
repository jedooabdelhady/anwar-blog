import PageShell from "@/components/PageShell";

export const metadata = { title: "الشروط والأحكام" };

export default function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-10 prose-anwar">
        <h1 className="text-3xl font-bold text-pepper mb-6">الشروط والأحكام</h1>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">1. القبول بالشروط</h2>
        <p className="text-pepper/85 leading-loose mb-4">
          باستخدامك لهذا الموقع فإنك توافق على الالتزام بهذه الشروط والأحكام كاملةً. إذا كنت لا توافق
          على أي جزء منها فالرجاء التوقف عن استخدام الموقع.
        </p>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">2. الملكية الفكرية</h2>
        <p className="text-pepper/85 leading-loose mb-4">
          جميع المحتويات (نصوص، صور، شعارات، تصميمات) ملك حصري لـ "تأويل الرؤى". لا يُسمح بإعادة النشر أو
          النسخ التجاري بدون إذن خطي مسبق.
        </p>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">3. النماذج والرسائل</h2>
        <p className="text-pepper/85 leading-loose mb-4">
          عند إرسالك أي نموذج (رؤى/استفسارات) فإنك تمنحنا الإذن باستخدام البيانات للرد عليك وتحسين
          الخدمة. لن نشارك بياناتك مع أي طرف ثالث.
        </p>

        <h2 className="text-xl font-bold text-pepper mt-6 mb-3">4. تعديلات</h2>
        <p className="text-pepper/85 leading-loose">
          نحتفظ بحقّ تعديل هذه الشروط في أي وقت، ويُفترض اطلاعك عليها دورياً.
        </p>
      </article>
    </PageShell>
  );
}
