export const dynamic = "force-dynamic";

import { ProtectedShell } from "@/components/protected-shell";
import { requireProfileForRole } from "@/lib/auth/guards";

export default async function AreaPage() {
  const profile = await requireProfileForRole("/area");

  return <ProtectedShell title="Area director" profile={profile} />;
}
