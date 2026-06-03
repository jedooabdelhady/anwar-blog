/**
 * Placeholder seed data for the blog grid before Sanity CMS is wired up.
 * Once Sanity is connected, the same shape is fetched from Sanity Studio.
 */
export type PostCategory =
  | "business"
  | "marketing"
  | "entrepreneurship"
  | "self-development"
  | "inspiration"
  | "news";

export const CATEGORIES: Record<
  PostCategory,
  { label: string; slug: string }
> = {
  "business":         { label: "إدارة الأعمال",  slug: "business" },
  "marketing":        { label: "التسويق الرقمي", slug: "marketing" },
  "entrepreneurship": { label: "نصائح ريادية",   slug: "entrepreneurship" },
  "self-development": { label: "تطوير الذات",    slug: "self-development" },
  "inspiration":      { label: "أفكار ملهمة",    slug: "inspiration" },
  "news":             { label: "أحدث الأخبار",   slug: "news" },
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  image: string;     // remote URL or /public path
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  body: string;
};

export const POSTS: Post[] = [
  {
    slug: "business-1",
    title: "إدارة الأعمال",
    excerpt:
      "خطوات عملية لقيادة فريقك نحو نتائج أفضل عبر تنظيم العمليات ووضوح الأهداف.",
    category: "business",
    image: "/categories/business.svg",
    publishedAt: "2026-01-15",
    readingTime: 4,
    body:
      "إدارة الأعمال علم وفن في آنٍ واحد. هي عملية تنسيق الموارد البشرية والمادية والمالية لتحقيق أهداف المنظمة بأقصى كفاءة ممكنة. في هذه المقالة نستعرض المبادئ الأساسية التي يحتاجها كل مدير ناجح.",
  },
  {
    slug: "marketing-1",
    title: "التسويق الرقمي",
    excerpt:
      "كيف تبني حضوراً رقمياً قوياً يحول الزوار إلى عملاء دائمين عبر القنوات المناسبة.",
    category: "marketing",
    image: "/categories/marketing.svg",
    publishedAt: "2026-02-04",
    readingTime: 5,
    body:
      "التسويق الرقمي ليس مجرد إعلانات على وسائل التواصل، بل منظومة متكاملة تبدأ من فهم الجمهور وتنتهي بقياس الأثر. سنتعرّف على القنوات الأهم وكيفية بناء قمع تسويقي فعّال.",
  },
  {
    slug: "entrepreneurship-1",
    title: "نصائح ريادية",
    excerpt:
      "نصائح ذهبية للريادي العربي تساعدك على تجنب الأخطاء الشائعة في بداية الطريق.",
    category: "entrepreneurship",
    image: "/categories/entrepreneurship.svg",
    publishedAt: "2026-02-20",
    readingTime: 6,
    body:
      "بداية المشروع هي أصعب مرحلة في رحلة الريادي. هنا نشارك أهم الدروس المستفادة من قصص نجاح وفشل لنساعدك على اتخاذ قرارات أفضل في رحلتك.",
  },
  {
    slug: "self-development-1",
    title: "تطوير الذات",
    excerpt:
      "عادات بسيطة يومية تصنع فارقاً كبيراً في حياتك المهنية والشخصية على المدى البعيد.",
    category: "self-development",
    image: "/categories/self-development.svg",
    publishedAt: "2026-03-08",
    readingTime: 4,
    body:
      "تطوير الذات ليس حدثاً واحداً بل رحلة مستمرة. النمو الحقيقي يأتي من عادات يومية صغيرة تتراكم لتصنع نسخة أفضل من نفسك.",
  },
  {
    slug: "inspiration-1",
    title: "أفكار ملهمة",
    excerpt:
      "قصص ومواقف ملهمة من واقع رياديين عرب نجحوا في تحويل أفكارهم البسيطة إلى مشاريع حقيقية.",
    category: "inspiration",
    image: "/categories/inspiration.svg",
    publishedAt: "2026-03-22",
    readingTime: 3,
    body:
      "الإلهام لا يأتي من العدم. إنه يأتي عندما تكون عيناك مفتوحتين على ما حولك. في هذه المقالة قصص حقيقية عن بدايات صنعت نجاحات.",
  },
  {
    slug: "news-1",
    title: "أحدث الأخبار",
    excerpt:
      "آخر التطورات في عالم الأعمال والتقنية التي يحتاج كل ريادي عربي أن يكون على اطلاع بها.",
    category: "news",
    image: "/categories/news.svg",
    publishedAt: "2026-04-02",
    readingTime: 3,
    body:
      "نُلخّص لكم أهم الأحداث الأسبوعية في عالم ريادة الأعمال والتقنية في الوطن العربي مع تحليل سريع لتأثيرها على الأسواق المحلية.",
  },
];
