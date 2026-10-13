import { useState } from 'react'

const PREFERENCE_OPTIONS = [
  'food & drink', 'museums & history', 'nature & hiking', 'nightlife',
  'shopping', 'beaches', 'architecture', 'local culture'
]

const BUDGET_LEVELS = [
  { value: 'BUDGET', label: 'Budget' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'LUXURY', label: 'Luxury' }
]

export default function TripForm({ onSubmit, submitting, error }) {
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [budgetLevel, setBudgetLevel] = useState('MODERATE')
  const [preferences, setPreferences] = useState([])
  const [notes, setNotes] = useState('')

  function togglePreference(pref) {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      destination,
      startDate,
      endDate,
      travelers: Number(travelers),
      budgetLevel,
      preferences,
      notes
    })
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
  const inputStyle = {
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    background: '#fff'
  }
  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-navy)' }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={fieldStyle}>
        <label style={labelStyle} htmlFor="destination">Where are you headed?</label>
        <input
          id="destination"
          style={inputStyle}
          placeholder="e.g. Lisbon, Portugal"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="startDate">Departing</label>
          <input id="startDate" type="date" style={inputStyle} value={startDate}
                 onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="endDate">Returning</label>
          <input id="endDate" type="date" style={inputStyle} value={endDate}
                 min={startDate || undefined}
                 onChange={(e) => setEndDate(e.target.value)} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="travelers">Travelers</label>
          <input id="travelers" type="number" min={1} max={20} style={inputStyle}
                 value={travelers} onChange={(e) => setTravelers(e.target.value)} required />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="budgetLevel">Budget level</label>
          <select id="budgetLevel" style={inputStyle} value={budgetLevel}
                  onChange={(e) => setBudgetLevel(e.target.value)}>
            {BUDGET_LEVELS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>What do you enjoy?</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PREFERENCE_OPTIONS.map((pref) => {
            const active = preferences.includes(pref)
            return (
              <button
                type="button"
                key={pref}
                onClick={() => togglePreference(pref)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: '1px solid ' + (active ? 'var(--color-navy)' : 'var(--color-border)'),
                  background: active ? 'var(--color-navy)' : '#fff',
                  color: active ? '#fff' : 'var(--color-ink)',
                  fontSize: '0.82rem',
                  fontWeight: 500
                }}
              >
                {pref}
              </button>
            )
          })}
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle} htmlFor="notes">Anything else to plan around? (optional)</label>
        <textarea
          id="notes"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Traveling with kids, mobility needs, a special occasion..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{error}</p>
      )}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Building your itinerary…' : 'Build my itinerary'}
      </button>
    </form>
  )
}
