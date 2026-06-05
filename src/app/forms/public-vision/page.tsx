import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";

export const metadata = {
  title: "الرؤى العامة — تقديم رؤيتي",
  description: "نستقبل آرائك ومقترحاتك لتحسين خدماتنا.",
};

export default function PublicVisionPage() {
  return (
    <FormPageShell
      title="بوابة الرؤى العامة"
      subtitle="يمكنكم هنا تدوين الرؤى المتعلّقة بالأحداث العامّة وغير الشخصية، مع إيضاح مضمونها بما يقتضي البيان. ونحيطكم علمًا بأن بعض الرؤى قد تُشارك — عند الضرورة — مع الجهات المعنيّة أو من يهمّه الأمر، وفق ما تقتضيه المصلحة. والله وليُّ التوفيق."
      iconVariant="gum"
    >
      <ContactForm
        kind="public-vision"
        submitLabel="تقديم رؤيتي"
        accent="#8F8C78"
        accentHover="#75725f"
      />
    </FormPageShell>
  );
}
