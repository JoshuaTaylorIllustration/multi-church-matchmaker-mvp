export function FeatureCard({
  title,
  body,
  status = "Stub",
}: {
  title: string;
  body: string;
  status?: "Ready" | "Stub" | "Planned";
}) {
  const tone =
    status === "Ready"
      ? "bg-green-100 text-green-900"
      : status === "Planned"
        ? "bg-blue-100 text-blue-900"
        : "bg-gray-100 text-gray-900";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{status}</span>
      </div>
      <p className="text-sm text-gray-700">{body}</p>
    </article>
  );
}
