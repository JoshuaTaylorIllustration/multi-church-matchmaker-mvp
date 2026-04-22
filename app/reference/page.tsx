export const dynamic = "force-dynamic";

import { FeatureCard } from "@/components/feature-card";
import { RoleAppLayout } from "@/components/role-app-layout";
import { requireProfileForRole } from "@/lib/auth/guards";

export default async function ReferencePage() {
  const profile = await requireProfileForRole("/reference");

  return (
    <RoleAppLayout
      profile={profile}
      title="Reference console"
      subtitle="Suggest and approve matches, support assigned users, and manage broader-area matchmaking access."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div id="queue">
          <FeatureCard
            title="Suggestion queue"
            status="Ready"
            body="Review pending users, draft match suggestions, and mark proposals as ready for user delivery."
          />
        </div>
        <FeatureCard
          title="Assigned users"
          body="See users who selected you as their reference and track engagement level at a glance."
        />
        <div id="search">
          <FeatureCard
            title="Broader area search"
            body="Initiate expanded geography searches with role-specific payment controls for references."
            status="Planned"
          />
        </div>
        <FeatureCard
          title="Approval workflow"
          body="Approve or reject generated matches before users can view them in their dashboards."
        />
      </div>
    </RoleAppLayout>
  );
}
