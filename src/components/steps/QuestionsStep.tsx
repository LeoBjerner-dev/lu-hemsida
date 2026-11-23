import { useEffect, useRef, useState } from 'react'
import { QUESTIONS, TEXT_MAX_LENGTH } from '../../content/options'
import { prefersReducedMotion, puff } from '../../lib/effects'
import type { DateDraft } from '../../types/date'
import styles from './QuestionsStep.module.scss'

interface QuestionsStepProps {
  questionIndex: number
  draft: DateDraft
  onAnswer: (key: keyof DateDraft, value: string) => void
  onNext: () => void
  onBack: () => void
}

/** Step 2 of 3: one fun question at a time, sliding between them. */
export function QuestionsStep({ questionIndex, draft, onAnswer, onNext, onBack }: QuestionsStepProps) {
  const question = QUESTIONS[questionIndex]
  const isLast = questionIndex === QUESTIONS.length - 1
  const bodyRef = useRef<HTMLDivElement>(null)
  const previousIndex = useRef(questionIndex)
  const [busy, setBusy] = useState(false)

  // Slide out, then let the reducer change question.
  const swap = (action: () => void) => {
    const el = bodyRef.current
    if (!el || prefersReducedMotion() || typeof el.animate !== 'function') {
      action()
      setBusy(false)
      return
    }
    setBusy(true)
    const out = el.animate(
      [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: 'translateX(-16px)' },
      ],
      { duration: 220, easing: 'ease-in', fill: 'forwards' },
    )
    out.onfinish = () => {
      action()
      out.cancel()
      setBusy(false)
    }
  }

  // Slide the new question in and move focus to it.
  useEffect(() => {
    if (previousIndex.current === questionIndex) return
    previousIndex.current = questionIndex
    const el = bodyRef.current
    if (!el) return
    if (!prefersReducedMotion() && typeof el.animate === 'function') {
      el.animate(
        [
          { opacity: 0, transform: 'translateX(16px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 320, easing: 'ease-out' },
      )
    }
    el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
  }, [questionIndex])

  const goNext = () => (isLast ? onNext() : swap(onNext))
  const goBack = () => (questionIndex === 0 ? onBack() : swap(onBack))

  return (
    <>
      <span className="eyebrow">Paso 2 de 3</span>
      <div className={styles.progress} aria-hidden="true">
        {QUESTIONS.map((q, i) => (
          <i key={q.key} className={i <= questionIndex ? styles.on : undefined} />
        ))}
      </div>
      <div ref={bodyRef} className={styles.body}>
        <h2 tabIndex={-1}>{question.question}</h2>
        <p className="visually-hidden">
          Pregunta {questionIndex + 1} de {QUESTIONS.length}
        </p>

        {question.kind === 'choice' ? (
          <>
            <div className="chips" role="group" aria-label={question.question}>
              {question.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className="chip"
                  aria-pressed={draft[question.key] === o.value}
                  onClick={(e) => {
                    if (busy) return
                    setBusy(true)
                    onAnswer(question.key, o.value)
                    const r = e.currentTarget.getBoundingClientRect()
                    puff(r.left + r.width / 2, r.top, 6)
                    window.setTimeout(goNext, 420)
                  }}
                >
                  {o.emoji} {o.label}
                </button>
              ))}
            </div>
            <div className="row">
              <button type="button" className="link" onClick={goBack}>
                Atrás
              </button>
            </div>
          </>
        ) : (
          <TextQuestion
            key={question.key}
            id={`q-${question.key}`}
            label={question.question}
            placeholder={question.placeholder}
            initialValue={draft[question.key] ?? ''}
            submitLabel={isLast ? 'Ver resumen' : 'Siguiente'}
            disabled={busy}
            onBack={goBack}
            onSubmit={(value) => {
              onAnswer(question.key, value.trim())
              goNext()
            }}
          />
        )}
      </div>
    </>
  )
}

interface TextQuestionProps {
  id: string
  label: string
  placeholder: string
  initialValue: string
  submitLabel: string
  disabled: boolean
  onBack: () => void
  onSubmit: (value: string) => void
}

function TextQuestion({ id, label, placeholder, initialValue, submitLabel, disabled, onBack, onSubmit }: TextQuestionProps) {
  const [value, setValue] = useState(initialValue)
  return (
    <>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        placeholder={placeholder}
        maxLength={TEXT_MAX_LENGTH}
        value={value}
        aria-describedby={`${id}-hint`}
        onChange={(e) => setValue(e.target.value)}
      />
      <p id={`${id}-hint`} className={styles.optional}>
        Opcional
      </p>
      <div className="row">
        <button type="button" className="link" onClick={onBack}>
          Atrás
        </button>
        <button type="button" className="btn" disabled={disabled} onClick={() => onSubmit(value)}>
          {submitLabel}
        </button>
      </div>
    </>
  )
}
