export const dynamic = "force-dynamic";

import { ProtectedShell } from "@/components/protected-shell";
import { requireProfileForRole } from "@/lib/auth/guards";

export default async function ReferencePage() {
  const profile = await requireProfileForRole("/reference");

  return <ProtectedShell title="Reference console" profile={profile} />;
}
