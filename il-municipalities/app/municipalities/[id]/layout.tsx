import Link from "next/link";
import { notFound } from "next/navigation";
import { getMunicipalityByIdOrSlug } from "@/lib/municipalities";

export default async function MunicipalityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    notFound();
  }

  const population = municipality.population.current.toLocaleString();
  const area = municipality.totalArea ?? municipality.landArea;
  const density = municipality.population.density;
  const year = municipality.incorporationDate?.slice(0, 4) ?? "—";
  const website = municipality.government.website ? String(municipality.government.website) : undefined;

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 profile-page">
      <header className="rounded border p-5 space-y-3 header">
        <div className="inline-flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-blue-50 border text-blue-700">{municipality.type}</span>
          <h1 className="text-2xl font-semibold">{municipality.name}</h1>
        </div>
        <div className="text-gray-600">{municipality.county} County, Illinois</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded border p-3"><div className="text-xs text-gray-500">Population</div><div className="font-medium tabular-nums">{population}</div></div>
          <div className="rounded border p-3"><div className="text-xs text-gray-500">Area</div><div className="font-medium">{area} sq mi</div></div>
          <div className="rounded border p-3"><div className="text-xs text-gray-500">Density</div><div className="font-medium tabular-nums">{density.toLocaleString()}/sq mi</div></div>
          <div className="rounded border p-3"><div className="text-xs text-gray-500">Incorporated</div><div className="font-medium">{year}</div></div>
        </div>
        <div className="flex flex-wrap gap-2 action-buttons">
          <button className="px-3 py-2 rounded border">⭐ Compare</button>
          <button className="px-3 py-2 rounded border">🔗 Share</button>
          <button className="px-3 py-2 rounded border">📥 Download Data</button>
          {website ? (
            <a className="px-3 py-2 rounded border" href={website} target="_blank" rel="noreferrer">🌐 Official Website</a>
          ) : null}
        </div>
      </header>

      <nav className="tabs flex gap-2 overflow-x-auto">
        <Link href={`/municipalities/${id}`} className="px-3 py-2 rounded border">Overview</Link>
        <Link href={`/municipalities/${id}/demographics`} className="px-3 py-2 rounded border">Demographics</Link>
        <Link href={`/municipalities/${id}/economics`} className="px-3 py-2 rounded border">Economics</Link>
        <Link href={`/municipalities/${id}/government`} className="px-3 py-2 rounded border">Government</Link>
        <Link href={`/municipalities/${id}/history`} className="px-3 py-2 rounded border">History</Link>
        <Link href={`/municipalities/${id}/infrastructure`} className="px-3 py-2 rounded border">Infrastructure</Link>
      </nav>

      {children}
    </main>
  );
}