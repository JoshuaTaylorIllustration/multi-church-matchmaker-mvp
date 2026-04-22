import Link from "next/link";
import { Profile } from "@/lib/auth/profile";
import { getRouteForRole } from "@/lib/auth/roles";

const roleNav: Record<string, Array<{ href: string; label: string }>> = {
  user: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard#matches", label: "Matches" },
    { href: "/dashboard#health", label: "Health Gauge" },
  ],
  reference: [
    { href: "/reference", label: "Reference Home" },
    { href: "/reference#queue", label: "Suggestion Queue" },
    { href: "/reference#search", label: "Area Search" },
  ],
  area_director: [
    { href: "/area", label: "Area Director Home" },
    { href: "/area#events", label: "Events & Invites" },
    { href: "/area#churches", label: "Church Lists" },
  ],
  platform_admin: [
    { href: "/admin", label: "Admin Home" },
    { href: "/admin#settings", label: "System Settings" },
    { href: "/admin#impersonation", label: "Impersonation" },
  ],
};

function prettyRole(role: string) {
  return role.replaceAll("_", " ");
}

export function RoleAppLayout({
  profile,
  title,
  subtitle,
  children,
}: {
  profile: Profile;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const links = roleNav[profile.role] ?? [{ href: getRouteForRole(profile.role), label: "Role Home" }];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Signed in as</p>
            <p className="font-semibold text-gray-900">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-sm text-gray-700">{profile.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-gray-900">
              {prettyRole(profile.role)}
            </span>
          </div>

          <nav className="space-y-2 border-t border-gray-100 pt-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            <Link href="/post-login" className="block rounded-lg border border-gray-200 px-3 py-2 text-sm">
              Route to my role home
            </Link>
            <form action="/logout" method="post">
              <button type="submit" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-sm">
                Log out
              </button>
            </form>
          </div>
        </aside>

        <section className="space-y-4">
          <header className="rounded-xl border border-gray-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
