import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { getTrip, updateTripDays } from '../api/tripApi.js'
import WeatherStrip from '../components/WeatherStrip.jsx'
import BudgetSummary from '../components/BudgetSummary.jsx'
import ShareLink from '../components/ShareLink.jsx'
import DayPlanner from '../components/DayPlanner.jsx'

export default function TripViewPage() {
  const { token } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const saveTimeout = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getTrip(token)
      .then((data) => {
        if (!cancelled) setTrip(data)
      })
      .catch(() => {
        if (!cancelled) setError('We could not find that trip. Double check the link.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const handleDaysChange = useCallback(
    (newDays) => {
      setTrip((prev) => ({ ...prev, days: newDays }))
      setSaving(true)
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      saveTimeout.current = setTimeout(async () => {
        try {
          await updateTripDays(token, newDays)
        } finally {
          setSaving(false)
        }
      }, 500)
    },
    [token]
  )

  if (loading) {
    return <div className="container" style={{ padding: '64px 24px' }}>Loading your itinerary…</div>
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '64px 24px' }}>
        <h2>Trip not found</h2>
        <p style={{ marginTop: 8 }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <p style={{ color: 'var(--color-seaglass)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}>
          {trip.startDate && trip.endDate
            ? `${format(parseISO(trip.startDate), 'MMM d')} – ${format(parseISO(trip.endDate), 'MMM d, yyyy')}`
            : ''}
          {' · '}{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''} · {trip.budgetLevel?.toLowerCase()}
        </p>
        <h1 style={{ fontSize: '2.2rem' }}>{trip.destination}</h1>
      </div>

      <ShareLink url={trip.shareUrl} />

      <section>
        <h3 style={{ marginBottom: 10, fontSize: '1rem' }}>Weather while you're there</h3>
        <WeatherStrip forecast={trip.weatherForecast} />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <section>
          <h3 style={{ marginBottom: 10, fontSize: '1rem' }}>Your itinerary — drag to rearrange</h3>
          <DayPlanner days={trip.days} onDaysChange={handleDaysChange} saving={saving} />
        </section>
        <BudgetSummary budget={trip.budgetEstimate} />
      </div>
    </div>
  )
}
