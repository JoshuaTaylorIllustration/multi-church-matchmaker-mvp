export const dynamic = "force-dynamic";

import { FeatureCard } from "@/components/feature-card";
import { RoleAppLayout } from "@/components/role-app-layout";
import { requireProfileForRole } from "@/lib/auth/guards";

export default async function DashboardPage() {
  const profile = await requireProfileForRole("/dashboard");

  return (
    <RoleAppLayout
      profile={profile}
      title="User dashboard"
      subtitle="Track your journey, receive match suggestions from your reference, and complete daily health check-ins."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div id="matches">
          <FeatureCard
            title="Recommended matches"
            status="Ready"
            body="Users can review matches that their reference suggested or approved. Direct paid broad-search actions are not available on user accounts."
          />
        </div>
        <FeatureCard
          title="Reference connection"
          body="See your assigned reference (matchmaker), send context updates, and track pending conversations."
        />
        <div id="health">
          <FeatureCard
            title="Health gauge broadcast"
            body="Complete daily questionnaire prompts and publish a lightweight health gauge to support your matchmaker's context."
            status="Planned"
          />
        </div>
        <FeatureCard
          title="Event participation"
          body="Accept event invites sent by area directors and confirm your attendance status."
        />
      </div>
    </RoleAppLayout>
  );
}
