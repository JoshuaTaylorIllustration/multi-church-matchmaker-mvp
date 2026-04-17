"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    church_name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          church_name: form.church_name,
        },
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    router.push("/login?message=Account%20created.%20Please%20log%20in.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">First name</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          value={form.first_name}
          onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
          required
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">Last name</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          value={form.last_name}
          onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
          required
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">Church name</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          value={form.church_name}
          onChange={(e) => setForm((p) => ({ ...p, church_name: e.target.value }))}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">Email</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">Password</span>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          minLength={8}
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-lg bg-flyerYellow px-4 py-2 font-semibold text-gray-900"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
