import { CelebrationStep } from '../components/steps/CelebrationStep'
import { ConfirmedStep } from '../components/steps/ConfirmedStep'
import { DateStep } from '../components/steps/DateStep'
import { IntroStep } from '../components/steps/IntroStep'
import { QuestionsStep } from '../components/steps/QuestionsStep'
import { QuestionStep } from '../components/steps/QuestionStep'
import { SummaryStep } from '../components/steps/SummaryStep'
import { Screen } from '../components/Screen'
import { useDateFlow } from '../flow/useDateFlow'
import { celebrate } from '../lib/effects'

/** The public invitation: every step is a Screen, and the flow hook decides which one shows. */
export function InvitationPage() {
  const { state, go, setAnswer, startQuestions, nextQuestion, prevQuestion, confirm } = useDateFlow()
  const { step, draft } = state

  return (
    <main>
      <Screen active={step === 'intro'} label="Inicio">
        <IntroStep onNext={() => go('question')} />
      </Screen>

      <Screen active={step === 'question'} label="La pregunta">
        <QuestionStep
          onYes={() => {
            celebrate()
            go('celebration')
          }}
        />
      </Screen>

      <Screen active={step === 'celebration'} label="Celebración">
        <CelebrationStep onNext={() => go('date')} />
      </Screen>

      <Screen active={step === 'date'} label="Elegir fecha">
        <DateStep
          date={draft.date}
          timePreference={draft.time_preference}
          onDateChange={(iso) => setAnswer('date', iso)}
          onTimeChange={(time) => setAnswer('time_preference', time)}
          onNext={startQuestions}
        />
      </Screen>

      <Screen active={step === 'questions'} label="Preguntas">
        <QuestionsStep
          questionIndex={state.questionIndex}
          draft={draft}
          onAnswer={setAnswer}
          onNext={nextQuestion}
          onBack={prevQuestion}
        />
      </Screen>

      <Screen active={step === 'summary'} label="Resumen">
        <SummaryStep
          draft={draft}
          status={state.submitStatus}
          onEdit={() => go('date')}
          onConfirm={async () => {
            if (await confirm()) celebrate()
          }}
        />
      </Screen>

      <Screen active={step === 'confirmed'} label="Cita confirmada">
        <ConfirmedStep response={state.confirmed} />
      </Screen>
    </main>
  )
}
