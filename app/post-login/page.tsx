export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "@/lib/auth/profile";
import { getRouteForRole } from "@/lib/auth/roles";

export default async function PostLoginPage() {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile) {
    redirect("/login?message=No%20profile%20found");
  }

  redirect(getRouteForRole(profile.role));
}
