import VerifyClient from "./VerifyClient";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "تفعيل البريد",
  robots: { index: false, follow: false },
};

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <AuthShell title="تفعيل بريدك">
      <VerifyClient token={token} />
    </AuthShell>
  );
}
