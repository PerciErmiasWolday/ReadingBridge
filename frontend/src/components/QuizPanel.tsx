import { useEffect, useRef, useState } from 'react'
import type { Quiz } from '../types'
import { Arrow } from './Arrow'
import { Button } from './Button'

interface QuizPanelProps {
  quiz: Quiz
  evidence: string
  continueLabel: string
  /** Called when feedback shows, so the story can underline the evidence sentence. */
  onFeedback: () => void
  onContinue: () => void
  onClose: () => void
}

const link =
  'rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:underline'

/** An optional check of the section. Answers live only in this component: nothing is stored. */
export function QuizPanel({
  quiz,
  evidence,
  continueLabel,
  onFeedback,
  onContinue,
  onClose,
}: QuizPanelProps) {
  const [choice, setChoice] = useState<number | 'unsure' | null>(null)
  const [checked, setChecked] = useState<number | 'unsure' | null>(null)
  const [error, setError] = useState('')
  const panel = useRef<HTMLElement>(null)
  useEffect(() => panel.current?.focus(), [])

  function check() {
    if (choice === null) return setError('Choose an answer first.')
    setError('')
    setChecked(choice)
    onFeedback()
  }

  const lead =
    checked === 'unsure'
      ? 'Here’s a clue:'
      : checked === quiz.answerIndex
        ? 'Yes.'
        : 'Not quite. Look at this sentence:'

  return (
    <section
      ref={panel}
      tabIndex={-1}
      aria-label="Quiz"
      className="fade-in mt-10 rounded border border-r-line p-5 font-ui text-[0.9375rem]"
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 font-display text-[1.5rem] leading-tight">{quiz.question}</legend>
        {[...quiz.options, 'I’m not sure'].map((option, index) => {
          const value = index < quiz.options.length ? index : 'unsure'
          return (
            <label key={option} className="flex cursor-pointer items-center gap-3 py-1.5">
              <input
                type="radio"
                name="quiz"
                checked={choice === value}
                onChange={() => setChoice(value)}
                className="h-4 w-4 cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              {option}
            </label>
          )
        })}
      </fieldset>
      {error && <p className="m-0 mt-2 text-r-soft">{error}</p>}
      <Button variant="readingSecondary" onClick={check} className="mt-4">
        Check answer
      </Button>

      {checked !== null && (
        <div aria-live="polite" className="mt-5 border-t border-r-line pt-4">
          <p className="m-0 font-medium">{lead}</p>
          <blockquote className="m-0 mt-2 border-l-[2px] border-accent pl-3 font-story italic">
            “{evidence}”
          </blockquote>
          <p className="m-0 mt-2">{quiz.why}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button variant="reading" onClick={onContinue}>
              {continueLabel}
              <Arrow />
            </Button>
            <button type="button" onClick={onClose} className={link}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
