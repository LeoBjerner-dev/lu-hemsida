import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ResponseSummary } from '../components/ResponseSummary'
import { Screen } from '../components/Screen'
import { labelFor } from '../content/options'
import { clearConfirmation } from '../lib/confirmationStorage'
import { formatIsoLongDay, formatSentAt } from '../lib/dates'
import { supabase } from '../lib/supabase'
import { fetchDateResponses, getSession, onAuthChange, signIn, signOut } from '../services/dateResponses'
import type { DateResponse } from '../types/date'
import styles from './AdminPage.module.scss'

type AuthState = { status: 'checking' } | { status: 'signedOut' } | { status: 'signedIn'; session: Session }

/** /admin: Leo signs in and reads Luana's answers. */
export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>({ status: 'checking' })

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    getSession()
      .then((session) => {
        if (!cancelled) setAuth(session ? { status: 'signedIn', session } : { status: 'signedOut' })
      })
      .catch(() => {
        if (!cancelled) setAuth({ status: 'signedOut' })
      })
    const unsubscribe = onAuthChange((session) =>
      setAuth(session ? { status: 'signedIn', session } : { status: 'signedOut' }),
    )
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return (
    <main>
      <Screen active label="Respuestas" wide>
        <span className="eyebrow">Solo para ti</span>
        <h2>
          Respuestas de <em>Luana</em>
        </h2>

        {!supabase ? (
          <p role="alert">Falta la configuración de Supabase. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.</p>
        ) : auth.status === 'checking' ? (
          <p>Cargando…</p>
        ) : auth.status === 'signedOut' ? (
          <LoginForm />
        ) : (
          <ResponsesList email={auth.session.user.email ?? ''} />
        )}

        <AdminFooter />
      </Screen>
    </main>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      // onAuthChange switches the page to the list.
    } catch (err) {
      const invalid = err instanceof Error && /invalid/i.test(err.message)
      setError(invalid ? 'Correo o contraseña incorrectos.' : 'Algo salió mal, inténtalo otra vez.')
      setSubmitting(false)
    }
  }

  return (
    <form className={`card ${styles.form}`} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label htmlFor="admin-email">Correo electrónico</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="admin-password">Contraseña</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <button type="submit" className="btn" disabled={submitting} aria-busy={submitting}>
        {submitting ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}

type ListState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; responses: DateResponse[] }

function ResponsesList({ email }: { email: string }) {
  const [list, setList] = useState<ListState>({ status: 'loading' })
  const [signingOut, setSigningOut] = useState(false)

  const fetchList = useCallback(
    () =>
      fetchDateResponses().then(
        (responses) => setList({ status: 'ready', responses }),
        (err: unknown) => {
          console.error('Could not load responses', err)
          setList({ status: 'error' })
        },
      ),
    [],
  )

  useEffect(() => {
    void fetchList()
  }, [fetchList])

  const reload = () => {
    setList({ status: 'loading' })
    void fetchList()
  }

  const onSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } catch (err) {
      console.error('Could not sign out', err)
      setSigningOut(false)
    }
  }

  return (
    <>
      {list.status === 'loading' && <p>Cargando…</p>}
      {list.status === 'error' && (
        <>
          <p role="alert" className={styles.error}>
            No se han podido cargar las respuestas.
          </p>
          <button type="button" className="btn ghost" onClick={reload}>
            Reintentar
          </button>
        </>
      )}
      {list.status === 'ready' && (
        <>
          <p aria-live="polite">
            {list.responses.length === 0
              ? 'Aún no hay respuestas. Paciencia 🐠'
              : `${list.responses.length} respuesta${list.responses.length > 1 ? 's' : ''}`}
          </p>
          <ul className={styles.list} role="list">
            {list.responses.map((r) => (
              <li key={r.id} className={`card ${styles.entry}`}>
                <h3>
                  {formatIsoLongDay(r.date)} · {labelFor('time_preference', r.time_preference)}
                </h3>
                <div className={styles.meta}>Enviado: {formatSentAt(r.created_at)}</div>
                <ResponseSummary answers={r} withHeader={false} />
              </li>
            ))}
          </ul>
          <button type="button" className="btn ghost" onClick={reload}>
            Actualizar
          </button>
        </>
      )}
      <p className={styles.signedInAs}>Sesión iniciada como {email}</p>
      <button type="button" className="btn" disabled={signingOut} onClick={onSignOut}>
        {signingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
    </>
  )
}

function AdminFooter() {
  const [reset, setReset] = useState(false)
  return (
    <div className={styles.footer}>
      <Link to="/">Volver a la página</Link>
      <button
        type="button"
        className="link"
        onClick={() => {
          clearConfirmation()
          setReset(true)
        }}
      >
        {reset ? 'Listo: la página empezará de cero en este dispositivo' : 'Reiniciar la página en este dispositivo'}
      </button>
    </div>
  )
}
