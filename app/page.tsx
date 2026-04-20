import Image from "next/image";

export default function EventQrLandingPage() {
  return (
    <main className="min-h-screen bg-[#e9e9e9] px-4 py-10">
      <section className="mx-auto flex min-h-[700px] w-full max-w-[520px] flex-col rounded-[22px] bg-[#f2f2f2] px-5 py-8 shadow-[0_2px_6px_rgba(0,0,0,0.2)] sm:px-10 sm:py-10">
        <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-[34px]/none font-bold text-black">
          We are so glad you&apos;re here!
        </p>

        <header className="mt-6 space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-6xl">
            Welcome to the Event!
          </h1>
          <p className="max-w-[420px] text-[32px]/[1.45] text-[#1b1b1b]">
            Connect with a faith-centered matchmaker journey, and check-in to
            this event.
          </p>
        </header>

        <div className="mt-10">
          <Image
            src="/illustrations/people-line-splash.png"
            alt="People standing in line chatting"
            width={900}
            height={350}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
          <button
            type="button"
            className="rounded-xl bg-flyerYellow px-6 py-4 text-3xl font-extrabold uppercase tracking-tight text-black shadow-[0_4px_8px_rgba(0,0,0,0.18)] transition hover:brightness-95"
          >
            Sign Up
          </button>
          <button
            type="button"
            className="rounded-xl bg-flyerYellow px-6 py-4 text-3xl font-extrabold uppercase tracking-tight text-black shadow-[0_4px_8px_rgba(0,0,0,0.18)] transition hover:brightness-95"
          >
            Log In
          </button>
        </div>

        <p className="mt-8 text-[30px]/[1.35] text-[#1b1b1b]">
          By clicking this button you agree to our terms and services
        </p>
      </section>
    </main>
  );
}
