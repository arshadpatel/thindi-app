import { useSyncExternalStore } from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

// Chart.js only includes the parts you register, which keeps the bundle small.
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

// --- Colours -----------------------------------------------------------------
// One accent colour for data, grays for everything else. Each mode has its own
// values, chosen for contrast on its own chart surface.
const THEMES = {
  light: {
    surface: '#fcfcfb',
    ink: '#0b0b0b',
    inkSecondary: '#52514e',
    muted: '#898781',
    grid: '#e1e0d9',
    axis: '#c3c2b7',
    border: 'rgba(11, 11, 11, 0.10)',
    series: '#2a78d6',
    context: '#898781',
    good: '#006300',
    critical: '#d03b3b',
  },
  dark: {
    surface: '#1a1a19',
    ink: '#ffffff',
    inkSecondary: '#c3c2b7',
    muted: '#898781',
    grid: '#2c2c2a',
    axis: '#383835',
    border: 'rgba(255, 255, 255, 0.10)',
    series: '#3987e5',
    context: '#898781',
    good: '#0ca30c',
    critical: '#d03b3b',
  },
}

function subscribeToColorScheme(onChange) {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getColorScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Returns the colours for the user's current light/dark setting and re-renders
// when it changes. `cssVars` is spread onto the dashboard root so the HTML parts
// (cards, tables) use the same colours as the charts.
export function useChartTheme() {
  const scheme = useSyncExternalStore(subscribeToColorScheme, getColorScheme, () => 'light')
  const theme = THEMES[scheme]
  return {
    ...theme,
    scheme,
    cssVars: {
      '--vd-surface': theme.surface,
      '--vd-ink': theme.ink,
      '--vd-ink-secondary': theme.inkSecondary,
      '--vd-muted': theme.muted,
      '--vd-grid': theme.grid,
      '--vd-border': theme.border,
      '--vd-series': theme.series,
      '--vd-good': theme.good,
      '--vd-critical': theme.critical,
    },
  }
}

// --- Value labels --------------------------------------------------------------
// Chart.js has no built-in labels on bars. This small plugin writes the value at
// the tip of a bar. Pass `indexes` to label only some bars (labelling every bar
// makes a chart noisy) or leave it out to label all of them.
export const valueLabels = {
  id: 'valueLabels',
  afterDatasetsDraw(chart, _args, options) {
    if (!options || !options.format) return
    const { ctx } = chart
    const values = chart.data.datasets[0].data
    const horizontal = chart.options.indexAxis === 'y'

    ctx.save()
    ctx.font = '600 12px system-ui, sans-serif'
    ctx.fillStyle = options.color
    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      if (options.indexes && !options.indexes.includes(index)) return
      if (!values[index]) return
      const label = options.format(values[index])
      if (horizontal) {
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, bar.x + 8, bar.y)
      } else {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText(label, bar.x, bar.y - 6)
      }
    })
    ctx.restore()
  },
}

// --- Shared chart options -------------------------------------------------------
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Styling for a dataset of bars: thin, rounded at the tip, square at the baseline.
export function barStyle(color) {
  return {
    backgroundColor: color,
    maxBarThickness: 24,
    borderRadius: 4,
    borderSkipped: 'start',
  }
}

// Options shared by all three bar charts. `scales`, `plugins` and any other
// option passed in are merged on top of these defaults.
export function buildBarOptions(theme, { horizontal = false, scales = {}, plugins = {}, ...rest } = {}) {
  const { tooltip: tooltipOverrides, ...otherPlugins } = plugins
  const valueAxis = {
    beginAtZero: true,
    border: { display: false },
    grid: { color: theme.grid, lineWidth: 1 },
    ticks: { color: theme.muted, font: { size: 12 } },
  }
  const categoryAxis = {
    border: { color: theme.axis },
    grid: { display: false },
    ticks: { color: horizontal ? theme.inkSecondary : theme.muted, font: { size: 12 } },
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    animation: reduceMotion ? false : { duration: 250 },
    interaction: { mode: 'index', intersect: false, axis: horizontal ? 'y' : 'x' },
    scales: {
      x: { ...(horizontal ? valueAxis : categoryAxis), ...scales.x },
      y: { ...(horizontal ? categoryAxis : valueAxis), ...scales.y },
    },
    plugins: {
      legend: { display: false },
      ...otherPlugins,
      tooltip: {
        backgroundColor: theme.surface,
        titleColor: theme.ink,
        bodyColor: theme.inkSecondary,
        borderColor: theme.border,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { weight: '600' },
        ...tooltipOverrides,
      },
    },
    ...rest,
  }
}