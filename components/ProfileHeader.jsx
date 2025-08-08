import Link from 'next/link';

export default function ProfileHeader({ municipality }) {
  const { name, type, county, population, geography, government, links } = municipality;
  return (
    <header className="header" style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <div>
        <span className="badge">{type}</span>
        <h1 style={{ margin: '8px 0' }}>{name}</h1>
        <div style={{ color: 'var(--muted)' }}>{county} County, Illinois</div>
      </div>
      <div className="actions">
        <button className="button" onClick={() => navigator.share?.({ title: `${name} Profile`, url: typeof window !== 'undefined' ? window.location.href : '' })}>🔗 Share</button>
        {links?.wikipedia && (
          <a className="button" href={links.wikipedia} target="_blank" rel="noreferrer">🌐 Wikipedia</a>
        )}
      </div>
      <div style={{ flexBasis: '100%', marginTop: 8 }} className="quick-stats grid cols-4" />
      <div className="grid cols-4" style={{ width: '100%' }}>
        <Stat label="Population" value={population?.current?.toLocaleString?.() ?? '—'} />
        <Stat label="Area" value={geography?.total_area_sq_mi ? `${geography.total_area_sq_mi} sq mi` : '—'} />
        <Stat label="Density" value={geography?.population_density ? `${Math.round(geography.population_density).toLocaleString()}/sq mi` : '—'} />
        <Stat label="Incorporated" value={municipality?.history?.incorporated ?? '—'} />
      </div>
    </header>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}