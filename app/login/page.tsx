"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVerified(params.get("verified") === "1");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/");
    } catch (unexpectedError) {
      setError(
        unexpectedError instanceof Error
          ? unexpectedError.message
          : "Unable to log in right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <section className="mx-auto w-full max-w-md rounded-2xl bg-gray-50 p-8 shadow-sm">
        <div className="space-y-4">
          <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-sm font-semibold text-gray-900">
            Welcome back
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900">Log In</h1>
          <p className="text-base leading-relaxed text-gray-700">
            Sign in to continue your matchmaker experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-16 space-y-16">
          <label className="block space-y-2">
            <span className="text-base font-semibold text-gray-900">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base text-gray-900 outline-none focus:border-gray-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-base font-semibold text-gray-900">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base text-gray-900 outline-none focus:border-gray-500"
            />
          </label>

          {verified ? (
            <p className="rounded-2xl bg-green-50 px-5 py-4 text-base leading-relaxed text-green-700">
              Your email has been verified. You can log in now with your email and password.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-2xl bg-red-50 px-5 py-4 text-base leading-relaxed text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-flyerYellow px-5 py-4 text-lg font-semibold text-gray-900 shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-8 text-base leading-relaxed text-gray-700">
          Need an account?{" "}
          <Link href="/signup" className="font-semibold text-gray-900 underline">
            Create one here
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
