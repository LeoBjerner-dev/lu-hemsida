// The whole invitation flow as one reducer: which screen is showing, her
// answers so far, where she is in the questions and how saving is going.
import { QUESTIONS } from '../content/options'
import { emptyDraft, type DateDraft, type DateResponseInput } from '../types/date'

export type Step = 'intro' | 'question' | 'celebration' | 'date' | 'questions' | 'summary' | 'confirmed'

export type SubmitStatus = 'idle' | 'submitting' | 'error'

export interface FlowState {
  step: Step
  draft: DateDraft
  questionIndex: number
  submitStatus: SubmitStatus
  /** Set once she has confirmed (also restored from localStorage). */
  confirmed: DateResponseInput | null
}

export type FlowAction =
  | { type: 'go'; step: Step }
  | { type: 'setAnswer'; key: keyof DateDraft; value: string | null }
  | { type: 'startQuestions' }
  | { type: 'nextQuestion' }
  | { type: 'prevQuestion' }
  | { type: 'submitStart' }
  | { type: 'submitSuccess'; response: DateResponseInput }
  | { type: 'submitError' }

export function initialFlowState(confirmed: DateResponseInput | null = null): FlowState {
  return {
    step: confirmed ? 'confirmed' : 'intro',
    draft: confirmed ? { ...confirmed } : emptyDraft,
    questionIndex: 0,
    submitStatus: 'idle',
    confirmed,
  }
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'go':
      return { ...state, step: action.step, submitStatus: 'idle' }
    case 'setAnswer':
      return { ...state, draft: { ...state.draft, [action.key]: action.value } }
    case 'startQuestions':
      return { ...state, step: 'questions', questionIndex: 0 }
    case 'nextQuestion':
      return state.questionIndex >= QUESTIONS.length - 1
        ? { ...state, step: 'summary' }
        : { ...state, questionIndex: state.questionIndex + 1 }
    case 'prevQuestion':
      return state.questionIndex === 0
        ? { ...state, step: 'date' }
        : { ...state, questionIndex: state.questionIndex - 1 }
    case 'submitStart':
      return { ...state, submitStatus: 'submitting' }
    case 'submitSuccess':
      return { ...state, submitStatus: 'idle', confirmed: action.response, step: 'confirmed' }
    case 'submitError':
      return { ...state, submitStatus: 'error' }
  }
}

/**
 * Turns the draft into a complete response, or null if a required answer is
 * missing. The two text questions are optional and saved as empty strings.
 */
export function toResponseInput(draft: DateDraft): DateResponseInput | null {
  const { date, time_preference, food, drinks, dessert, dress_code } = draft
  if (!date || !time_preference || !food || !drinks || !dessert || !dress_code) return null
  return {
    date,
    time_preference,
    food,
    drinks,
    dessert,
    dress_code,
    allergies: (draft.allergies ?? '').trim(),
    message: (draft.message ?? '').trim(),
  }
}
