import { describe, expect, it } from 'vitest'
import { QUESTIONS } from '../content/options'
import type { DateDraft } from '../types/date'
import { flowReducer, initialFlowState, toResponseInput } from './dateFlow'

const completeDraft: DateDraft = {
  date: '2026-12-04',
  time_preference: 'dinner',
  food: 'fish',
  drinks: 'cava',
  dessert: 'share',
  allergies: '  sin cilantro  ',
  dress_code: 'elegant',
  message: null,
}

describe('flowReducer', () => {
  it('starts on the intro, or on the confirmation when she already confirmed', () => {
    expect(initialFlowState().step).toBe('intro')
    const confirmed = toResponseInput(completeDraft)!
    expect(initialFlowState(confirmed).step).toBe('confirmed')
  })

  it('walks through the questions and on to the summary', () => {
    let state = flowReducer(initialFlowState(), { type: 'startQuestions' })
    expect(state.step).toBe('questions')
    for (let i = 1; i < QUESTIONS.length; i++) {
      state = flowReducer(state, { type: 'nextQuestion' })
      expect(state.questionIndex).toBe(i)
    }
    state = flowReducer(state, { type: 'nextQuestion' })
    expect(state.step).toBe('summary')
  })

  it('goes back to the calendar from the first question', () => {
    const state = flowReducer(initialFlowState(), { type: 'startQuestions' })
    expect(flowReducer(state, { type: 'prevQuestion' }).step).toBe('date')
  })

  it('tracks submit status', () => {
    let state = flowReducer(initialFlowState(), { type: 'submitStart' })
    expect(state.submitStatus).toBe('submitting')
    state = flowReducer(state, { type: 'submitError' })
    expect(state.submitStatus).toBe('error')
    const response = toResponseInput(completeDraft)!
    state = flowReducer(state, { type: 'submitSuccess', response })
    expect(state).toMatchObject({ step: 'confirmed', submitStatus: 'idle', confirmed: response })
  })
})

describe('toResponseInput', () => {
  it('fills optional text answers with trimmed strings', () => {
    expect(toResponseInput(completeDraft)).toEqual({
      date: '2026-12-04',
      time_preference: 'dinner',
      food: 'fish',
      drinks: 'cava',
      dessert: 'share',
      allergies: 'sin cilantro',
      dress_code: 'elegant',
      message: '',
    })
  })

  it('returns null when a required answer is missing', () => {
    expect(toResponseInput({ ...completeDraft, drinks: null })).toBeNull()
  })
})
