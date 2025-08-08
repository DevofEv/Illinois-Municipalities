import Link from "next/link";
import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function EconomicsPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 profile-page">
      <nav className="tabs flex gap-2 overflow-x-auto">
        <Link href={`/municipalities/${id}`} className="px-3 py-2 rounded border">Overview</Link>
        <Link href={`/municipalities/${id}/demographics`} className="px-3 py-2 rounded border">Demographics</Link>
        <Link href={`/municipalities/${id}/economics`} className="px-3 py-2 rounded border bg-gray-100">Economics</Link>
        <Link href={`/municipalities/${id}/government`} className="px-3 py-2 rounded border">Government</Link>
        <Link href={`/municipalities/${id}/history`} className="px-3 py-2 rounded border">History</Link>
        <Link href={`/municipalities/${id}/infrastructure`} className="px-3 py-2 rounded border">Infrastructure</Link>
      </nav>

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
    </main>
  );
}