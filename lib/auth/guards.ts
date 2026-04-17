import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "@/lib/auth/profile";
import { getRouteForRole } from "@/lib/auth/roles";

export async function requireProfileForRole(expectedRoute: string) {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile) {
    redirect("/login?message=Profile%20not%20found");
  }

  const roleRoute = getRouteForRole(profile.role);
  if (roleRoute !== expectedRoute) {
    redirect(roleRoute);
  }

  return profile;
}
