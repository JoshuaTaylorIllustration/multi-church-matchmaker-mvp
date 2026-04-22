import Link from "next/link";

export default function EventQrLandingPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <section className="mx-auto flex w-full max-w-md flex-col gap-6">
        <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-sm font-semibold text-gray-900">
          We are so glad you&apos;re here
        </p>

        <header className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Welcome to the Event!</h1>
          <p className="text-base leading-relaxed text-gray-700">
            This app helps you sign up for today&apos;s event and connect with a meaningful, faith-centered
            matchmaker journey.
          </p>
        </header>

        <div className="flex h-44 items-center justify-center rounded-2xl border-2 border-dashed border-yellow-300 bg-yellow-50 text-sm font-medium text-gray-600">
          Illustration placeholder
        </div>

        <div className="space-y-4">
          <Link
            href="/signup"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-flyerYellow px-5 py-4 text-base font-bold text-gray-900 shadow-sm transition hover:brightness-95 active:scale-[0.99]"
          >
            Sign Up for This Event + Matchmaker App
          </Link>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gray-100 px-5 py-4 text-base font-bold text-gray-900 shadow-sm transition hover:bg-gray-200"
          >
            Log In to Existing Account
          </Link>
        </div>

        <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
          By continuing, you agree to the two required agreements: Safety Policy and Biblical View of Marriage.
        </p>
      </section>
    </main>
  );
}
