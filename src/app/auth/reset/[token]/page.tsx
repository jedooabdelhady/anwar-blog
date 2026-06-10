import ResetForm from "./ResetForm";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "تعيين كلمة مرور جديدة",
  robots: { index: false, follow: false },
};

export default async function ResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <AuthShell title="كلمة مرور جديدة" subtitle="اختر كلمة مرور قوية لحسابك.">
      <ResetForm token={token} />
    </AuthShell>
  );
}
