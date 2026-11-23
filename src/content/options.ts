// Spanish labels for every stored answer value, plus the question list.
// The database stores the English codes; the UI always shows these labels.
import type {
  DateDraft,
  DateResponseInput,
  Dessert,
  DressCode,
  Drinks,
  Food,
  TimePreference,
} from '../types/date'

export interface Option<V extends string> {
  value: V
  emoji: string
  label: string
}

export const TIME_OPTIONS: Option<TimePreference>[] = [
  { value: 'lunch', emoji: '☀️', label: 'Almuerzo' },
  { value: 'dinner', emoji: '🌙', label: 'Cena' },
]

const FOOD_OPTIONS: Option<Food>[] = [
  { value: 'fish', emoji: '🐟', label: 'Pescado' },
  { value: 'meat', emoji: '🥩', label: 'Carne' },
  { value: 'surprise', emoji: '✨', label: 'Me dejo sorprender' },
]

const DRINK_OPTIONS: Option<Drinks>[] = [
  { value: 'red_wine', emoji: '🍷', label: 'Vino tinto' },
  { value: 'white_wine', emoji: '🥂', label: 'Vino blanco' },
  { value: 'cava', emoji: '🍾', label: 'Cava' },
  { value: 'cocktail', emoji: '🍸', label: 'Cóctel' },
  { value: 'no_alcohol', emoji: '🧃', label: 'Sin alcohol' },
]

const DESSERT_OPTIONS: Option<Dessert>[] = [
  { value: 'yes', emoji: '🍰', label: 'Obvio que sí' },
  { value: 'share', emoji: '🥄', label: 'Compartimos uno' },
  { value: 'no', emoji: '🙅‍♀️', label: 'Hoy no' },
]

const DRESS_OPTIONS: Option<DressCode>[] = [
  { value: 'elegant', emoji: '🤵', label: 'Elegante' },
  { value: 'casual', emoji: '👕', label: 'Casual' },
  { value: 'surprise', emoji: '🎲', label: 'Sorpréndeme' },
]

type ChoiceKey = 'food' | 'drinks' | 'dessert' | 'dress_code'
type TextKey = 'allergies' | 'message'

export type Question =
  | { kind: 'choice'; key: ChoiceKey; question: string; options: Option<string>[] }
  | { kind: 'text'; key: TextKey; question: string; placeholder: string }

/** The fun questions in "Paso 2 de 3", in order. */
export const QUESTIONS: Question[] = [
  { kind: 'choice', key: 'food', question: '¿Qué te apetece más?', options: FOOD_OPTIONS },
  { kind: 'choice', key: 'drinks', question: '¿Vino, cava o cócteles?', options: DRINK_OPTIONS },
  { kind: 'choice', key: 'dessert', question: '¿Postre?', options: DESSERT_OPTIONS },
  {
    kind: 'text',
    key: 'allergies',
    question: '¿Alguna alergia o algo que no comas?',
    placeholder: 'Por ejemplo: nada de marisco, sin cilantro…',
  },
  { kind: 'choice', key: 'dress_code', question: '¿Cómo quieres que vaya vestido?', options: DRESS_OPTIONS },
  { kind: 'text', key: 'message', question: '¿Algo más que quieras decirme?', placeholder: 'Lo que quieras… 💌' },
]

export const TEXT_MAX_LENGTH = 600

const LABELS: Record<ChoiceKey | 'time_preference', Option<string>[]> = {
  time_preference: TIME_OPTIONS,
  food: FOOD_OPTIONS,
  drinks: DRINK_OPTIONS,
  dessert: DESSERT_OPTIONS,
  dress_code: DRESS_OPTIONS,
}

/** Spanish label for a stored code, or the raw value if it is unknown. */
export function labelFor(key: keyof typeof LABELS, value: string | null | undefined): string {
  if (!value) return ''
  return LABELS[key].find((o) => o.value === value)?.label ?? value
}

/** Rows shown on the ticket (summary, confirmation and admin). */
export const SUMMARY_ROWS: { key: keyof DateResponseInput; label: string }[] = [
  { key: 'date', label: 'Día' },
  { key: 'time_preference', label: 'Momento' },
  { key: 'food', label: 'Me apetece' },
  { key: 'drinks', label: 'Para beber' },
  { key: 'dessert', label: 'Postre' },
  { key: 'dress_code', label: 'Leo va' },
  { key: 'allergies', label: 'Alergias / no como' },
  { key: 'message', label: 'Mensaje' },
]

export type AnswerSource = DateDraft | DateResponseInput
