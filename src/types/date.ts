// Shared types for Luana's answers. Used by the invitation flow, the service
// layer and the admin view, so the database row and the form never drift apart.

export type TimePreference = 'lunch' | 'dinner'
export type Food = 'fish' | 'meat' | 'surprise'
export type Drinks = 'red_wine' | 'white_wine' | 'cava' | 'cocktail' | 'no_alcohol'
export type Dessert = 'yes' | 'share' | 'no'
export type DressCode = 'elegant' | 'casual' | 'surprise'

/** What she fills in. Matches the columns of `date_responses` except id/created_at. */
export interface DateResponseInput {
  /** ISO date, YYYY-MM-DD */
  date: string
  time_preference: TimePreference
  food: Food
  drinks: Drinks
  dessert: Dessert
  allergies: string
  dress_code: DressCode
  message: string
}

/** A saved row in `date_responses`. */
export interface DateResponse extends DateResponseInput {
  id: string
  created_at: string
}

/** The form while she is still filling it in: every answer may be missing. */
export type DateDraft = {
  [K in keyof DateResponseInput]: DateResponseInput[K] | null
}

export const emptyDraft: DateDraft = {
  date: null,
  time_preference: null,
  food: null,
  drinks: null,
  dessert: null,
  allergies: null,
  dress_code: null,
  message: null,
}
