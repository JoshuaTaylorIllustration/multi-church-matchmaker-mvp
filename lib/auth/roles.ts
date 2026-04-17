export const APP_ROLES = [
  "platform_admin",
  "area_director",
  "reference",
  "user",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

const roleToRoute: Record<AppRole, string> = {
  platform_admin: "/admin",
  area_director: "/area",
  reference: "/reference",
  user: "/dashboard",
};

export function getRouteForRole(role: string | null | undefined): string {
  if (!role) return "/dashboard";

  if (role === "admin") return "/admin"; // optional compatibility alias

  if (APP_ROLES.includes(role as AppRole)) {
    return roleToRoute[role as AppRole];
  }

  return "/dashboard";
}
