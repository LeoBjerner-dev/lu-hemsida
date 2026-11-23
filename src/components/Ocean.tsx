import { useState, type CSSProperties } from 'react'
import styles from './Ocean.module.scss'

const FISH: { color: string; top: number; duration: number; reverse: boolean }[] = [
  { color: '#7ee0d6', top: 14, duration: 32, reverse: false },
  { color: '#ffb38a', top: 38, duration: 46, reverse: true },
  { color: '#bff3ec', top: 62, duration: 38, reverse: false },
  { color: '#9ad1ff', top: 80, duration: 54, reverse: true },
]

const JELLIES: { left: number; top: number }[] = [
  { left: 8, top: 70 },
  { left: 78, top: 20 },
]

function makeBubbles(): CSSProperties[] {
  return Array.from({ length: 18 }, () => {
    const size = 4 + Math.random() * 14
    return {
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      animationDuration: `${9 + Math.random() * 14}s`,
      animationDelay: `${-Math.random() * 20}s`,
      opacity: 0.3 + Math.random() * 0.5,
    }
  })
}

function FishSvg({ color }: { color: string }) {
  return (
    <svg width="46" height="22" viewBox="0 0 46 22" aria-hidden="true">
      <path d="M2 11C10 1 26 0 34 11 26 22 10 21 2 11Z" fill={color} />
      <path d="M33 11l11-8v16z" fill={color} />
      <circle cx="10" cy="9" r="1.6" fill="#03132b" />
    </svg>
  )
}

function JellySvg() {
  return (
    <svg width="54" height="86" viewBox="0 0 54 86" aria-hidden="true">
      <path
        d="M4 30C4 12 16 3 27 3s23 9 23 27c-6 3-12-2-15 2-4-3-9-3-12 0-4-4-9 1-19-2Z"
        fill="rgba(255,170,200,.55)"
      />
      <g stroke="rgba(255,190,215,.5)" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M14 33c-3 12 4 18 0 32" />
        <path d="M22 34c2 14-4 22 0 40" />
        <path d="M31 34c-2 12 4 20 0 36" />
        <path d="M40 33c3 10-3 18 1 28" />
      </g>
    </svg>
  )
}

/** The animated underwater background: light rays, bubbles, fish and jellyfish. */
export function Ocean() {
  const [bubbles] = useState(makeBubbles)

  return (
    <div className={styles.ocean} aria-hidden="true">
      <div className={styles.rays}>
        <div className={styles.ray} />
        <div className={styles.ray} />
        <div className={styles.ray} />
        <div className={styles.ray} />
      </div>
      <div className={styles.caustics} />
      {FISH.map((f, i) => (
        <div
          key={`fish-${i}`}
          className={`${styles.critter} ${styles.fish} ${f.reverse ? styles.reverse : ''}`}
          style={{ top: `${f.top}%`, animationDuration: `${f.duration}s`, animationDelay: `${-i * 9}s` }}
        >
          <FishSvg color={f.color} />
        </div>
      ))}
      {JELLIES.map((j, i) => (
        <div
          key={`jelly-${i}`}
          className={`${styles.critter} ${styles.jelly}`}
          style={{ left: `${j.left}%`, top: `${j.top}%`, animationDelay: `${-i * 8}s` }}
        >
          <JellySvg />
        </div>
      ))}
      {bubbles.map((style, i) => (
        <span key={`bubble-${i}`} className={styles.bubble} style={style} />
      ))}
    </div>
  )
}
