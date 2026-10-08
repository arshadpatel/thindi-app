// Sample orders for the vendor dashboard until the backend can supply real ones.
// Generates the last 7 days of orders (ending today). The numbers are seeded, so
// the shape of the data is stable between reloads.

const MENU = [
  { name: 'Masala Dosa', price: 60, weight: 8 },
  { name: 'Idli Vada', price: 40, weight: 7 },
  { name: 'Samosa', price: 15, weight: 9 },
  { name: 'Veg Sandwich', price: 50, weight: 6 },
  { name: 'Chai', price: 12, weight: 10 },
  { name: 'Cold Coffee', price: 40, weight: 5 },
  { name: 'Veg Biryani', price: 90, weight: 4 },
  { name: 'Poha', price: 30, weight: 4 },
  { name: 'Pav Bhaji', price: 70, weight: 5 },
]

// Relative chance of an order being placed in each hour (8 AM - 6 PM): breakfast and lunch peaks.
const HOUR_WEIGHTS = { 8: 3, 9: 8, 10: 5, 11: 5, 12: 9, 13: 10, 14: 6, 15: 4, 16: 5, 17: 3, 18: 1 }

const DAYS = 7

// Small seeded random number generator (mulberry32) so the mock data is repeatable.
function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickWeighted(entries, weightOf, random) {
  const total = entries.reduce((sum, entry) => sum + weightOf(entry), 0)
  let roll = random() * total
  for (const entry of entries) {
    roll -= weightOf(entry)
    if (roll <= 0) return entry
  }
  return entries[entries.length - 1]
}

export function generateMockOrders(days = DAYS, endDate = new Date()) {
  const random = createRandom(2024)
  const hours = Object.keys(HOUR_WEIGHTS).map(Number)
  const orders = []
  let nextId = 1001

  for (let offset = days - 1; offset >= 0; offset--) {
    const orderCount = 60 + Math.floor(random() * 50)

    for (let i = 0; i < orderCount; i++) {
      const hour = pickWeighted(hours, (h) => HOUR_WEIGHTS[h], random)
      const placedAt = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - offset,
        hour,
        Math.floor(random() * 60),
      )

      const lineCount = 1 + Math.floor(random() * 3)
      const items = []
      for (let line = 0; line < lineCount; line++) {
        const menuItem = pickWeighted(MENU, (m) => m.weight, random)
        const existing = items.find((item) => item.name === menuItem.name)
        const qty = 1 + Math.floor(random() * 2)
        if (existing) {
          existing.qty += qty
        } else {
          items.push({ name: menuItem.name, price: menuItem.price, qty })
        }
      }

      orders.push({ id: nextId++, placedAt: placedAt.toISOString(), status: 'completed', items })
    }
  }

  return orders
}

export const mockOrders = generateMockOrders()