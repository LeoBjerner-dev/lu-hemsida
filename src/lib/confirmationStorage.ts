// Remembers on this device that she already confirmed, so reopening the page
// shows the confirmation screen instead of starting over.
import type { DateResponseInput } from '../types/date'

const KEY = 'cita-luana-confirmed-v1'

export function loadConfirmation(): DateResponseInput | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DateResponseInput>
    return parsed && typeof parsed.date === 'string' ? (parsed as DateResponseInput) : null
  } catch {
    return null
  }
}

export function saveConfirmation(response: DateResponseInput): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(response))
  } catch {
    // Private mode or blocked storage: the confirmation just won't survive a reload.
  }
}

export function clearConfirmation(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}
