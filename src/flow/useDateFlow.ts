import { useCallback, useReducer } from 'react'
import { loadConfirmation, saveConfirmation } from '../lib/confirmationStorage'
import { submitDateResponse } from '../services/dateResponses'
import { flowReducer, initialFlowState, toResponseInput, type Step } from './dateFlow'
import type { DateDraft } from '../types/date'

/** Owns the invitation flow state and the one side effect it has: saving. */
export function useDateFlow() {
  const [state, dispatch] = useReducer(flowReducer, null, () => initialFlowState(loadConfirmation()))

  const go = useCallback((step: Step) => dispatch({ type: 'go', step }), [])
  const setAnswer = useCallback(
    (key: keyof DateDraft, value: string | null) => dispatch({ type: 'setAnswer', key, value }),
    [],
  )
  const startQuestions = useCallback(() => dispatch({ type: 'startQuestions' }), [])
  const nextQuestion = useCallback(() => dispatch({ type: 'nextQuestion' }), [])
  const prevQuestion = useCallback(() => dispatch({ type: 'prevQuestion' }), [])

  /** Saves her answers. Resolves to true when the date is confirmed. */
  const confirm = useCallback(async (): Promise<boolean> => {
    const response = toResponseInput(state.draft)
    if (!response) {
      dispatch({ type: 'go', step: 'date' })
      return false
    }
    dispatch({ type: 'submitStart' })
    try {
      await submitDateResponse(response)
    } catch (err) {
      console.error('Could not save the response', err)
      dispatch({ type: 'submitError' })
      return false
    }
    saveConfirmation(response)
    dispatch({ type: 'submitSuccess', response })
    return true
  }, [state.draft])

  return { state, go, setAnswer, startQuestions, nextQuestion, prevQuestion, confirm }
}

export type DateFlow = ReturnType<typeof useDateFlow>
