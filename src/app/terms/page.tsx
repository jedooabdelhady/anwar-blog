import PageShell from "@/components/PageShell";

export const metadata = { title: "الشروط والأحكام" };

const SECTIONS = [
  {
    heading: "الموافقة والإقرار",
    body:
      "استخدامك وتصفحك لهذا الموقع يعني قبولك التام والملزم بجميع الشروط الواردة فيه. في حال عدم موافقتك على أي بند، يرجى التوقف فوراً عن استخدام الموقع وخدماتنا.",
  },
  {
    heading: "الملكية الفكرية وحقوق النشر",
    body:
      "كافة محتويات الموقع (وتشمل النصوص، الصور، الشعارات، والتصاميم) هي ملكية حصرية ومنفردة لمنصة \"علم تأويل الرؤى\". ويُحظر تماماً إعادة نشرها، نسخها، أو استغلالها تجارياً بأي شكل من الأشكال دون الحصول على إذن خطي مسبق منا.",
  },
  {
    heading: "البيانات والنماذج الإلكترونية",
    body:
      "عند إرسال استفساراتك أو رؤاك عبر النماذج المتاحة، فإنك تمنحنا الحق في استخدام البيانات المدخلة للرد عليك وتطوير جودة الخدمة. ونحن نلتزم بخصوصيتك التامة؛ حيث لن يتم مشاركة معلوماتك أو بيعها لأي طرف ثالث تحت أي ظرف.",
  },
  {
    heading: "التحديثات الدورية",
    body:
      "نحتفظ بالحق الكامل في تعديل هذه الشروط أو تحديثها في أي وقت تماشياً مع تطوير خدماتنا. وتقع على عاتق المستخدم مسؤولية مراجعة هذه الصفحة دورياً للاطلاع على كل جديد.",
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-pepper mb-5">
          الشروط والأحكام
        </h1>

        {/* Intro — slightly darker / semibold to give it visual weight */}
        <p className="text-pepper font-semibold leading-loose mb-8 text-[15.5px] sm:text-base">
          مرحباً بكم في منصة &quot;علم تأويل الرؤى&quot;. تُنظم هذه الوثيقة
          العلاقة القانونية بين المنصة ومستخدميها؛ لذا يرجى قراءتها بعناية.
        </p>

        {/* Sections with • bullet + dark brown headings */}
        <ul className="space-y-7 list-none p-0">
          {SECTIONS.map((s, i) => (
            <li key={i}>
              <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-start gap-2"
                  style={{ color: "#38261C" }}>
                <span aria-hidden style={{ color: "#6B3F23" }}>•</span>
                <span>{s.heading}:</span>
              </h2>
              <p className="text-pepper/85 leading-loose ps-5">
                {s.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-pepper/70 text-sm italic">
          يسري العمل بهذه الشروط فور نشره.
        </p>
      </article>
    </PageShell>
  );
}
