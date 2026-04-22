type AddConnectionPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function AddConnectionPage({
  searchParams,
}: AddConnectionPageProps) {
  const { from } = await searchParams;

  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <section className="mx-auto w-full max-w-md space-y-4 rounded-xl border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-900">Add event connection</h1>
        <p className="text-sm text-gray-700">
          You scanned a matchmaker event QR code.
        </p>
        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <p>
            Source attendee ID: <strong>{from ?? 'Unknown'}</strong>
          </p>
          <p className="mt-1 text-xs text-gray-600">
            In the full workflow, this page will load the attendee profile and confirm connection creation.
          </p>
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-flyerYellow px-4 py-3 font-semibold text-gray-900"
        >
          Confirm add connection
        </button>
      </section>
    </main>
  );
}
