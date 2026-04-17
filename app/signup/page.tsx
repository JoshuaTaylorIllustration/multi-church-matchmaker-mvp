export const dynamic = "force-dynamic";

import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md space-y-6 px-5 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
      <SignupForm />
      <p className="text-sm text-gray-700">
        Already have an account? <Link href="/login" className="font-semibold underline">Log in</Link>
      </p>
    </main>
  );
}
