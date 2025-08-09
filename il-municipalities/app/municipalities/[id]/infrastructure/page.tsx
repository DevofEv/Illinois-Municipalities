import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function InfrastructurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    return null;
  }

  const infra = municipality.infrastructure ?? {};

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">Transportation</h2>
          <ul className="list-disc list-inside text-sm">
            <li>Public Transit: {infra.transportation?.hasPublicTransit ? 'Yes' : 'No'}</li>
            <li>Major Highways: {infra.transportation?.majorHighways?.join(', ') ?? '—'}</li>
            <li>Airports: {infra.transportation?.airports?.join(', ') ?? '—'}</li>
            <li>Train Stations: {infra.transportation?.trainStations?.join(', ') ?? '—'}</li>
          </ul>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold mb-2">Utilities</h2>
          <ul className="list-disc list-inside text-sm">
            <li>Electricity: {infra.utilities?.electricityProvider ?? '—'}</li>
            <li>Gas: {infra.utilities?.gasProvider ?? '—'}</li>
            <li>Water: {infra.utilities?.waterProvider ?? '—'}</li>
          </ul>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-2">Schools</h2>
        <div className="text-sm">District: {infra.schools?.schoolDistrict ?? '—'}</div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="rounded border p-3 text-center">
            <div className="text-xs text-gray-500">Elementary</div>
            <div className="text-lg font-semibold">{infra.schools?.elementary ?? '—'}</div>
          </div>
          <div className="rounded border p-3 text-center">
            <div className="text-xs text-gray-500">Middle</div>
            <div className="text-lg font-semibold">{infra.schools?.middle ?? '—'}</div>
          </div>
          <div className="rounded border p-3 text-center">
            <div className="text-xs text-gray-500">High</div>
            <div className="text-lg font-semibold">{infra.schools?.high ?? '—'}</div>
          </div>
        </div>
      </section>
    </>
  );
}