import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function DemographicsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    return null;
  }

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">Age Distribution</h2>
          <div className="h-64 grid place-items-center text-gray-500">Age chart placeholder</div>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">Racial Composition</h2>
          <div className="h-64 grid place-items-center text-gray-500">Donut chart placeholder</div>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">Education Levels</h2>
          <div className="h-64 grid place-items-center text-gray-500">Education chart placeholder</div>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Demographics vs State Average</h2>
        <div className="rounded border p-4 text-sm text-gray-600">Comparison table placeholder</div>
      </section>
    </>
  );
}