import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
  { slug: '', label: 'Overview' },
  { slug: 'demographics', label: 'Demographics' },
  { slug: 'economics', label: 'Economics' },
  { slug: 'government', label: 'Government' },
  { slug: 'history', label: 'History' },
  { slug: 'infrastructure', label: 'Infrastructure' },
];

export default function TabNavigation({ id }) {
  const router = useRouter();
  const base = `/municipalities/${id}`;
  const path = router.asPath.replace(/\/$/, '');
  return (
    <nav className="tabs navigation" role="tablist" aria-label="Municipality Sections">
      {tabs.map((t) => {
        const href = t.slug ? `${base}/${t.slug}/` : `${base}/`;
        const active = path === href.replace(/\/$/, '');
        return (
          <Link key={t.slug || 'overview'} href={href} className={`tab${active ? ' active' : ''}`} role="tab" aria-selected={active}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}