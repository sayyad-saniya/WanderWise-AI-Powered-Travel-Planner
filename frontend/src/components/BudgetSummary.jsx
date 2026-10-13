const CATEGORY_LABELS = {
  accommodation: 'Accommodation',
  food: 'Food & drink',
  activities: 'Activities',
  transport: 'Transport'
}

const CATEGORY_COLORS = {
  accommodation: 'var(--color-navy)',
  food: 'var(--color-gold)',
  activities: 'var(--color-seaglass)',
  transport: '#9b8bb4'
}

export default function BudgetSummary({ budget }) {
  if (!budget) return null

  const currency = budget.currency || 'USD'
  const format = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
  const total = budget.total || 1

  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <h3 style={{ fontSize: '1.1rem' }}>Estimated budget</h3>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-navy)' }}>
          {format(budget.total)}
        </span>
      </div>

      <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
        {Object.keys(CATEGORY_LABELS).map((key) => (
          <div
            key={key}
            style={{
              width: `${Math.max(2, ((budget[key] || 0) / total) * 100)}%`,
              background: CATEGORY_COLORS[key]
            }}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: CATEGORY_COLORS[key], flexShrink: 0 }} />
            <span style={{ color: 'var(--color-ink-soft)' }}>{label}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{format(budget[key] || 0)}</span>
          </div>
        ))}
      </div>

      {budget.notes && (
        <p style={{ fontSize: '0.78rem', marginTop: 16, color: 'var(--color-ink-soft)', fontStyle: 'italic' }}>
          {budget.notes}
        </p>
      )}
    </div>
  )
}
