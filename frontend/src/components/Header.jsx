import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.4rem', color: 'var(--color-navy)' }}>
            WanderWise
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-seaglass)', fontWeight: 600 }}>
            trip planner
          </span>
        </Link>
        <Link to="/" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
          Plan a new trip
        </Link>
      </div>
    </header>
  )
}
