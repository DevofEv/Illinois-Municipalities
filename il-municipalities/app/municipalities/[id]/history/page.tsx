import Link from "next/link";
import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="rounded border p-6">
          <h1 className="text-2xl font-semibold">Municipality Not Found</h1>
          <p className="text-gray-600 mt-2">We couldn&apos;t find information for &quot;{id}&quot;.</p>
          <div className="mt-4 flex gap-3">
            <Link href="/" className="px-3 py-2 rounded border">Browse All</Link>
          </div>
        </div>
      </div>
    );
  }

  const events = municipality.history?.historicalEvents ?? [];

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 profile-page">
      <nav className="tabs flex gap-2 overflow-x-auto">
        <Link href={`/municipalities/${id}`} className="px-3 py-2 rounded border">Overview</Link>
        <Link href={`/municipalities/${id}/demographics`} className="px-3 py-2 rounded border">Demographics</Link>
        <Link href={`/municipalities/${id}/economics`} className="px-3 py-2 rounded border">Economics</Link>
        <Link href={`/municipalities/${id}/government`} className="px-3 py-2 rounded border">Government</Link>
        <Link href={`/municipalities/${id}/history`} className="px-3 py-2 rounded border bg-gray-100">History</Link>
        <Link href={`/municipalities/${id}/infrastructure`} className="px-3 py-2 rounded border">Infrastructure</Link>
      </nav>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Historical Timeline</h2>
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-gray-600">No historical events recorded.</div>
          ) : (
            events.map((e, idx) => (
              <div key={idx} className="rounded border p-3">
                <div className="text-sm text-gray-500">{e.year}</div>
                <div className="font-medium">{e.title ?? e.event}</div>
                {e.description ? <p className="text-sm text-gray-700 mt-1">{e.description}</p> : null}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}