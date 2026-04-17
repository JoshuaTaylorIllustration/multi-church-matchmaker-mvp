import Link from "next/link";
import { Profile } from "@/lib/auth/profile";

export function ProtectedShell({
  title,
  profile,
}: {
  title: string;
  profile: Profile;
}) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl space-y-6 px-5 py-8">
      <header className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">Logged in as</p>
        <p className="font-semibold text-gray-900">
          {profile.first_name} {profile.last_name}
        </p>
        <p className="text-sm text-gray-700">{profile.email}</p>
        <p className="mt-2 inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-gray-900">
          role: {profile.role}
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          This is a simple MVP role view. We can expand these flows next.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/post-login" className="rounded border px-3 py-2 text-sm">
          Role home
        </Link>
        <form action="/logout" method="post">
          <button type="submit" className="rounded border px-3 py-2 text-sm">
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
