import Link from 'next/link';
import { loadMunicipalityList } from '../../src/data/loaders';

export async function getStaticProps() {
  const municipalities = await loadMunicipalityList();
  return { props: { municipalities } };
}

export default function MunicipalitiesIndex({ municipalities }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Municipalities</h1>
      <ul>
        {municipalities.map((m) => (
          <li key={m.id}>
            <Link href={`/municipalities/${m.id}/`}>{m.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}