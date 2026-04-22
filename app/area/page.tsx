export const dynamic = "force-dynamic";

import { FeatureCard } from "@/components/feature-card";
import { RoleAppLayout } from "@/components/role-app-layout";
import { requireProfileForRole } from "@/lib/auth/guards";
import { AREA_DIRECTOR_ACTIVATION_FEE } from "@/lib/product/pricing";

export default async function AreaPage() {
  const profile = await requireProfileForRole("/area");

  return (
    <RoleAppLayout
      profile={profile}
      title="Area director workspace"
      subtitle="Manage area-level operations across users, references, and church events."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div id="events">
          <FeatureCard
            title="Events and invites"
            status="Ready"
            body="Create regional events, broadcast invites, and monitor RSVP status by church and role type."
          />
        </div>
        <div id="churches">
          <FeatureCard
            title="Church coordination lists"
            body="Generate member-ready lists for churches and track delivery acknowledgments."
          />
        </div>
        <FeatureCard
          title="Area activation billing"
          body={`${AREA_DIRECTOR_ACTIVATION_FEE} Recurring user subscription billing is handled at the user-plan layer.`}
          status="Planned"
        />
        <FeatureCard
          title="Impersonation requests"
          body="Request time-bound impersonation privileges for troubleshooting and support."
          status="Planned"
        />
      </div>
    </RoleAppLayout>
  );
}
