import Link from "next/link";
import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function InfrastructurePage({ params }: { params: Promise<{ id: string }> }) {
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

  const infra = municipality.infrastructure ?? {};

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 profile-page">
      <nav className="tabs flex gap-2 overflow-x-auto">
        <Link href={`/municipalities/${id}`} className="px-3 py-2 rounded border">Overview</Link>
        <Link href={`/municipalities/${id}/demographics`} className="px-3 py-2 rounded border">Demographics</Link>
        <Link href={`/municipalities/${id}/economics`} className="px-3 py-2 rounded border">Economics</Link>
        <Link href={`/municipalities/${id}/government`} className="px-3 py-2 rounded border">Government</Link>
        <Link href={`/municipalities/${id}/history`} className="px-3 py-2 rounded border">History</Link>
        <Link href={`/municipalities/${id}/infrastructure`} className="px-3 py-2 rounded border bg-gray-100">Infrastructure</Link>
      </nav>

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
    </main>
  );
}