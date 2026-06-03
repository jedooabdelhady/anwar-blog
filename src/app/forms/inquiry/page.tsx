import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";

export const metadata = {
  title: "تساؤل واستعلام",
  description: "نحن هنا للإجابة على تساؤلاتكم واستفساراتكم.",
};

export default function InquiryPage() {
  return (
    <FormPageShell
      title="تساؤل واستعلام"
      subtitle="نحن هنا للإجابة على تساؤلاتكم واستفساراتكم. اطرح سؤالك وسنرد عليك في أقرب وقت."
      iconVariant="oak"
    >
      <ContactForm
        kind="inquiry"
        submitLabel="أرسل استفسارك"
        accent="#7a5c43"
        accentHover="#664a35"
      />
    </FormPageShell>
  );
}
