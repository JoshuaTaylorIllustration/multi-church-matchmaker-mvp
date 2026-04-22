"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../../../lib/supabaseClient";

type ConfirmationState = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
  const [state, setState] = useState<ConfirmationState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function confirmEmail() {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const type = params.get("type") as "signup" | "invite" | "recovery" | "magiclink" | "email_change" | null;

      if (!tokenHash || !type) {
        setState("error");
        setError("The verification link is missing details. Please request another verification email.");
        return;
      }

      try {
        const supabase = getSupabaseClient();
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });

        if (verifyError) {
          setState("error");
          setError(verifyError.message);
          return;
        }

        setState("success");
      } catch (unexpectedError) {
        setState("error");
        setError(
          unexpectedError instanceof Error
            ? unexpectedError.message
            : "We were unable to verify your email right now.",
        );
      }
    }

    confirmEmail();
  }, []);

  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <section className="mx-auto w-full max-w-md rounded-2xl bg-gray-50 p-8 shadow-sm">
        <div className="space-y-4">
          <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-sm font-semibold text-gray-900">
            Account confirmation
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900">Email verification</h1>
        </div>

        {state === "loading" ? (
          <p className="mt-8 text-base leading-relaxed text-gray-700">Verifying your email now...</p>
        ) : null}

        {state === "success" ? (
          <div className="mt-8 space-y-4">
            <p className="rounded-2xl bg-green-50 px-5 py-4 text-base leading-relaxed text-green-700">
              Your email is verified. You can log in now with your email and password.
            </p>
            <Link
              href="/login?verified=1"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-flyerYellow px-5 py-4 text-lg font-semibold text-gray-900 shadow-sm transition hover:brightness-95"
            >
              Continue to Login
            </Link>
          </div>
        ) : null}

        {state === "error" ? (
          <div className="mt-8 space-y-4">
            <p className="rounded-2xl bg-red-50 px-5 py-4 text-base leading-relaxed text-red-700">
              {error ?? "Verification failed. Please request a new verification email and try again."}
            </p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-flyerYellow px-5 py-4 text-lg font-semibold text-gray-900 shadow-sm transition hover:brightness-95"
            >
              Back to Login
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
