export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/post-login");
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <section className="mx-auto flex w-full max-w-md flex-col gap-6">
        <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-sm font-semibold text-gray-900">
          Multi-Church Matchmaker MVP
        </p>

        <header className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Welcome to the Event!
          </h1>
          <p className="text-base leading-relaxed text-gray-700">
            Sign up or log in to continue to your role-specific dashboard.
          </p>
        </header>

        <div className="flex gap-3">
          <Link href="/signup" className="flex-1 rounded-2xl bg-flyerYellow px-5 py-4 text-center text-base font-bold text-gray-900">
            Sign up
          </Link>
          <Link href="/login" className="flex-1 rounded-2xl border border-gray-300 px-5 py-4 text-center text-base font-bold text-gray-900">
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
