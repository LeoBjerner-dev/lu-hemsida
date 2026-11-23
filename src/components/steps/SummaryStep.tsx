import type { SubmitStatus } from '../../flow/dateFlow'
import type { DateDraft } from '../../types/date'
import { ResponseSummary } from '../ResponseSummary'
import styles from './SummaryStep.module.scss'

interface SummaryStepProps {
  draft: DateDraft
  status: SubmitStatus
  onConfirm: () => void
  onEdit: () => void
}

/** Step 3 of 3: the ticket, and the button that saves everything. */
export function SummaryStep({ draft, status, onConfirm, onEdit }: SummaryStepProps) {
  const submitting = status === 'submitting'
  return (
    <>
      <span className="eyebrow">Paso 3 de 3</span>
      <h2>
        Nuestra <em>cita</em>
      </h2>
      <ResponseSummary answers={draft} className="card" />
      {status === 'error' && (
        <p role="alert" className={styles.error}>
          Algo salió mal, inténtalo otra vez.
        </p>
      )}
      <button type="button" className="btn" disabled={submitting} aria-busy={submitting} onClick={onConfirm}>
        {submitting ? 'Enviando… 🫧' : 'Confirmar cita 💌'}
      </button>
      <button type="button" className="link" disabled={submitting} onClick={onEdit}>
        Cambiar algo
      </button>
    </>
  )
}
