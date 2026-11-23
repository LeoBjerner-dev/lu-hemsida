// Date helpers. All visible dates are formatted in Spanish (es-ES).

const longDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
const monthYear = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
const sentAt = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Local date to YYYY-MM-DD without timezone shifts. */
export function toIsoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** YYYY-MM-DD to a local Date at midnight. */
export function fromIsoDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** "Viernes, 4 de diciembre" */
export const formatLongDay = (d: Date) => capitalize(longDay.format(d))
export const formatIsoLongDay = (iso: string) => formatLongDay(fromIsoDate(iso))

/** "diciembre de 2026" (capitalised by CSS) */
export const formatMonthYear = (d: Date) => monthYear.format(d)

/** "23 nov 2026, 17:05" */
export const formatSentAt = (iso: string) => sentAt.format(new Date(iso))

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
