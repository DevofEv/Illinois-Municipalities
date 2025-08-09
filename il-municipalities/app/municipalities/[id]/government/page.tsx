import { getMunicipalityByIdOrSlug, getStaticIds } from "@/lib/municipalities";

export async function generateStaticParams() {
  const ids = await getStaticIds();
  return ids.map((id) => ({ id }));
}

export default async function GovernmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const municipality = await getMunicipalityByIdOrSlug(id);
  if (!municipality) {
    return null;
  }

  type MayorObj = { name?: string; party?: string; termEnds?: string };
  const mayorRaw = municipality.government.mayor;
  const mayor: MayorObj = typeof mayorRaw === 'string' ? { name: mayorRaw } : (mayorRaw ?? {});
  const address = typeof municipality.government.address === 'string' ? municipality.government.address : undefined;

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded border p-4 space-y-3">
          <h2 className="font-semibold">Local Government</h2>
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Government Type</div>
            <div className="font-medium">{municipality.government.type}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Mayor/President</div>
            <div>{mayor.name ?? '—'} {mayor.party ? `(${mayor.party})` : null}</div>
          </div>
          {mayor.termEnds ? (
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Term Ends</div>
              <div>{mayor.termEnds}</div>
            </div>
          ) : null}
        </div>

        <div className="rounded border p-4 space-y-3">
          <h2 className="font-semibold">Contact Information</h2>
          {municipality.government.website ? (
            <div><a className="text-blue-600 underline" href={String(municipality.government.website)} target="_blank" rel="noreferrer">Website</a></div>
          ) : null}
          {municipality.government.phone ? (
            <div><a className="text-blue-600 underline" href={`tel:${municipality.government.phone}`}>{municipality.government.phone}</a></div>
          ) : null}
          {address ? (
            <div className="text-sm text-gray-700">{address}</div>
          ) : null}
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-2">Tax Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded border p-3">
            <div className="text-xs text-gray-500">Sales Tax</div>
            <div className="text-lg font-semibold">{municipality.taxes?.salesTaxRate != null ? `${(municipality.taxes.salesTaxRate * 100).toFixed(2)}%` : '—'}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-xs text-gray-500">Property Tax</div>
            <div className="text-lg font-semibold">{municipality.taxes?.propertyTaxRate != null ? `${(municipality.taxes.propertyTaxRate * 100).toFixed(2)}%` : '—'}</div>
          </div>
          <div className="rounded border p-3">
            <div className="text-xs text-gray-500">Local Income Tax</div>
            <div className="text-lg font-semibold">{municipality.taxes?.incomeTaxLocal != null ? `${(municipality.taxes.incomeTaxLocal * 100).toFixed(2)}%` : '—'}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">Rates as of {new Date(municipality.lastUpdated).toLocaleDateString()}</div>
      </section>
    </>
  );
}