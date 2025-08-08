import Link from 'next/link';
import { loadMunicipalityList, loadMunicipalityData } from '../../../src/data/loaders';
import TabNavigation from '../../../components/TabNavigation';
import ClientChart from '../../../components/ClientChart';
import { buildEconomicRadarConfig } from '../../../components/charts/configs';
import { loadIllinoisAverages } from '../../../src/data/state';

export async function getStaticPaths() {
  const municipalities = await loadMunicipalityList();
  return { paths: municipalities.map((m) => ({ params: { id: m.id } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const municipality = await loadMunicipalityData(params.id);
  const state = await loadIllinoisAverages();
  return { props: { municipality, state } };
}

export default function EconomicsPage({ municipality, state }) {
  const { id, name, economics } = municipality;
  const radar = buildEconRadar(economics, state?.economics);
  return (
    <main className="container">
      <h1>{name} – Economics</h1>
      <TabNavigation id={id} />
      <div className="grid cols-3" style={{ marginTop: 16 }}>
        <div className="card"><h3>Median Household Income</h3><div className="value">{fmtCurrency(economics?.median_household_income)}</div></div>
        <div className="card"><h3>Median Home Value</h3><div className="value">{fmtCurrency(economics?.median_home_value)}</div></div>
        <div className="card"><h3>Median Rent</h3><div className="value">{fmtCurrency(economics?.median_rent)}</div></div>
      </div>
      <div className="grid cols-3" style={{ marginTop: 16 }}>
        <div className="card"><h3>Poverty Rate</h3><div>{fmtPercent(economics?.poverty_rate)}</div></div>
        <div className="card"><h3>Unemployment Rate</h3><div>{fmtPercent(economics?.unemployment_rate)}</div></div>
        <div className="card"><h3>Per Capita Income</h3><div>{fmtCurrency(economics?.per_capita_income)}</div></div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Economic Indicators vs Illinois Average</h3>
        {radar ? <ClientChart config={radar} height={420} /> : <div>Not available</div>}
      </div>
      <p style={{ marginTop: 24 }}><Link href={`/municipalities/${id}/`}>← Back to Overview</Link></p>
    </main>
  );
}

function fmtCurrency(v){ return v==null? '—' : `$${Number(v).toLocaleString()}` }
function fmtPercent(v){ return v==null? '—' : `${(v*100).toFixed(1)}%` }

function buildEconRadar(e, s) {
  if (!e || !s) return null;
  const labels = ['Median Income','Employment','Home Values','Education','Poverty (inverse)'];
  const current = [
    normalize(e.median_household_income, s.median_household_income_avg),
    inverse(e.unemployment_rate, s.unemployment_rate_avg),
    normalize(e.median_home_value, s.median_home_value_avg),
    null, // education placeholder (not in state summary yet)
    inverse(e.poverty_rate, s.poverty_rate_avg)
  ].map((v) => (v==null?0.5:v));
  const stateAvg = [1,1,1,1,1];
  return buildEconomicRadarConfig(labels, current, stateAvg);
}

function normalize(v, avg){ if(v==null||avg==null||avg===0) return null; return Number((v/avg).toFixed(2)); }
function inverse(v, avg){ if(v==null||avg==null||avg===0) return null; return Number((avg/v).toFixed(2)); }