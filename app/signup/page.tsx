"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";

const ACCOUNT_TYPES = [
  { value: "single", label: "Single Participant" },
  { value: "church_lead", label: "Church Leader" },
  { value: "matchmaker", label: "Matchmaker Team" },
];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: { account_type: accountType },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.push(`/auth/verification-sent?email=${encodeURIComponent(email)}`);
    } catch (unexpectedError) {
      setError(
        unexpectedError instanceof Error
          ? unexpectedError.message
          : "Unable to create account right now. Please try again.",
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
            Create your account
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900">Sign Up</h1>
          <p className="text-base leading-relaxed text-gray-700">
            Start your event and matchmaker journey with one secure account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-16 space-y-16">
          <label className="block space-y-2">
            <span className="text-base font-semibold text-gray-900">Account type</span>
            <select
              value={accountType}
              onChange={(event) => setAccountType(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base text-gray-900 outline-none focus:border-gray-500"
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

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
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base text-gray-900 outline-none focus:border-gray-500"
            />
          </label>

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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-base leading-relaxed text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gray-900 underline">
            Log in here
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
