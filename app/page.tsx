import Image from "next/image";

export default function EventQrLandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9e9e9] px-4 py-8 sm:px-6">
      <section className="w-full max-w-[560px] rounded-3xl bg-white px-5 py-7 shadow-[0_2px_2px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.08)] sm:px-8 sm:py-9">
        <p className="inline-flex w-fit rounded-full bg-flyerYellow px-3 py-1 text-lg font-bold leading-none text-black">
          We are so glad you&apos;re here!
        </p>

        <header className="mt-5 space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-6xl">
            Welcome to the Event!
          </h1>
          <p className="max-w-[460px] text-lg leading-relaxed text-neutral-800">
            Connect with a faith-centered matchmaker journey, and check-in to
            this event.
          </p>
        </header>

        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          <Image
            src="/illustrations/event-line.svg"
            alt="Crowd of people talking at an event with yellow accent details"
            width={1200}
            height={340}
            className="h-auto w-full"
            priority
          />
        </div>

        <button
          type="button"
          className="mt-7 w-full rounded-xl bg-flyerYellow px-5 py-4 text-lg font-extrabold uppercase tracking-tight text-black shadow-[0_2px_0_rgba(0,0,0,0.15)] transition hover:brightness-95 active:translate-y-[1px]"
        >
          Matchmaker Journey - Sign Up
        </button>

        <p className="mt-6 text-sm leading-relaxed text-neutral-700">
          By clicking this button, you agree to our mandatory agreements:
          <span className="font-semibold"> Safety Policy </span>
          and
          <span className="font-semibold"> Biblical View of Marriage</span>.
        </p>
      </section>
    </main>
  );
}
