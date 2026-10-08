import { Bar } from 'react-chartjs-2'
import { barStyle, buildBarOptions, valueLabels } from './chartSetup'
import {
  formatCompactCurrency,
  formatCurrency,
  formatDayLabel,
  formatDayShort,
  formatHour,
  formatNumber,
} from '../../utils/formatters'

// Revenue for each hour of the selected day. Only the busiest hour is labelled.
export function RevenueByHourChart({ hours, theme }) {
  const values = hours.map((entry) => entry.revenue)
  const peakIndex = values.indexOf(Math.max(...values))

  const data = {
    labels: hours.map((entry) => formatHour(entry.hour)),
    datasets: [{ label: 'Revenue', data: values, ...barStyle(theme.series) }],
  }

  const options = buildBarOptions(theme, {
    layout: { padding: { top: 24 } },
    scales: {
      y: { ticks: { callback: (value) => formatCompactCurrency(value) } },
    },
    plugins: {
      valueLabels: { color: theme.ink, format: formatCurrency, indexes: [peakIndex] },
      tooltip: {
        callbacks: {
          label: (context) => {
            const entry = hours[context.dataIndex]
            return [`Revenue: ${formatCurrency(entry.revenue)}`, `Orders: ${entry.orderCount}`]
          },
        },
      },
    },
  })

  return (
    <Bar
      data={data}
      options={options}
      plugins={[valueLabels]}
      role="img"
      aria-label="Column chart of revenue by hour for the selected day"
    />
  )
}

// Best-selling items by quantity. Every bar is labelled, so the value axis is hidden.
export function ItemsSoldChart({ items, theme }) {
  const data = {
    labels: items.map((item) => item.name),
    datasets: [{ label: 'Items sold', data: items.map((item) => item.qty), ...barStyle(theme.series) }],
  }

  const options = buildBarOptions(theme, {
    horizontal: true,
    layout: { padding: { right: 40 } },
    scales: { x: { display: false } },
    plugins: {
      valueLabels: { color: theme.ink, format: formatNumber },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = items[context.dataIndex]
            return [`Sold: ${formatNumber(item.qty)}`, `Revenue: ${formatCurrency(item.revenue)}`]
          },
        },
      },
    },
  })

  return (
    <Bar
      data={data}
      options={options}
      plugins={[valueLabels]}
      role="img"
      aria-label="Bar chart of items sold for the selected day, best sellers first"
    />
  )
}

// Revenue per day. The selected day is highlighted and the rest are gray.
// Clicking a bar selects that day.
export function DailyRevenueChart({ days, selectedDayKey, onSelectDay, theme }) {
  const selectedIndex = days.findIndex((day) => day.dayKey === selectedDayKey)

  const data = {
    labels: days.map((day) => formatDayShort(day.dayKey)),
    datasets: [
      {
        label: 'Revenue',
        data: days.map((day) => day.revenue),
        ...barStyle(theme.context),
        backgroundColor: days.map((day) => (day.dayKey === selectedDayKey ? theme.series : theme.context)),
      },
    ],
  }

  const options = buildBarOptions(theme, {
    layout: { padding: { top: 24 } },
    scales: {
      y: { ticks: { callback: (value) => formatCompactCurrency(value) } },
    },
    onClick: (_event, elements) => {
      if (elements.length) onSelectDay(days[elements[0].index].dayKey)
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length ? 'pointer' : 'default'
    },
    plugins: {
      valueLabels: { color: theme.ink, format: formatCurrency, indexes: [selectedIndex] },
      tooltip: {
        callbacks: {
          title: (items) => formatDayLabel(days[items[0].dataIndex].dayKey),
          label: (context) => {
            const day = days[context.dataIndex]
            return [`Revenue: ${formatCurrency(day.revenue)}`, `Orders: ${day.orderCount}`]
          },
        },
      },
    },
  })

  return (
    <Bar
      data={data}
      options={options}
      plugins={[valueLabels]}
      role="img"
      aria-label="Column chart of revenue for each of the last days. Click a column to select that day."
    />
  )
}