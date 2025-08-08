import Link from 'next/link';
import TabNavigation from '../../../components/TabNavigation';
import ClientChart from '../../../components/ClientChart';
import { buildRacialDonutConfig } from '../../../components/charts/configs';
import { loadMunicipalityList, loadMunicipalityData } from '../../../src/data/loaders';

export async function getStaticPaths() {
  const municipalities = await loadMunicipalityList();
  return { paths: municipalities.map((m) => ({ params: { id: m.id } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const municipality = await loadMunicipalityData(params.id);
  return { props: { municipality } };
}

export default function DemographicsPage({ municipality }) {
  const { id, name, demographics } = municipality;
  const rc = demographics?.racial_composition;
  const labels = ['White', 'Black', 'Asian', 'Hispanic', 'Other'];
  const values = rc ? [rc.white, rc.black, rc.asian, rc.hispanic, rc.other] : [];
  return (
    <main className="container">
      <h1>{name} – Demographics</h1>
      <TabNavigation id={id} />

      <div className="grid cols-3" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Median Age</h3>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{demographics?.median_age ?? '—'}</div>
        </div>
        <div className="card">
          <h3>Racial Composition</h3>
          {values.length ? (
            <ClientChart config={buildRacialDonutConfig(labels, values)} />
          ) : (
            <div>Not available</div>
          )}
        </div>
        <div className="card">
          <h3>Education</h3>
          <ul>
            <li>HS Graduate+: {fmtPercent(demographics?.education?.high_school_graduate)}</li>
            <li>Bachelor's+: {fmtPercent(demographics?.education?.bachelors_degree)}</li>
            <li>Graduate Degree: {fmtPercent(demographics?.education?.graduate_degree)}</li>
          </ul>
        </div>
      </div>

      <p style={{ marginTop: 24 }}><Link href={`/municipalities/${id}/`}>← Back to Overview</Link></p>
    </main>
  );
}

function fmtPercent(v){ return v==null? '—' : `${(v*100).toFixed(1)}%` }