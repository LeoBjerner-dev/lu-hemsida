import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * The Supabase client, or null when the env variables are missing
 * (for example a local checkout without .env.local). The invitation still
 * renders in that case; only saving and the admin view need the client.
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    this.name = 'SupabaseNotConfiguredError'
  }
}

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new SupabaseNotConfiguredError()
  return supabase
}
