import { useEffect } from 'react'
import { puff } from './effects'

/** Little bubbles rise when the pointer moves onto any button or chip. */
export function useBubblePuffs(): void {
  useEffect(() => {
    const onPointerOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.('.btn, .chip')
      if (!target || target.hasAttribute('data-no-puff')) return
      if (e.relatedTarget instanceof Node && target.contains(e.relatedTarget)) return
      puff(e.clientX, e.clientY, 4)
    }
    document.addEventListener('pointerover', onPointerOver)
    return () => document.removeEventListener('pointerover', onPointerOver)
  }, [])
}
