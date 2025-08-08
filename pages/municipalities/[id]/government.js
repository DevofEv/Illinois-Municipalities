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

export default function GovernmentPage({ municipality }) {
  const { id, name, government, taxes } = municipality;
  const mayor = government?.mayor;
  return (
    <main className="container">
      <h1>{name} – Government</h1>
      <TabNavigation id={id} />

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Local Government</h3>
          <p><strong>Type:</strong> {government?.government_type ?? '—'}</p>
          <p><strong>Mayor/President:</strong> {mayor ? `${mayor.name}${mayor.party ? ` (${mayor.party})` : ''}` : '—'}</p>
          <p><strong>Term Ends:</strong> {mayor?.term_ends ?? '—'}</p>
          <p><strong>Website:</strong> {government?.website ? <a href={government.website} target="_blank" rel="noreferrer">{government.website}</a> : '—'}</p>
        </div>
        <div className="card">
          <h3>Contact</h3>
          <p><strong>Phone:</strong> {government?.phone ?? '—'}</p>
          <p><strong>Address:</strong> {formatAddress(government?.address)}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Tax Information</h3>
        <table>
          <tbody>
            <tr><td>Sales Tax</td><td>{fmtPercent(taxes?.sales_tax_rate)}</td></tr>
            <tr><td>Property Tax</td><td>{fmtPercent(taxes?.property_tax_rate)}</td></tr>
            <tr><td>Local Income Tax</td><td>{fmtPercent(taxes?.income_tax_local)}</td></tr>
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 24 }}><Link href={`/municipalities/${id}/`}>← Back to Overview</Link></p>
    </main>
  );
}

function fmtPercent(v){ return v==null? '—' : `${(v*100).toFixed(2)}%` }
function formatAddress(a){ if(!a) return '—'; return `${a.street || ''}${a.city?`, ${a.city}`:''}${a.state?`, ${a.state}`:''} ${a.zip||''}` }