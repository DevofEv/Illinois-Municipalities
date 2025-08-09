import type { Metadata } from "next";
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
      url: website,
    },
  };
}

export default async function MunicipalityPage({ params }: { params: Promise<PageParams> }) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    return null;
  }

  const year = municipality.incorporationDate?.slice(0, 4) ?? "—";

  return (
    <>
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
    </>
  );
}