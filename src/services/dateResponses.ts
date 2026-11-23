// All database and auth calls live here so components stay free of Supabase details.
import type { Session } from '@supabase/supabase-js'
import { requireSupabase, supabase } from '../lib/supabase'
import type { DateResponse, DateResponseInput } from '../types/date'

const TABLE = 'date_responses'

/**
 * Saves her answers. Anonymous users may only INSERT (see the RLS policies),
 * so we must not ask for the inserted row back: that would need SELECT.
 */
export async function submitDateResponse(input: DateResponseInput): Promise<void> {
  const { error } = await requireSupabase().from(TABLE).insert(input)
  if (error) throw error
}

/** All responses, newest first. Only works for a signed-in user. */
export async function fetchDateResponses(): Promise<DateResponse[]> {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select('id, created_at, date, time_preference, food, drinks, dessert, allergies, dress_code, message')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as DateResponse[]
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const { error } = await requireSupabase().auth.signOut()
  if (error) throw error
}

export async function getSession(): Promise<Session | null> {
  const { data } = await requireSupabase().auth.getSession()
  return data.session
}

/** Calls back whenever the user signs in or out. Returns an unsubscribe function. */
export function onAuthChange(callback: (session: Session | null) => void): () => void {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}
