import PageShell from "@/components/PageShell";

export const metadata = { title: "عن الشركة" };

export default function AboutPage() {
  return (
    <PageShell active="/about">
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-pepper mb-6">عن تأويل الرؤى</h1>
        <p className="text-pepper/85 leading-loose mb-4">
          تأويل الرؤى مساحة عربية تجمع بين علم التفسير والمعرفة الثرية، تقدّم محتوى متخصصاً
          يساعدك على فهم ما يدور حولك من رؤى وأحلام، مع نوافذ على تطوير الذات والإلهام.
          هدفنا أن نكون مرجعاً موثوقاً للباحثين عن المعنى والمعرفة.
        </p>
        <p className="text-pepper/85 leading-loose mb-4">
          نؤمن أن المحتوى الجيد يبدأ من المصدر الصحيح، ولذلك نختار مقالاتنا بعناية
          ونشارك فيها معارف موثّقة ودروساً عملية تساعدك على اتخاذ قرارات أفضل في حياتك.
        </p>
        <p className="text-pepper/85 leading-loose">
          نرحّب بمشاركاتكم: رؤاكم العامة لتحسين خدماتنا، رؤاكم الخاصة لمناقشتها معكم،
          أو أي استفسار يخطر ببالكم.
        </p>
      </article>
    </PageShell>
  );
}
