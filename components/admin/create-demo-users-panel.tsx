"use client";

import { useState } from "react";

type ApiResult = {
  message?: string;
  error?: string;
  shared_password?: string;
  users?: Array<{ email: string; status: string }>;
};

export function CreateDemoUsersPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  async function createDemoUsers() {
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/dev/create-demo-users", {
      method: "POST",
    });

    const payload = (await response.json()) as ApiResult;
    setResult(payload);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4" id="users">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900">User table tools</h2>
        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-900">
          Dev utility
        </span>
      </div>
      <p className="mb-3 text-sm text-gray-700">
        Create/update 3 demo auth users and sync profile roles in one click.
      </p>
      <button
        type="button"
        onClick={createDemoUsers}
        disabled={loading}
        className="rounded-lg bg-flyerYellow px-3 py-2 text-sm font-semibold text-gray-900"
      >
        {loading ? "Creating demo users..." : "Create demo users"}
      </button>

      {result ? (
        <div className="mt-3 space-y-2 text-sm">
          {result.error ? <p className="text-red-700">{result.error}</p> : null}
          {result.message ? <p className="text-green-700">{result.message}</p> : null}
          {result.shared_password ? (
            <p className="text-gray-700">
              Shared password: <code>{result.shared_password}</code>
            </p>
          ) : null}
          {result.users?.length ? (
            <ul className="list-inside list-disc text-gray-700">
              {result.users.map((user) => (
                <li key={user.email}>
                  {user.email}: {user.status}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
