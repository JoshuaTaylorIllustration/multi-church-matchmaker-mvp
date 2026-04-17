"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const showDemoHelper = process.env.NODE_ENV === "development";

  function useDemoAccount(type: "user" | "reference" | "platform_admin") {
    const password = "Passw0rd!";
    const emailMap = {
      user: "demo.user@example.com",
      reference: "demo.reference@example.com",
      platform_admin: "demo.admin@example.com",
    };

    setEmail(emailMap[type]);
    setPassword(password);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/post-login");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">Email</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">Password</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-lg bg-flyerYellow px-4 py-2 font-semibold text-gray-900"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {showDemoHelper ? (
        <div className="space-y-2 rounded-lg border border-dashed border-gray-300 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Dev demo helper</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => useDemoAccount("user")}>Use demo user</button>
            <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => useDemoAccount("reference")}>Use demo reference</button>
            <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => useDemoAccount("platform_admin")}>Use demo admin</button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
