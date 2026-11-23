import { labelFor, SUMMARY_ROWS, type AnswerSource } from '../content/options'
import { formatIsoLongDay } from '../lib/dates'
import styles from './ResponseSummary.module.scss'

function displayValue(key: (typeof SUMMARY_ROWS)[number]['key'], value: string | null): string {
  if (!value) return ''
  switch (key) {
    case 'date':
      return formatIsoLongDay(value)
    case 'time_preference':
    case 'food':
    case 'drinks':
    case 'dessert':
    case 'dress_code':
      return labelFor(key, value)
    default:
      return value
  }
}

interface ResponseSummaryProps {
  answers: AnswerSource
  /** Show the "Restaurante Submarino" ticket header (the summary step does). */
  withHeader?: boolean
  className?: string
}

/** The "ticket" with her answers. Used on the summary step and in /admin. */
export function ResponseSummary({ answers, withHeader = true, className = '' }: ResponseSummaryProps) {
  return (
    <div className={`${styles.summary} ${className}`}>
      {withHeader && <div className={styles.ticketTop}>🌊 Restaurante Submarino</div>}
      <dl className={styles.summary}>
        {SUMMARY_ROWS.map(({ key, label }) => {
          const value = displayValue(key, answers[key])
          if (!value) return null
          return (
            <div key={key} className={styles.item}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
