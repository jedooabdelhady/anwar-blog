import ContactForm from "@/components/ContactForm";
import FormPageShell from "@/components/FormPageShell";
import { requireAuth } from "@/components/auth/RequireAuth";

export const metadata = {
  title: "بوابة الرؤى العامة",
  description: "مساحة لتدوين الرؤى المتعلّقة بالأحداث العامّة وغير الشخصية.",
};

export const dynamic = "force-dynamic";

export default async function PublicVisionPage() {
  const user = await requireAuth("/forms/public-vision");
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
        prefillName={user.displayName || user.username}
        prefillEmail={user.email}
        prefillPhone={user.phone}
      />
    </FormPageShell>
  );
}
