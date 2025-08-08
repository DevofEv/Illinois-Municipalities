import Link from 'next/link';
import TabNavigation from '../../../components/TabNavigation';
import { loadMunicipalityList, loadMunicipalityData } from '../../../src/data/loaders';

export async function getStaticPaths() {
  const municipalities = await loadMunicipalityList();
  return { paths: municipalities.map((m) => ({ params: { id: m.id } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const municipality = await loadMunicipalityData(params.id);
  return { props: { municipality } };
}

export default function InfrastructurePage({ municipality }) {
  const { id, name, infrastructure } = municipality;
  const schools = infrastructure?.schools;
  const trans = infrastructure?.transportation;
  const util = infrastructure?.utilities;
  return (
    <main className="container">
      <h1>{name} – Infrastructure</h1>
      <TabNavigation id={id} />

      <div className="grid cols-3" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Schools</h3>
          <p><strong>District:</strong> {schools?.school_district ?? '—'}</p>
          <p><strong>Elementary:</strong> {schools?.elementary ?? '—'}</p>
          <p><strong>Middle:</strong> {schools?.middle ?? '—'}</p>
          <p><strong>High:</strong> {schools?.high ?? '—'}</p>
        </div>
        <div className="card">
          <h3>Transportation</h3>
          <p><strong>Public Transit:</strong> {trans?.has_public_transit ? 'Yes' : (trans ? 'No' : '—')}</p>
          <p><strong>Highways:</strong> {trans?.major_highways?.join(', ') || '—'}</p>
          <p><strong>Airports:</strong> {trans?.airports?.join(', ') || '—'}</p>
          <p><strong>Train Stations:</strong> {trans?.train_stations?.join(', ') || '—'}</p>
        </div>
        <div className="card">
          <h3>Utilities</h3>
          <p><strong>Electric:</strong> {util?.electricity_provider ?? '—'}</p>
          <p><strong>Gas:</strong> {util?.gas_provider ?? '—'}</p>
          <p><strong>Water:</strong> {util?.water_provider ?? '—'}</p>
        </div>
      </div>

      <p style={{ marginTop: 24 }}><Link href={`/municipalities/${id}/`}>← Back to Overview</Link></p>
    </main>
  );
}