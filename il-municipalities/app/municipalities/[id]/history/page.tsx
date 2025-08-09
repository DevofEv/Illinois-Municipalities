import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    return null;
  }

  const events = municipality.history?.historicalEvents ?? [];

  return (
    <>
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
    </>
  );
}