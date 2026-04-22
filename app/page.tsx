import Image from "next/image";

export default function EventQrLandingPage() {
  return (
    <main className="min-h-screen bg-[#e9e9e9] px-4 py-16">
      <section className="mx-auto grid w-full max-w-[768px] grid-cols-12 rounded-[24px] bg-white px-[64px] pb-[64px] pt-[64px] shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
        <div className="col-span-12">
          <p className="inline-flex w-fit rounded-full bg-flyerYellow px-[16px] py-[8px] text-[32px]/[1] font-bold text-black">
            We are so glad you&apos;re here!
          </p>

          <header className="mt-[32px]">
            <h1 className="text-[64px]/[1.08] font-extrabold tracking-tight text-black">
              Welcome to the Event!
            </h1>
            <p className="mt-[32px] max-w-[640px] text-[32px]/[1.4] text-[#1b1b1b]">
              Connect with a faith-centered matchmaker journey, and check-in to
              this event.
            </p>
          </header>
        </div>

        <div className="col-span-12 mt-[64px]">
          <Image
            src="/illustrations/people-line-splash.png"
            alt="People standing in line chatting"
            width={1512}
            height={982}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="col-span-12 mt-[64px] grid grid-cols-12 gap-[32px]">
          <button
            type="button"
            className="col-span-6 rounded-[12px] bg-flyerYellow px-[24px] py-[20px] text-[48px]/[1] font-extrabold uppercase tracking-tight text-black shadow-[0_4px_8px_rgba(0,0,0,0.18)] transition hover:brightness-95"
          >
            Sign Up
          </button>
          <button
            type="button"
            className="col-span-6 rounded-[12px] bg-white px-[24px] py-[20px] text-[48px]/[1] font-extrabold uppercase tracking-tight text-black shadow-[0_4px_8px_rgba(0,0,0,0.18)] transition hover:bg-gray-50"
          >
            Log In
          </button>
        </div>

        <p className="col-span-12 mt-[32px] text-[24px]/[1.4] text-[#1b1b1b]">
          By clicking this button you agree to our terms and services
        </p>
      </section>
    </main>
  );
}
