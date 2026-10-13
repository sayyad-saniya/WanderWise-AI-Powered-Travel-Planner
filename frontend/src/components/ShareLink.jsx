import { useState } from 'react'

export default function ShareLink({ url }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — the visible input still lets people select & copy manually
    }
  }

  return (
    <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <input
        readOnly
        value={url}
        onFocus={(e) => e.target.select()}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          fontSize: '0.85rem',
          color: 'var(--color-ink-soft)'
        }}
      />
      <button className="btn btn-primary" onClick={handleCopy} style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
