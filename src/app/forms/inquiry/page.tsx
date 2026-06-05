import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";

export const metadata = {
  title: "بوابة تساؤل واستعلام",
  description: "نافذة لاستقبال التساؤلات والاستعلامات المختلفة بخصوصية وأمانة.",
};

export default function InquiryPage() {
  return (
    <FormPageShell
      title="بوابة تساؤل واستعلام"
      subtitle="هذه النافذة خُصّصت لاستقبال التساؤلات والاستعلامات المختلفة، وطرح ما يشكل على السائل أو يرغب في بيانه والاستفسار عنه. يرجى إيضاح السؤال بصورة مختصرة وواضحة، وإرفاق ما يلزم من بيانات تُعين على فهم المقصود. كما نؤكد أن ما يرد عبر هذه النافذة يُتعامل معه بقدرٍ من الخصوصية والأمانة، ونسأله التوفيق والسداد والنفع بما تيسر."
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
