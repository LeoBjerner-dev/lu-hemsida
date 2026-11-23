import { useMemo, useState } from 'react'
import { TIME_OPTIONS } from '../../content/options'
import { formatLongDay, formatMonthYear, startOfToday, toIsoDate } from '../../lib/dates'
import type { TimePreference } from '../../types/date'
import styles from './DateStep.module.scss'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const WEEKDAY_NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

interface DateStepProps {
  date: string | null
  timePreference: TimePreference | null
  onDateChange: (isoDate: string) => void
  onTimeChange: (time: TimePreference) => void
  onNext: () => void
}

/** Step 1 of 3: a Monday-first calendar (from tomorrow on) plus lunch or dinner. */
export function DateStep({ date, timePreference, onDateChange, onTimeChange, onNext }: DateStepProps) {
  const today = useMemo(() => startOfToday(), [])
  const minDate = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + 1)
    return d
  }, [today])
  const firstMonth = useMemo(() => new Date(minDate.getFullYear(), minDate.getMonth(), 1), [minDate])
  const [view, setView] = useState(firstMonth)

  const leadingBlanks = (view.getDay() + 6) % 7
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))

  const shiftMonth = (delta: number) => setView(new Date(view.getFullYear(), view.getMonth() + delta, 1))

  return (
    <>
      <span className="eyebrow">Paso 1 de 3</span>
      <h2>
        ¿Qué día te viene <em>bien</em>?
      </h2>
      <div className="card">
        <div className={styles.calHead}>
          <button
            type="button"
            className="icon-btn"
            aria-label="Mes anterior"
            disabled={view <= firstMonth}
            onClick={() => shiftMonth(-1)}
          >
            <Chevron d="M15 18l-6-6 6-6" />
          </button>
          <strong aria-live="polite">{formatMonthYear(view)}</strong>
          <button type="button" className="icon-btn" aria-label="Mes siguiente" onClick={() => shiftMonth(1)}>
            <Chevron d="M9 18l6-6-6-6" />
          </button>
        </div>
        <div className={styles.grid} role="group" aria-label="Calendario">
          {WEEKDAYS.map((d, i) => (
            <div key={d + i} className={styles.dow} aria-hidden="true" title={WEEKDAY_NAMES[i]}>
              {d}
            </div>
          ))}
          {Array.from({ length: leadingBlanks }, (_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((d) => {
            const iso = toIsoDate(d)
            const selected = date === iso
            const classes = [styles.day]
            if (selected) classes.push(styles.selected)
            if (+d === +today) classes.push(styles.today)
            return (
              <button
                key={iso}
                type="button"
                className={classes.join(' ')}
                aria-label={formatLongDay(d)}
                aria-pressed={selected}
                disabled={d < minDate}
                onClick={() => onDateChange(iso)}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </div>
      <div className={styles.seg} role="group" aria-label="Momento del día">
        {TIME_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            className="chip"
            aria-pressed={timePreference === o.value}
            onClick={() => onTimeChange(o.value)}
          >
            {o.emoji} {o.label}
          </button>
        ))}
      </div>
      <button type="button" className="btn" disabled={!date || !timePreference} onClick={onNext}>
        Siguiente
      </button>
    </>
  )
}

function Chevron({ d }: { d: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
