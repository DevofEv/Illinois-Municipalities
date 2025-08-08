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

export default function HistoryPage({ municipality }) {
  const { id, name, history } = municipality;
  const events = history?.historical_events || [];
  return (
    <main className="container">
      <h1>{name} – History</h1>
      <TabNavigation id={id} />

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Timeline</h3>
        <ul>
          {events.length === 0 && <li>No historical events available.</li>}
          {events.map((e, idx) => (
            <li key={idx}><strong>{e.year}:</strong> {e.event || e.title}</li>
          ))}
        </ul>
      </div>

      <p style={{ marginTop: 24 }}><Link href={`/municipalities/${id}/`}>← Back to Overview</Link></p>
    </main>
  );
}