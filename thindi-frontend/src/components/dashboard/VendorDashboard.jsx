import { useMemo, useState } from 'react'
import { mockOrders } from '../../data/mockOrders'
import {
  itemsSold,
  listDayKeys,
  ordersForDay,
  percentChange,
  revenueByDay,
  revenueByHour,
  summarize,
} from '../../utils/salesAnalytics'
import { formatCurrency, formatDayLabel, formatHour, formatNumber } from '../../utils/formatters'
import { useChartTheme } from './chartSetup'
import { DailyRevenueChart, ItemsSoldChart, RevenueByHourChart } from './SalesCharts'
import './VendorDashboard.css'

// A headline number with an optional change compared to the previous day.
function StatTile({ label, value, change }) {
  let deltaClass = 'stat-tile__delta'
  let deltaText = null

  if (change !== null && change !== undefined) {
    const rounded = Math.abs(change).toFixed(1)
    if (change > 0) {
      deltaClass += ' stat-tile__delta--up'
      deltaText = `▲ ${rounded}% vs previous day`
    } else if (change < 0) {
      deltaClass += ' stat-tile__delta--down'
      deltaText = `▼ ${rounded}% vs previous day`
    } else {
      deltaText = 'No change vs previous day'
    }
  }

  return (
    <div className="card stat-tile">
      <p className="stat-tile__label">{label}</p>
      <p className="stat-tile__value">{value}</p>
      {deltaText && <p className={deltaClass}>{deltaText}</p>}
    </div>
  )
}

// The accessible "table view" version of a chart.
function DataTable({ caption, columns, rows }) {
  return (
    <div className="card">
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column} scope="col" className={index > 0 ? 'data-table__number' : undefined}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td key={index} className={index > 0 ? 'data-table__number' : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Daily sales analytics for a vendor.
//
// Props:
//   orders     - list of orders (see utils/salesAnalytics.js). Defaults to sample data;
//                pass real orders from the backend when they are available.
//   vendorName - shown in the heading.
function VendorDashboard({ orders = mockOrders, vendorName = 'Your stall' }) {
  const theme = useChartTheme()
  const [selectedDay, setSelectedDay] = useState(null)
  const [view, setView] = useState('charts')

  const dayKeys = useMemo(() => listDayKeys(orders), [orders])
  const activeDay = dayKeys.includes(selectedDay) ? selectedDay : dayKeys.at(-1)

  const analytics = useMemo(() => {
    if (!activeDay) return null
    const dayOrders = ordersForDay(orders, activeDay)
    const previousDay = dayKeys[dayKeys.indexOf(activeDay) - 1]
    return {
      summary: summarize(dayOrders),
      previous: previousDay ? summarize(ordersForDay(orders, previousDay)) : null,
      hours: revenueByHour(dayOrders),
      items: itemsSold(dayOrders),
      days: revenueByDay(orders, dayKeys),
    }
  }, [orders, dayKeys, activeDay])

  if (!analytics) {
    return (
      <section className="vdash" style={theme.cssVars}>
        <h2>{vendorName} sales</h2>
        <p>No orders yet. Sales analytics will appear here once orders come in.</p>
      </section>
    )
  }

  const { summary, previous, hours, items, days } = analytics
  const change = (key) => (previous ? percentChange(summary[key], previous[key]) : null)

  return (
    <section className="vdash" style={theme.cssVars}>
      <h2>{vendorName} sales</h2>
      <p className="vdash__subtitle">{formatDayLabel(activeDay)}</p>

      <div className="vdash__filters">
        <label>
          Day{' '}
          <select value={activeDay} onChange={(event) => setSelectedDay(event.target.value)}>
            {[...dayKeys].reverse().map((dayKey) => (
              <option key={dayKey} value={dayKey}>
                {formatDayLabel(dayKey)}
              </option>
            ))}
          </select>
        </label>

        <div className="vdash__toggle" role="group" aria-label="Display">
          <button type="button" aria-pressed={view === 'charts'} onClick={() => setView('charts')}>
            Charts
          </button>
          <button type="button" aria-pressed={view === 'tables'} onClick={() => setView('tables')}>
            Tables
          </button>
        </div>
      </div>

      <div className="vdash__tiles">
        <StatTile label="Revenue" value={formatCurrency(summary.revenue)} change={change('revenue')} />
        <StatTile label="Orders" value={formatNumber(summary.orderCount)} change={change('orderCount')} />
        <StatTile label="Items sold" value={formatNumber(summary.itemsSold)} change={change('itemsSold')} />
        <StatTile
          label="Average order"
          value={formatCurrency(summary.averageOrderValue)}
          change={change('averageOrderValue')}
        />
      </div>

      {view === 'charts' ? (
        <div className="vdash__charts">
          <div className="card">
            <h3>Revenue by hour</h3>
            <p className="card__subtitle">Busiest hour is labelled</p>
            <div className="chart-box">
              <RevenueByHourChart hours={hours} theme={theme} />
            </div>
          </div>

          <div className="card">
            <h3>Items sold</h3>
            <p className="card__subtitle">Best sellers first</p>
            <div className="chart-box">
              <ItemsSoldChart items={items} theme={theme} />
            </div>
          </div>

          <div className="card card--wide">
            <h3>Revenue by day</h3>
            <p className="card__subtitle">Select a column to switch day</p>
            <div className="chart-box">
              <DailyRevenueChart
                days={days}
                selectedDayKey={activeDay}
                onSelectDay={setSelectedDay}
                theme={theme}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="vdash__charts">
          <DataTable
            caption="Revenue by hour"
            columns={['Hour', 'Orders', 'Revenue']}
            rows={hours.map((entry) => [formatHour(entry.hour), entry.orderCount, formatCurrency(entry.revenue)])}
          />
          <DataTable
            caption="Items sold"
            columns={['Item', 'Sold', 'Revenue']}
            rows={items.map((item) => [item.name, formatNumber(item.qty), formatCurrency(item.revenue)])}
          />
          <div className="card--wide">
            <DataTable
              caption="Revenue by day"
              columns={['Day', 'Orders', 'Revenue']}
              rows={days.map((day) => [formatDayLabel(day.dayKey), day.orderCount, formatCurrency(day.revenue)])}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default VendorDashboard