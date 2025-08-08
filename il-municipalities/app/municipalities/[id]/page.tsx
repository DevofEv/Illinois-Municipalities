import type { Metadata } from "next";
import Link from "next/link";
import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

interface PageParams {
  id: string;
}

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) return { title: "Municipality Not Found" };
  const population = municipality.population.current.toLocaleString();
  const county = municipality.county;
  const type = municipality.type;
  const name = municipality.name;
  const website = municipality.government.website ? String(municipality.government.website) : undefined;
  return {
    title: `${name}, Illinois - Municipal Profile`,
    description: `Population: ${population}. ${name} is a ${type} in ${county} County, Illinois. View demographics, economics, and government information.`,
    openGraph: {
      title: `${name}, IL Profile`,
      description: `Population ${population} • ${type} in ${county} County`,
      images: [{ url: `/api/og/${municipality.id}` }],
      url: website,
    },
  };
}

export default async function MunicipalityPage({ params }: { params: Promise<PageParams> }) {
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
        <Link href={`/municipalities/${id}`} className="px-3 py-2 rounded border bg-gray-100">Overview</Link>
        <Link href={`/municipalities/${id}/demographics`} className="px-3 py-2 rounded border">Demographics</Link>
        <Link href={`/municipalities/${id}/economics`} className="px-3 py-2 rounded border">Economics</Link>
        <Link href={`/municipalities/${id}/government`} className="px-3 py-2 rounded border">Government</Link>
        <Link href={`/municipalities/${id}/history`} className="px-3 py-2 rounded border">History</Link>
        <Link href={`/municipalities/${id}/infrastructure`} className="px-3 py-2 rounded border">Infrastructure</Link>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded border p-4 space-y-3">
          <h2 className="font-semibold">About</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><div className="text-gray-500">Founded</div><div>{municipality.history?.founded ?? "—"}</div></div>
            <div><div className="text-gray-500">Incorporated</div><div>{municipality.history?.incorporated ?? year}</div></div>
            <div><div className="text-gray-500">Government Type</div><div>{municipality.government.type}</div></div>
            <div><div className="text-gray-500">Time Zone</div><div>America/Chicago</div></div>
          </div>
        </div>

        <div className="rounded border p-4 space-y-3">
          <h2 className="font-semibold">Location</h2>
          <div className="text-sm">Lat {municipality.coordinates.lat}, Lng {municipality.coordinates.lng}</div>
          <div className="h-60 rounded border grid place-items-center text-gray-500">Map placeholder</div>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Population Trends</h2>
        <div className="chart-container h-72 rounded border grid place-items-center text-gray-500">Population chart placeholder</div>
      </section>
    </main>
  );
}