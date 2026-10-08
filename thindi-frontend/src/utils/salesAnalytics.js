// Pure functions that turn a list of orders into the numbers the dashboard shows.
//
// An order looks like:
//   { id: 1001, placedAt: '2026-10-08T09:15:00', items: [{ name: 'Masala Dosa', price: 60, qty: 2 }] }

// Local calendar day of a date, as "YYYY-MM-DD".
export function toDayKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function orderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function orderItemCount(order) {
  return order.items.reduce((sum, item) => sum + item.qty, 0)
}

// Sorted (oldest -> newest) list of days that have at least one order.
export function listDayKeys(orders) {
  const days = new Set(orders.map((order) => toDayKey(new Date(order.placedAt))))
  return [...days].sort()
}

export function ordersForDay(orders, dayKey) {
  return orders.filter((order) => toDayKey(new Date(order.placedAt)) === dayKey)
}

// Headline numbers for one day's orders.
export function summarize(orders) {
  const revenue = orders.reduce((sum, order) => sum + orderTotal(order), 0)
  const itemsSold = orders.reduce((sum, order) => sum + orderItemCount(order), 0)
  return {
    revenue,
    orderCount: orders.length,
    itemsSold,
    averageOrderValue: orders.length ? revenue / orders.length : 0,
  }
}

// Revenue and order count for every hour from startHour to endHour (inclusive),
// including hours with no sales so the chart has no gaps.
export function revenueByHour(orders, startHour = 8, endHour = 18) {
  const hours = []
  for (let hour = startHour; hour <= endHour; hour++) {
    hours.push({ hour, revenue: 0, orderCount: 0 })
  }
  for (const order of orders) {
    const hour = new Date(order.placedAt).getHours()
    const bucket = hours.find((entry) => entry.hour === hour)
    if (bucket) {
      bucket.revenue += orderTotal(order)
      bucket.orderCount += 1
    }
  }
  return hours
}

// Quantity and revenue per menu item, best sellers first.
export function itemsSold(orders, limit = 8) {
  const byName = new Map()
  for (const order of orders) {
    for (const item of order.items) {
      const entry = byName.get(item.name) ?? { name: item.name, qty: 0, revenue: 0 }
      entry.qty += item.qty
      entry.revenue += item.price * item.qty
      byName.set(item.name, entry)
    }
  }
  return [...byName.values()].sort((a, b) => b.qty - a.qty).slice(0, limit)
}

// One entry per day key: { dayKey, revenue, orderCount }.
export function revenueByDay(orders, dayKeys) {
  return dayKeys.map((dayKey) => {
    const summary = summarize(ordersForDay(orders, dayKey))
    return { dayKey, revenue: summary.revenue, orderCount: summary.orderCount }
  })
}

// Percent change from previous to current, or null when there is no baseline.
export function percentChange(current, previous) {
  if (!previous) return null
  return ((current - previous) / previous) * 100
}