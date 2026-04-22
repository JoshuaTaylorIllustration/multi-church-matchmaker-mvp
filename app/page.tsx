export default function EventQrLandingPage() {
  return (
    <main className="min-h-screen bg-white px-[24px] py-[32px]">
      <section className="mx-auto flex w-full max-w-md flex-col gap-[32px]">
        <div className="flex flex-col gap-[16px]">
          <p className="inline-flex w-fit rounded-full bg-flyerYellow px-[16px] py-[8px] text-[16px] font-bold text-gray-900">
            We are so glad you&apos;re here
          </p>

          <header className="flex flex-col gap-[16px]">
            <h1 className="text-[40px] font-bold leading-[48px] text-gray-900">
              Welcome to the Event!
            </h1>
            <p className="text-[16px] leading-[24px] text-gray-700">
              This app helps you sign up for today&apos;s event and connect with a
              meaningful, faith-centered matchmaker journey.
            </p>
          </header>
        </div>

        <div className="flex h-44 items-center justify-center rounded-2xl border-2 border-dashed border-yellow-300 bg-yellow-50 text-[16px] font-semibold text-gray-600">
          Illustration placeholder
        </div>

        <div className="flex flex-col gap-[16px]">
          <button
            type="button"
            className="w-full rounded-2xl bg-flyerYellow px-[20px] py-[16px] text-[20px] font-semibold text-gray-900 shadow-sm transition hover:brightness-95 active:scale-[0.99]"
          >
            Sign Up for This Event + Matchmaker App
          </button>

          <p className="text-center text-[16px] leading-[24px] text-gray-500">
            By continuing, you agree to the two required agreements: Safety Policy
            and Biblical View of Marriage.
          </p>
        </div>
      </section>
    </main>
  );
}
