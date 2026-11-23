import { useEffect, useRef, type ReactNode } from 'react'
import styles from './Screen.module.scss'

interface ScreenProps {
  active: boolean
  label: string
  wide?: boolean
  children: ReactNode
}

/**
 * One full-screen step. All steps stay mounted and cross-fade with CSS, like
 * the design. When a step becomes active it scrolls to the top and moves
 * keyboard/screen reader focus to its heading.
 */
export function Screen({ active, label, wide = false, children }: ScreenProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!active || !el) return
    el.scrollTop = 0
    const timer = window.setTimeout(() => {
      const heading = el.querySelector<HTMLElement>('h1, h2')
      if (heading) {
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [active])

  return (
    <section
      ref={ref}
      className={`${styles.screen} ${active ? styles.active : ''}`}
      aria-label={label}
      aria-hidden={!active}
      inert={!active}
    >
      <div className={`${styles.inner} ${wide ? styles.wide : ''}`}>{children}</div>
    </section>
  )
}
