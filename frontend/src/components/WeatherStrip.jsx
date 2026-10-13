import { format, parseISO } from 'date-fns'

export default function WeatherStrip({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="card" style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>
        No forecast available yet — weather usually shows up once your trip is within about 5 days,
        or once an OpenWeatherMap key is configured.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
      {forecast.map((day) => (
        <div key={day.date} className="card" style={{ minWidth: 120, padding: '14px 16px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-navy)' }}>
            {format(parseISO(day.date), 'EEE, MMM d')}
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt={day.condition}
            width={44}
            height={44}
            style={{ margin: '4px auto' }}
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>{day.condition}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 4 }}>
            {Math.round(day.tempMaxC)}° <span style={{ color: 'var(--color-ink-soft)', fontWeight: 400 }}>/ {Math.round(day.tempMinC)}°</span>
          </div>
        </div>
      ))}
    </div>
  )
}
