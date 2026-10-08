const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('en-IN')

// 1234 -> "₹1,234"
export function formatCurrency(value) {
  return currency.format(value)
}

// 12500 -> "₹12.5K", 800 -> "₹800" (used for chart axis ticks).
// Written by hand because Indian-locale compact formatting abbreviates thousands as "T".
export function formatCompactCurrency(value) {
  if (Math.abs(value) < 1000) return currency.format(value)
  const thousands = value / 1000
  return `₹${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`
}

export function formatNumber(value) {
  return number.format(value)
}

// 13 -> "1 PM"
export function formatHour(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12} ${suffix}`
}

// "2026-10-08" -> Date at local noon (avoids timezone day-shift bugs)
function dayKeyToDate(dayKey) {
  return new Date(`${dayKey}T12:00:00`)
}

// "2026-10-08" -> "Thu 8 Oct"
export function formatDayLabel(dayKey) {
  return dayKeyToDate(dayKey).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// "2026-10-08" -> "Thu 8" (short label for chart axes)
export function formatDayShort(dayKey) {
  return dayKeyToDate(dayKey).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
  })
}