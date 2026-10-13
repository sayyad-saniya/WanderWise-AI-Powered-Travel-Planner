import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TripForm from '../components/TripForm.jsx'
import { createTrip } from '../api/tripApi.js'

export default function CreateTripPage() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(payload) {
    setSubmitting(true)
    setError(null)
    try {
      const trip = await createTrip(payload)
      navigate(`/trip/${trip.token}`)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not build that itinerary. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <section style={{ background: 'var(--color-navy)', color: '#fff', padding: '72px 0 96px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--color-gold)', fontWeight: 600, marginBottom: 12, letterSpacing: '0.01em' }}>
              Plan less. Wander more.
            </p>
            <h1 style={{ color: '#fff', fontSize: '2.9rem', maxWidth: 560 }}>
              A day-by-day trip, sketched out before you've even packed.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 18, maxWidth: 480, fontSize: '1.05rem' }}>
              Tell WanderWise where you're going and what you like. It drafts a full itinerary,
              checks the forecast, and estimates the damage to your wallet — all in one page you
              can rearrange and share.
            </p>
            <div style={{ display: 'flex', gap: 28, marginTop: 40 }}>
              <HeroStat label="Itinerary" value="AI-drafted" />
              <HeroStat label="Forecast" value="Day-by-day" />
              <HeroStat label="Budget" value="Estimated up front" />
            </div>
          </div>
          <TripForm onSubmit={handleSubmit} submitting={submitting} error={error} />
        </div>
      </section>
    </div>
  )
}

function HeroStat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--color-gold)' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{label}</div>
    </div>
  )
}
