import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuestionStep } from './QuestionStep'

const noButton = () => screen.getByRole('button', { name: /^no$|seguro|piénsalo|verdad|imposible|intentes|que no|venga/i })

describe('QuestionStep runaway "No" button', () => {
  it('jumps away on touchstart and blocks the tap', () => {
    render(<QuestionStep onYes={vi.fn()} />)
    const no = noButton()

    const touch = createEvent.touchStart(no, { touches: [{ clientX: 10, clientY: 10 }] })
    fireEvent(no, touch)

    expect(touch.defaultPrevented).toBe(true)
    expect(no.className).toContain('loose')
    expect(no.style.left).toMatch(/px$/)
    expect(no.style.top).toMatch(/px$/)
  })

  it('changes its text and grows the "Sí" button on every escape', () => {
    // Two taps far enough apart in time to count as two escapes.
    let time = 10_000
    const now = vi.spyOn(performance, 'now').mockImplementation(() => time)
    render(<QuestionStep onYes={vi.fn()} />)
    const yes = screen.getByRole('button', { name: /sí/i })

    fireEvent.touchStart(noButton())
    time += 1000
    fireEvent.touchStart(noButton())

    expect(noButton()).toHaveTextContent('¿Seguro?')
    expect(yes.style.transform).toBe('scale(1.24)')
    now.mockRestore()
  })

  it('counts one tap once, even though a tap fires several events', () => {
    render(<QuestionStep onYes={vi.fn()} />)
    const no = noButton()
    fireEvent.touchStart(no)
    fireEvent.click(no)
    // One escape keeps the first text ("No"); a second would say "¿Seguro?".
    expect(no).toHaveTextContent(/^No$/)
  })

  it('jumps away when a mouse moves onto it', async () => {
    const user = userEvent.setup()
    render(<QuestionStep onYes={vi.fn()} />)
    const no = noButton()
    await user.hover(no)
    expect(no.className).toContain('loose')
  })

  it('calls onYes when "Sí" is pressed', async () => {
    const onYes = vi.fn()
    const user = userEvent.setup()
    render(<QuestionStep onYes={onYes} />)
    await user.click(screen.getByRole('button', { name: /sí/i }))
    expect(onYes).toHaveBeenCalledOnce()
  })
})
