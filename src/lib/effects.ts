// Small decorative effects (bubbles and confetti) drawn straight into <body>.
// They are fire-and-forget, so plain DOM is simpler than React state here.
// The matching CSS classes live in styles/global.scss.

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/** A few bubbles rising from a point, used on button hover and taps. */
export function puff(x: number, y: number, count = 5): void {
  if (prefersReducedMotion()) return
  for (let i = 0; i < count; i++) {
    const b = document.createElement('span')
    b.className = 'hover-bubble'
    b.setAttribute('aria-hidden', 'true')
    b.style.left = `${x - 6 + (Math.random() * 30 - 15)}px`
    b.style.top = `${y - 6}px`
    b.style.setProperty('--s', `${6 + Math.random() * 10}px`)
    b.style.setProperty('--x', `${Math.random() * 30 - 15}px`)
    b.style.animationDelay = `${i * 60}ms`
    document.body.appendChild(b)
    window.setTimeout(() => b.remove(), 1400)
  }
}

const CONFETTI_COLORS = ['#bff3ec', '#ff8f7a', '#ffd27a', '#9ad1ff', '#ffb0cf']

/** Bubbles and confetti bursting from the middle of the screen. */
export function celebrate(): void {
  if (prefersReducedMotion()) return
  const spread = Math.max(window.innerWidth, window.innerHeight) * 0.55
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('span')
    const confetti = i % 3 === 0
    p.className = `burst ${confetti ? 'burst-confetti' : 'burst-bubble'}`
    p.setAttribute('aria-hidden', 'true')
    const angle = Math.random() * Math.PI * 2
    const distance = 120 + Math.random() * spread
    p.style.setProperty('--x', `${Math.cos(angle) * distance}px`)
    p.style.setProperty('--y', `${Math.sin(angle) * distance - 80}px`)
    p.style.setProperty('--rt', `${Math.random() * 720 - 360}deg`)
    p.style.setProperty('--s', `${8 + Math.random() * 22}px`)
    if (confetti) p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    p.style.animationDelay = `${Math.random() * 150}ms`
    document.body.appendChild(p)
    window.setTimeout(() => p.remove(), 2000)
  }
}
