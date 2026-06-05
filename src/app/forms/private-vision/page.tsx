import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";

export const metadata = {
  title: "بوابة الرؤى الشخصية",
  description: "مساحة آمنة لطلب تعبير الرؤى الخاصّة. خصوصيتكم محفوظة بعناية.",
};

export default function PrivateVisionPage() {
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
      />
    </FormPageShell>
  );
}
