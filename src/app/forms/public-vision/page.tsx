import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";

export const metadata = {
  title: "الرؤى العامة — تقديم رؤيتي",
  description: "نستقبل آرائك ومقترحاتك لتحسين خدماتنا.",
};

export default function PublicVisionPage() {
  return (
    <FormPageShell
      title="الرؤى العامة"
      subtitle="نستقبل آرائكم ومقترحاتكم لتحسين خدماتنا. شاركنا رأيك وكن جزءاً من تطويرنا المستمر."
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
