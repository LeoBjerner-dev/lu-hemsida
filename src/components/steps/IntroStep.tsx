import hero from '../../assets/photos/hero.webp'
import styles from './IntroStep.module.scss'

// Eight bolts evenly spaced around the porthole frame.
const BOLTS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2
  return {
    left: `calc(50% + ${Math.cos(angle) * 46.5}% - 4.5px)`,
    top: `calc(50% + ${Math.sin(angle) * 46.5}% - 4.5px)`,
  }
})

interface IntroStepProps {
  onNext: () => void
}

export function IntroStep({ onNext }: IntroStepProps) {
  return (
    <>
      <div className={styles.porthole}>
        <div className={styles.glass}>
          <img src={hero} alt="Luana" width={480} height={480} fetchPriority="high" />
          <div className={styles.shimmer} />
        </div>
        {BOLTS.map((pos, i) => (
          <i key={i} className={styles.bolt} style={pos} aria-hidden="true" />
        ))}
      </div>
      <h1>
        Hola <em>Luana</em> 💙
      </h1>
      <p>
        Tengo una pregunta muy importante para ti…
        <br />y solo tiene una respuesta correcta.
      </p>
      <button type="button" className="btn" onClick={onNext}>
        Ver pregunta
      </button>
    </>
  )
}
