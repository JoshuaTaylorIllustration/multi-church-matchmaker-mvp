export const dynamic = "force-dynamic";

import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto min-h-screen w-full max-w-md space-y-6 px-5 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Log in</h1>
      {params.message ? (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{params.message}</p>
      ) : null}
      <LoginForm />
      <p className="text-sm text-gray-700">
        Don&apos;t have an account? <Link href="/signup" className="font-semibold underline">Sign up</Link>
      </p>
    </main>
  );
}
