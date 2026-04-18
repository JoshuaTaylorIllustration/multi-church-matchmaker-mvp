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
  const [action, setAction] = useState<"core" | "with_area">("with_area");

  async function createDemoUsers() {
    setLoading(true);
    setResult(null);

    const includeAreaDirector = action === "with_area";

    const response = await fetch("/api/dev/create-demo-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ includeAreaDirector }),
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
        Create/update demo auth users and sync profile roles in one click.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="demo-user-action">
          Context action
        </label>
        <select
          id="demo-user-action"
          className="rounded border border-gray-300 px-2 py-1 text-sm"
          value={action}
          onChange={(e) => setAction(e.target.value as "core" | "with_area")}
        >
          <option value="with_area">Create core + area director (recommended)</option>
          <option value="core">Create core only (user/reference/admin)</option>
        </select>
      </div>

      <button
        type="button"
        onClick={createDemoUsers}
        disabled={loading}
        className="rounded-lg bg-flyerYellow px-3 py-2 text-sm font-semibold text-gray-900"
      >
        {loading ? "Creating demo users..." : "Run context action"}
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
