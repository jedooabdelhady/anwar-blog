import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";

export const metadata = {
  title: "الرؤى الخاصة — تقديم رؤيتي",
  description: "شاركنا رؤيتك الخاصة أو مشروعك لنناقشه معك.",
};

export default function PrivateVisionPage() {
  return (
    <FormPageShell
      title="الرؤى الخاصة"
      subtitle="شاركنا رؤيتك الخاصة أو مشروعك لنناقشه معك. كل التفاصيل التي تكتبها هنا تبقى خاصة."
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
