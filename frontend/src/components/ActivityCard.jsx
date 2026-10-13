import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CATEGORY_COLORS = {
  sightseeing: 'var(--color-navy)',
  food: 'var(--color-gold-dark)',
  transport: '#9b8bb4',
  leisure: 'var(--color-seaglass)',
  culture: '#c1543c'
}

export default function ActivityCard({ activity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id })

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const dotColor = CATEGORY_COLORS[activity.category] || 'var(--color-seaglass)'

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="card"
      style={{ ...dragStyle, padding: '12px 14px', cursor: 'grab', marginBottom: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)' }}>{activity.time}</span>
        {activity.estimatedCost > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--color-ink-soft)' }}>
            ~${Math.round(activity.estimatedCost)}
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 3 }}>{activity.title}</div>
      {activity.description && (
        <p style={{ fontSize: '0.78rem' }}>{activity.description}</p>
      )}
    </div>
  )
}
