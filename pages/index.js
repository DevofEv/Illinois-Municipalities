import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Illinois Municipalities</h1>
      <p>Browse detailed profiles for cities, villages, and towns.</p>
      <p>
        <Link href="/municipalities/">Go to Municipalities Directory →</Link>
      </p>
    </main>
  );
}