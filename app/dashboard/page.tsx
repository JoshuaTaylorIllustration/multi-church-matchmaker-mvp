export const dynamic = "force-dynamic";

import { ProtectedShell } from "@/components/protected-shell";
import { requireProfileForRole } from "@/lib/auth/guards";

export default async function DashboardPage() {
  const profile = await requireProfileForRole("/dashboard");

  return <ProtectedShell title="User dashboard" profile={profile} />;
}
