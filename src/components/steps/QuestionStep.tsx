import { useCallback, useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react'
import { puff } from '../../lib/effects'
import styles from './QuestionStep.module.scss'

const NO_TEXTS = [
  'No',
  'No',
  '¿Seguro?',
  'Piénsalo bien…',
  '¿De verdad?',
  'Imposible 😌',
  'Ni lo intentes 🙈',
  'Que no, que no 💙',
  'Venga ya…',
]

const EDGE_PADDING = 16
/** A tap fires several events (touchstart, maybe click); count it once. */
const DEDUPE_MS = 300

interface QuestionStepProps {
  onYes: () => void
}

/**
 * "¿Quieres salir a cenar conmigo?" with a "No" button that runs away.
 * Mouse: it jumps when the pointer enters it. Touch: it jumps on touchstart,
 * before a tap can land. Keyboard: Enter/Space make it jump and focus moves
 * back to "Sí".
 */
export function QuestionStep({ onYes }: QuestionStepProps) {
  const yesRef = useRef<HTMLButtonElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)
  const [escapes, setEscapes] = useState(0)
  const [loose, setLoose] = useState(false)
  const looseRef = useRef(false)
  const lastFleeAt = useRef(Number.NEGATIVE_INFINITY)
  const fromRect = useRef<DOMRect | null>(null)

  const flee = useCallback((event?: Event | SyntheticEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    const now = performance.now()
    if (now - lastFleeAt.current < DEDUPE_MS) return
    lastFleeAt.current = now

    const el = noRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    fromRect.current = rect
    if (!looseRef.current) {
      // Pin it where it is first, so the jump animates from its current spot.
      el.style.left = `${rect.left}px`
      el.style.top = `${rect.top}px`
      looseRef.current = true
      setLoose(true)
    }
    setEscapes((n) => n + 1)
  }, [])

  // After the new text has rendered, measure the button and move it somewhere
  // random on screen, away from "Sí" and away from where the finger/cursor is.
  useLayoutEffect(() => {
    const el = noRef.current
    const from = fromRect.current
    if (escapes === 0 || !el || !from) return
    void el.offsetWidth // commit the starting position so the move transitions
    const w = el.offsetWidth
    const h = el.offsetHeight
    const yes = yesRef.current?.getBoundingClientRect()
    const maxX = Math.max(EDGE_PADDING, window.innerWidth - w - EDGE_PADDING)
    const maxY = Math.max(EDGE_PADDING, window.innerHeight - h - EDGE_PADDING)
    let x = EDGE_PADDING
    let y = EDGE_PADDING
    for (let tries = 0; tries < 40; tries++) {
      x = EDGE_PADDING + Math.random() * (maxX - EDGE_PADDING)
      y = EDGE_PADDING + Math.random() * (maxY - EDGE_PADDING)
      const overlapsYes =
        yes && x < yes.right + 20 && x + w > yes.left - 20 && y < yes.bottom + 20 && y + h > yes.top - 20
      const tooClose = Math.hypot(x - from.left, y - from.top) < 120
      if (!overlapsYes && !tooClose) break
    }
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    puff(from.left + from.width / 2, from.top + from.height / 2, 3)
  }, [escapes])

  // Touch needs a native, non-passive listener: React's onTouchStart is
  // passive, so it could not stop the tap from turning into a click.
  useEffect(() => {
    const el = noRef.current
    if (!el) return
    const onTouchStart = (e: TouchEvent) => flee(e)
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    return () => el.removeEventListener('touchstart', onTouchStart)
  }, [flee])

  const yesScale = Math.min(1 + escapes * 0.12, 2)

  return (
    <>
      <span className="eyebrow">Pregunta nº 1 (y única)</span>
      <h1>
        Luana, ¿quieres salir a <em>cenar</em> conmigo?
      </h1>
      <div className={styles.choices}>
        <button
          ref={yesRef}
          type="button"
          className={`btn ${styles.yes}`}
          style={escapes > 0 ? { transform: `scale(${yesScale})` } : undefined}
          onClick={onYes}
        >
          ¡Sí! 💙
        </button>
        <button
          ref={noRef}
          type="button"
          className={`btn ghost ${styles.no} ${loose ? styles.loose : ''}`}
          data-no-puff
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') flee(e)
          }}
          onPointerDown={(e) => {
            if (e.pointerType !== 'touch') flee(e)
          }}
          onClick={flee}
          onFocus={() => {
            if (escapes > 0) yesRef.current?.focus()
          }}
        >
          {NO_TEXTS[Math.min(escapes, NO_TEXTS.length - 1)]}
        </button>
      </div>
    </>
  )
}
