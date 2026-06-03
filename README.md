# أنوار — مدونة احترافية

موقع مدونة بنظام إدارة محتوى (CMS) كامل، باللغة العربية بـ RTL.

## التقنيات

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Sanity CMS** — لوحة تحكم احترافية لإدارة المقالات والتصنيفات والرسائل
- **Resend** — إرسال إشعارات بريدية عند وصول رسالة جديدة
- **Vercel** — استضافة مجانية مقترحة للنشر

---

## الاستضافة — أيش أفضل خيار؟

| الخيار | السعر | الأنسب لـ | التوصية |
|--------|-------|-----------|---------|
| **Vercel** (Hobby) | **مجاني** للأبد | مشاريع شخصية وحتى متوسطة، سرعة CDN عالمية | ✅ **الأفضل والموصى به** |
| Vercel Pro | $20/شهر | عند تجاوز حدود Hobby (1TB bandwidth، إلخ) | عند الحاجة |
| Netlify | مجاني | بديل Vercel، أداء جيد | بديل صالح |
| Cloudflare Pages | مجاني | لو تريد domain على Cloudflare | بديل ممتاز |

**التوصية النهائية: Vercel مجاناً** لأن Next.js مصمم من نفس الشركة، التكامل صفر-إعدادات، نشر تلقائي مع كل push على GitHub، CDN عالمي، شهادة SSL مجانية، ودومين مجاني (`*.vercel.app`).

تكلفة Sanity أيضاً **مجانية** للبداية (3 مستخدمين، 10K مستند، 1GB bandwidth).

تكلفة Resend أيضاً **مجانية** (100 إيميل/يوم، 3000/شهر).

> **التكلفة الإجمالية للنشر: $0** حتى يكبر الموقع.

---

## خطوات النشر (8 خطوات)

### 1) أنشئ حساب Sanity

1. ادخل على [sanity.io](https://www.sanity.io) واشترك مجاناً
2. **Create new project** → اسم: `anwar-blog`
3. اختر `production` كـ dataset
4. انسخ:
   - `Project ID` (من إعدادات المشروع)
   - أنشئ `API Token` من قائمة API → Tokens → Add API token مع صلاحية **Editor**

### 2) املأ `.env.local`

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123def
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=skXXXXXXXXXXXXXXX
```

### 3) أنشئ حساب Resend (للإشعارات البريدية)

1. ادخل على [resend.com](https://resend.com) واشترك مجاناً
2. **API Keys → Create**
3. أضفه إلى `.env.local`:

```env
RESEND_API_KEY=re_XXXXXXXX
CONTACT_EMAIL_TO=jedoo.abdelhady@gmail.com
CONTACT_EMAIL_FROM=onboarding@resend.dev
```

> ملاحظة: `onboarding@resend.dev` يعمل من اليوم الأول دون تحقق نطاق. لاحقاً اربط نطاقك لإرسال من `noreply@yourdomain.com`.

### 4) ادفع الكود إلى GitHub

```bash
cd anwar-blog
git init
git add .
git commit -m "initial: anwar blog"
gh repo create anwar-blog --private --source=. --push
```

### 5) انشر على Vercel

1. ادخل [vercel.com/new](https://vercel.com/new)
2. **Import** المستودع من GitHub
3. **Environment Variables** — انسخ كل القيم من `.env.local`
4. أضف `NEXT_PUBLIC_SITE_URL` = `https://anwar-blog.vercel.app`
5. **Deploy** — انتظر دقيقتين

### 6) اربط لوحة Sanity Studio

بعد النشر، ادخل على `https://YOUR_DOMAIN/studio` — ستفتح لوحة تحكم Sanity مدمجة. سجّل دخول بحساب Sanity واستخدمها لإضافة المقالات والتصنيفات وإدارة الرسائل الواردة.

> أول مرة، اذهب إلى Sanity Manage → API → CORS Origins وأضف الدومينين: `http://localhost:3000` و `https://YOUR_DOMAIN`

### 7) (اختياري) دومين مخصص

1. اشترِ دومين من Namecheap/Cloudflare/GoDaddy
2. في Vercel → Project → Settings → Domains → Add
3. أضف سجلات DNS كما يطلب Vercel
4. حدّث `NEXT_PUBLIC_SITE_URL` ليطابق الدومين الجديد

### 8) ابدأ النشر اليومي

ادخل `https://YOUR_DOMAIN/studio`:
- **Posts** → Create → اكتب المقال (محرر غني، رفع صور، جدولة نشر)
- **Categories** → أضف تصنيفات جديدة
- **Submissions** → راجع الرسائل الواردة من نماذج الموقع

---

## التشغيل محلياً

```bash
npm install
cp .env.example .env.local   # ثم املأ القيم
npm run dev                  # http://localhost:3000
```

- موقع المستخدم: `/`
- لوحة التحكم: `/studio`

## بنية المشروع

```
src/
├── app/
│   ├── (الصفحة الرئيسية + الصفحات الأخرى)
│   ├── blog/                # المدونة (فهرس + مقالات)
│   ├── forms/               # 3 نماذج (رؤى عامة/خاصة/استعلام)
│   ├── studio/              # لوحة Sanity مدمجة
│   ├── api/submissions/     # API لاستقبال النماذج
│   └── sitemap.ts, robots.ts
├── components/              # المكونات
├── sanity/
│   ├── lib/                 # Sanity client + fetch helpers
│   └── schemaTypes/         # تعريفات المحتوى
└── data/posts.ts            # بيانات تجريبية (تختفي بعد ربط Sanity)
```

## الأوامر

```bash
npm run dev       # تطوير محلي
npm run build     # بناء production
npm run start     # تشغيل production محلياً
npm run lint      # فحص الكود
```

## دعم

أي تساؤل، أرسل عبر `/forms/inquiry` أو راسل: jedoo.abdelhady@gmail.com
