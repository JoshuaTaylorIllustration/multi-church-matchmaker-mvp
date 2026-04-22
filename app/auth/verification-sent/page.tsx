import Link from "next/link";

export default async function VerificationSentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <section className="mx-auto w-full max-w-md rounded-2xl bg-gray-50 p-8 shadow-sm">
        <div className="space-y-4">
          <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-sm font-semibold text-gray-900">
            Check your inbox
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900">Verify your email</h1>
          <p className="text-base leading-relaxed text-gray-700">
            We sent a verification link to {email ? <strong>{email}</strong> : "your email"}. Click the link,
            then return here and log in.
          </p>
        </div>

        <div className="mt-8 space-y-4 rounded-2xl bg-white p-5">
          <p className="text-base leading-relaxed text-gray-700">
            After clicking the email verification link, you will be guided back to a confirmation page with a
            button to continue to login.
          </p>
        </div>

        <Link
          href="/login"
          className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-flyerYellow px-5 py-4 text-lg font-semibold text-gray-900 shadow-sm transition hover:brightness-95"
        >
          Back to Login
        </Link>
      </section>
    </main>
  );
}
