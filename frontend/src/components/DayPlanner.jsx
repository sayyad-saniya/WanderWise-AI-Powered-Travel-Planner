import { useEffect, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import ActivityCard from './ActivityCard.jsx'
import DayColumn from './DayColumn.jsx'

const containerId = (dayNumber) => `day-${dayNumber}`

export default function DayPlanner({ days, onDaysChange, saving }) {
  const [items, setItems] = useState(days)
  const [activeActivity, setActiveActivity] = useState(null)

  // Keep in sync when a fresh trip loads (identified by the first day's activity ids).
  useEffect(() => {
    setItems(days)
  }, [days])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function findDay(activityId) {
    return items.find((d) => d.activities.some((a) => a.id === activityId))
  }

  function findDayByContainer(id) {
    return items.find((d) => containerId(d.dayNumber) === id) || findDay(id)
  }

  function handleDragStart(event) {
    const day = findDay(event.active.id)
    const activity = day?.activities.find((a) => a.id === event.active.id)
    setActiveActivity(activity || null)
  }

  function handleDragOver(event) {
    const { active, over } = event
    if (!over) return
    const activeDay = findDay(active.id)
    const overDay = findDayByContainer(over.id)
    if (!activeDay || !overDay || activeDay.dayNumber === overDay.dayNumber) return

    setItems((prev) => {
      const activeDayIdx = prev.findIndex((d) => d.dayNumber === activeDay.dayNumber)
      const overDayIdx = prev.findIndex((d) => d.dayNumber === overDay.dayNumber)
      const activeItems = [...prev[activeDayIdx].activities]
      const overItems = [...prev[overDayIdx].activities]

      const activeIndex = activeItems.findIndex((a) => a.id === active.id)
      if (activeIndex === -1) return prev
      const [moved] = activeItems.splice(activeIndex, 1)

      let overIndex = overItems.findIndex((a) => a.id === over.id)
      if (overIndex === -1) overIndex = overItems.length

      overItems.splice(overIndex, 0, moved)

      const next = [...prev]
      next[activeDayIdx] = { ...prev[activeDayIdx], activities: activeItems }
      next[overDayIdx] = { ...prev[overDayIdx], activities: overItems }
      return next
    })
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveActivity(null)
    if (!over) return

    const activeDay = findDay(active.id)
    if (!activeDay) return
    const overDay = findDayByContainer(over.id)
    if (!overDay) return

    let working = items

    if (activeDay.dayNumber === overDay.dayNumber) {
      const dayIdx = items.findIndex((d) => d.dayNumber === activeDay.dayNumber)
      const activities = items[dayIdx].activities
      const oldIndex = activities.findIndex((a) => a.id === active.id)
      const newIndex = activities.findIndex((a) => a.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(activities, oldIndex, newIndex)
        working = items.map((d, i) => (i === dayIdx ? { ...d, activities: reordered } : d))
      }
    }

    const normalized = working.map((d) => ({
      ...d,
      activities: d.activities.map((a, i) => ({ ...a, orderIndex: i }))
    }))

    setItems(normalized)
    onDaysChange(normalized)
  }

  return (
    <div>
      {saving && (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-seaglass)', marginBottom: 8 }}>
          Saving your changes…
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 14 }}>
          {items.map((day) => (
            <DayColumn key={day.dayNumber} day={day} containerId={containerId(day.dayNumber)} />
          ))}
        </div>
        <DragOverlay>{activeActivity ? <ActivityCard activity={activeActivity} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
