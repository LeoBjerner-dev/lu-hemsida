import flores from '../../assets/photos/flores.webp'
import { labelFor } from '../../content/options'
import { formatIsoLongDay } from '../../lib/dates'
import type { DateResponseInput } from '../../types/date'
import styles from './ConfirmedStep.module.scss'

interface ConfirmedStepProps {
  response: DateResponseInput | null
}

export function ConfirmedStep({ response }: ConfirmedStepProps) {
  return (
    <>
      <figure className={styles.photo}>
        <img src={flores} alt="Luana con un ramo de flores" width={360} height={480} loading="lazy" />
        <figcaption>mi cita 💙</figcaption>
      </figure>
      <h1>
        ¡Cita confirmada, <em>Luana</em>!
      </h1>
      {response && (
        <p className={styles.when}>
          {formatIsoLongDay(response.date)} · {labelFor('time_preference', response.time_preference)}
        </p>
      )}
      <p>Nos vemos bajo el mar 🌊</p>
      <p className={styles.sig}>Leo</p>
    </>
  )
}
