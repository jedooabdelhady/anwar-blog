import PageShell from "@/components/PageShell";

export const metadata = { title: "عن الشركة" };

export default function AboutPage() {
  return (
    <PageShell active="/about">
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-pepper mb-6">عن أنوار</h1>
        <p className="text-pepper/85 leading-loose mb-4">
          أنوار مساحة عربية أنيقة تقدّم محتوى متخصصاً في إدارة الأعمال، التسويق
          الرقمي، نصائح ريادية، تطوير الذات، والأفكار الملهمة. هدفنا أن نكون
          مرجعاً يومياً للمحترفين والرياديين الذين يسعون للنمو المستمر.
        </p>
        <p className="text-pepper/85 leading-loose mb-4">
          نؤمن أن المحتوى الجيد يبدأ من المصدر الصحيح، ولذلك نختار مقالاتنا
          بعناية ونشارك فيها تجارب حقيقية ودروساً عملية تساعدك على اتخاذ قرارات
          أفضل في عملك وحياتك.
        </p>
        <p className="text-pepper/85 leading-loose">
          نرحّب بمشاركاتكم: رؤاكم العامة لتحسين خدماتنا، رؤاكم الخاصة لمناقشة
          مشاريعكم، أو أي استفسار يخطر ببالكم.
        </p>
      </article>
    </PageShell>
  );
}
