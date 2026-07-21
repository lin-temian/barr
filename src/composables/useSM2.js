// Упрощённый SM-2 (SuperMemo-2) с бинарным вводом — "Помню" / "Не помню".
// Заменяет прежний фиксированный Leitner ([0,1,3,7,14,30] дней по номеру "коробки").

const OLD_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30] // для миграции старых записей вида {box, due}
const MIN_EASE = 1.3
const DEFAULT_EASE = 2.5

// Старая запись — {box, due}. Новая — {ease, interval, reps, lapses, due, lastReviewed}.
// Если запись уже в новом формате (есть ease) — возвращаем как есть, без изменений.
export function migrateSrsEntry(entry) {
  if (!entry) return null
  if (typeof entry.ease === 'number') return entry
  const box = entry.box || 0
  return {
    ease: DEFAULT_EASE,
    interval: OLD_INTERVALS_DAYS[Math.min(box, OLD_INTERVALS_DAYS.length - 1)] || 0,
    reps: box,
    lapses: 0,
    due: entry.due ?? Date.now(),
    lastReviewed: entry.lastReviewed ?? Date.now(),
  }
}

export function migrateSrsMap(map) {
  const out = {}
  for (const [id, entry] of Object.entries(map || {})) out[id] = migrateSrsEntry(entry)
  return out
}

// correct: true = "Помню" (q=4), false = "Не помню" (q=1, почти полный сброс)
export function reviewSM2(entry, correct) {
  const cur = migrateSrsEntry(entry) || { ease: DEFAULT_EASE, interval: 0, reps: 0, lapses: 0 }
  const q = correct ? 4 : 1
  let { ease, interval, reps, lapses = 0 } = cur

  if (q < 3) {
    reps = 0
    interval = 0 // снова "на повторение" почти сразу (следующий день)
    lapses += 1
  } else {
    reps += 1
    if (reps === 1) interval = 1
    else if (reps === 2) interval = 6
    else interval = Math.round(interval * ease)
  }

  ease = Math.max(MIN_EASE, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

  return {
    ease,
    interval,
    reps,
    lapses,
    due: Date.now() + interval * 86400000,
    lastReviewed: Date.now(),
  }
}
