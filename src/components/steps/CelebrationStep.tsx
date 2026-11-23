import noche from '../../assets/photos/noche.webp'
import pizza from '../../assets/photos/pizza.webp'
import selfie from '../../assets/photos/selfie.webp'
import styles from './CelebrationStep.module.scss'

interface CelebrationStepProps {
  onNext: () => void
}

export function CelebrationStep({ onNext }: CelebrationStepProps) {
  return (
    <>
      <div className={styles.collage}>
        <figure className={`${styles.polaroid} ${styles.p1}`}>
          <img src={pizza} alt="Luana sorprendida delante de una pizza" width={360} height={450} loading="lazy" />
          <figcaption>esa cara 😮</figcaption>
        </figure>
        <figure className={`${styles.polaroid} ${styles.square} ${styles.p2}`}>
          <img src={selfie} alt="Leo y Luana" width={360} height={360} loading="lazy" />
          <figcaption>nosotros</figcaption>
        </figure>
        <figure className={`${styles.polaroid} ${styles.p3}`}>
          <img src={noche} alt="Luana de noche por la calle" width={323} height={404} loading="lazy" />
          <figcaption>modo noche</figcaption>
        </figure>
      </div>
      <h1>
        ¡Sabía que dirías que <em>sí</em>! 🐠
      </h1>
      <div className={styles.place}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="18" stroke="#bff3ec" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="11" stroke="#bff3ec" strokeWidth="1.5" />
          <path d="M14 21c2-3 5-4 8-3l3-2-1 3 1 3-3-2c-3 1-6 0-8-1z" fill="#bff3ec" />
        </svg>
        <p>
          Te llevo a cenar bajo el mar, en el{' '}
          <a href="https://restaurantesubmarino.es/" target="_blank" rel="noopener noreferrer">
            Restaurante Submarino
          </a>{' '}
          del Oceanogràfic. Rodeados de peces, como en una película.
        </p>
      </div>
      <button type="button" className="btn" onClick={onNext}>
        Vamos a planearlo
      </button>
    </>
  )
}
