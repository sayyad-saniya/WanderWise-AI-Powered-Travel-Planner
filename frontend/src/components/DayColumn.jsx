import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { format, parseISO } from 'date-fns'
import ActivityCard from './ActivityCard.jsx'

export default function DayColumn({ day, containerId }) {
  const { setNodeRef, isOver } = useDroppable({ id: containerId })
  const activityIds = day.activities.map((a) => a.id)

  const dayTotal = day.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0)

  return (
    <div
      style={{
        minWidth: 260,
        maxWidth: 260,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ marginBottom: 10, paddingLeft: 2 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-gold-dark)', letterSpacing: '0.02em' }}>
          DAY {day.dayNumber}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-navy)' }}>
          {day.date ? format(parseISO(day.date), 'EEEE, MMM d') : `Day ${day.dayNumber}`}
        </div>
        {dayTotal > 0 && (
          <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-soft)' }}>~${Math.round(dayTotal)} planned</div>
        )}
      </div>

      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          minHeight: 120,
          borderRadius: 'var(--radius-md)',
          border: isOver ? '2px dashed var(--color-gold)' : '2px dashed transparent',
          padding: 4,
          transition: 'border-color 0.12s ease'
        }}
      >
        <SortableContext id={containerId} items={activityIds} strategy={verticalListSortingStrategy}>
          {day.activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
          {day.activities.length === 0 && (
            <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-soft)', padding: '10px 4px' }}>
              Drag an activity here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}
