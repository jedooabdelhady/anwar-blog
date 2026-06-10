import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";
import { requireAuth } from "@/components/auth/RequireAuth";

export const metadata = {
  title: "بوابة الرؤى الشخصية",
  description: "مساحة آمنة لطلب تعبير الرؤى الخاصّة. خصوصيتكم محفوظة بعناية.",
};

export const dynamic = "force-dynamic";

export default async function PrivateVisionPage() {
  const user = await requireAuth("/forms/private-vision");
  return (
    <FormPageShell
      title="بوابة الرؤى الشخصية"
      subtitle="يمكنكم هنا تدوين رؤياكم الخاصّة وطلب تعبيرها، بما يفتح الله به من فهمٍ ودلالة في مضمونها. ونؤكد لكم أن خصوصيتكم محفوظة بعناية، ولن يتم نشر الرؤى أو الاسترسال في تفاصيلها على الملأ؛ فالعابرُ مؤتمن، ولا يجوز له التصرّف بغير ذلك. والله الموفّق والهادي إلى سواء السبيل."
      iconVariant="sienna"
    >
      <ContactForm
        kind="private-vision"
        submitLabel="تقديم رؤيتي"
        accent="#6B3F23"
        accentHover="#5a341c"
        prefillName={user.displayName || user.username}
        prefillEmail={user.email}
        prefillPhone={user.phone}
      />
    </FormPageShell>
  );
}
