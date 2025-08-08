import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ProfileHeader from '../../components/ProfileHeader';
import TabNavigation from '../../components/TabNavigation';
import { loadMunicipalityList, loadMunicipalityData } from '../../src/data/loaders';

import ClientChart from '../../components/ClientChart';
import { buildPopulationTrendConfig } from '../../components/charts/configs';

export async function getStaticPaths() {
  const municipalities = await loadMunicipalityList();
  return {
    paths: municipalities.map((m) => ({ params: { id: m.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const municipality = await loadMunicipalityData(params.id);
  return { props: { municipality } };
}

export default function MunicipalityProfile({ municipality }) {
  if (!municipality) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Municipality Not Found</h1>
        <p>
          <Link href="/municipalities/">Back to list</Link>
        </p>
      </main>
    );
  }

  const { id, name, type, county, population, geography, links } = municipality;
  const populationHistory = [
    population?.census_1990,
    population?.census_2000,
    population?.census_2010,
    population?.census_2020,
    population?.current,
  ].filter((v) => typeof v === 'number');
  const labels = ['1990', '2000', '2010', '2020', String(population?.estimate_year || '')].filter(Boolean);

  return (
    <main className="profile-page" style={{ padding: 24 }}>
      <Head>
        <title>{name}, Illinois - Municipal Profile</title>
        <meta name="description" content={`Population: ${population?.current}. ${name} is a ${type} in ${county} County, Illinois.`} />
        <meta property="og:title" content={`${name}, IL Profile`} />
        <meta property="og:description" content={`${name} profile`} />
        <meta property="og:image" content={`/api/og/${id}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'City',
              name,
              containedInPlace: { '@type': 'State', name: 'Illinois' },
              population: population?.current,
              areaTotal: geography?.total_area_sq_mi,
              url: links?.wikipedia || '',
            }),
          }}
        />
      </Head>

      <ProfileHeader municipality={municipality} />
      <TabNavigation id={id} />

      <section style={{ marginTop: 24 }}>
        <h2>Overview</h2>
        <ul>
          <li>Population: {population?.current?.toLocaleString?.() || 'N/A'}</li>
          <li>Area: {geography?.total_area_sq_mi ?? '—'} sq mi</li>
          <li>Density: {geography?.population_density?.toLocaleString?.() || '—'} / sq mi</li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Population Trends</h2>
        <ClientChart config={buildPopulationTrendConfig(labels, populationHistory)} />
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .header { flex-direction: column; text-align: center; }
          .chart-container { height: 300px; }
        }
        @media print {
          .navigation, .action-buttons, .interactive-elements { display: none; }
          .chart-container { page-break-inside: avoid; }
        }
      `}</style>


    </main>
  );
}

import { useEffect } from 'react';

