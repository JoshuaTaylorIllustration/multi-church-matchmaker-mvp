export const dynamic = "force-dynamic";

import { ProtectedShell } from "@/components/protected-shell";
import { requireProfileForRole } from "@/lib/auth/guards";

export default async function AdminPage() {
  const profile = await requireProfileForRole("/admin");

  return <ProtectedShell title="Platform admin" profile={profile} />;
}
