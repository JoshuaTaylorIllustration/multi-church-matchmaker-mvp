export const dynamic = "force-dynamic";

import { FeatureCard } from "@/components/feature-card";
import { RoleAppLayout } from "@/components/role-app-layout";
import { requireProfileForRole } from "@/lib/auth/guards";
import { CreateDemoUsersPanel } from "@/components/admin/create-demo-users-panel";

export default async function AdminPage() {
  const profile = await requireProfileForRole("/admin");

  return (
    <RoleAppLayout
      profile={profile}
      title="Platform admin console"
      subtitle="Configure application-wide policies, oversee operations, and troubleshoot with safeguarded impersonation controls."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div id="settings">
          <FeatureCard
            title="Global settings"
            status="Ready"
            body="Adjust high-level application settings and control role-based capabilities across the platform."
          />
        </div>
        <FeatureCard
          title="Multi-role preview"
          body="View mock outcomes for user, reference, and area-director experiences while tuning policy changes."
          status="Planned"
        />
        <div id="impersonation">
          <FeatureCard
            title="Impersonation approvals"
            body="Approve admin impersonation only after required confirmations from references and users."
            status="Planned"
          />
        </div>
        <FeatureCard
          title="Demo account panel"
          body="Use the development helper accounts to verify role behavior quickly during feature iteration."
        />
        <CreateDemoUsersPanel />
      </div>
    </RoleAppLayout>
  );
}
