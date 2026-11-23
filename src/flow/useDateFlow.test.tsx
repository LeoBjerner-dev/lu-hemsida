import { act, render, renderHook, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SummaryStep } from '../components/steps/SummaryStep'
import { submitDateResponse } from '../services/dateResponses'
import { emptyDraft } from '../types/date'
import { useDateFlow } from './useDateFlow'

vi.mock('../services/dateResponses', () => ({ submitDateResponse: vi.fn() }))
const submitMock = vi.mocked(submitDateResponse)

function fillIn(result: { current: ReturnType<typeof useDateFlow> }) {
  act(() => {
    const { setAnswer } = result.current
    setAnswer('date', '2026-12-04')
    setAnswer('time_preference', 'dinner')
    setAnswer('food', 'surprise')
    setAnswer('drinks', 'red_wine')
    setAnswer('dessert', 'yes')
    setAnswer('dress_code', 'casual')
    setAnswer('message', 'Te quiero')
  })
}

describe('useDateFlow confirm()', () => {
  beforeEach(() => submitMock.mockReset())

  it('shows an error and stays on the summary when saving fails', async () => {
    submitMock.mockRejectedValueOnce(new Error('network down'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useDateFlow())
    fillIn(result)
    act(() => result.current.go('summary'))

    let ok = true
    await act(async () => {
      ok = await result.current.confirm()
    })

    expect(ok).toBe(false)
    expect(result.current.state.step).toBe('summary')
    expect(result.current.state.submitStatus).toBe('error')
    expect(localStorage.length).toBe(0)
  })

  it('saves, shows the confirmation and remembers it after a reload', async () => {
    submitMock.mockResolvedValueOnce()
    const { result, unmount } = renderHook(() => useDateFlow())
    fillIn(result)

    await act(async () => {
      await result.current.confirm()
    })

    expect(submitMock).toHaveBeenCalledWith(expect.objectContaining({ date: '2026-12-04', allergies: '', message: 'Te quiero' }))
    expect(result.current.state.step).toBe('confirmed')
    unmount()

    // "Reopening the page"
    const reopened = renderHook(() => useDateFlow())
    expect(reopened.result.current.state.step).toBe('confirmed')
    expect(reopened.result.current.state.confirmed?.time_preference).toBe('dinner')
  })
})

describe('SummaryStep', () => {
  it('shows the Spanish error message and a disabled button while sending', () => {
    const { rerender } = render(<SummaryStep draft={emptyDraft} status="error" onConfirm={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Algo salió mal, inténtalo otra vez.')

    rerender(<SummaryStep draft={emptyDraft} status="submitting" onConfirm={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled()
  })
})
