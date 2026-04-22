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

function normalizeRole(rawRole: string) {
  return rawRole.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
}

const roleAliases: Record<string, AppRole> = {
  admin: "platform_admin",
  platformadmin: "platform_admin",
  area: "area_director",
  director: "area_director",
  matchmaker: "reference",
  participant: "user",
};

export function getRouteForRole(role: string | null | undefined): string {
  if (!role) return "/dashboard";

  const normalizedRole = normalizeRole(role);

  const mappedRole = roleAliases[normalizedRole] ?? normalizedRole;

  if (APP_ROLES.includes(mappedRole as AppRole)) {
    return roleToRoute[mappedRole as AppRole];
  }

  return "/dashboard";
}
