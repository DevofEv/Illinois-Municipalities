import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function EconomicsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    return null;
  }

  return (
    <>
      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Economic Indicators</h2>
        <div className="h-80 grid place-items-center text-gray-500">Radar chart placeholder</div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-4">
          <div className="text-xs text-gray-500">Median Household Income</div>
          <div className="text-xl font-semibold tabular-nums">${municipality.economics.medianHouseholdIncome.toLocaleString()}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-xs text-gray-500">Median Home Value</div>
          <div className="text-xl font-semibold tabular-nums">${municipality.economics.medianHomeValue.toLocaleString()}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-xs text-gray-500">Unemployment Rate</div>
          <div className="text-xl font-semibold tabular-nums">{(municipality.economics.unemploymentRate * 100).toFixed(1)}%</div>
        </div>
      </section>
    </>
  );
}