import { useEffect, useRef } from 'react'
import type { Explanation } from '../types'

interface HelpCardProps {
  status: 'loading' | 'done' | 'error'
  explanation?: Explanation
  simple: boolean
  onSimpler: () => void
  onRetry: () => void
  onClose: () => void
}

const link =
  'rounded-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:underline'

/**
 * Compact help shown right under the sentence it explains. The thin rule in the marker colour
 * ties it to that sentence. Focus moves into the card when it opens.
 */
export function HelpCard({
  status,
  explanation,
  simple,
  onSimpler,
  onRetry,
  onClose,
}: HelpCardProps) {
  const card = useRef<HTMLElement>(null)
  useEffect(() => card.current?.focus(), [])
  const found = status === 'done' && explanation && !explanation.not_in_text

  return (
    <aside
      ref={card}
      tabIndex={-1}
      aria-label="Explanation"
      className="fade-in my-3 max-w-measure border-l-[2px] border-marker bg-r-raised p-3 font-ui text-[0.9375rem] leading-relaxed"
    >
      <div aria-live="polite">
        {status === 'loading' && <p className="m-0 text-r-soft">Reading the story…</p>}
        {status === 'error' && <p className="m-0">Couldn't get an explanation.</p>}
        {status === 'done' && !found && <p className="m-0">The story doesn't tell us this.</p>}
        {found && (
          <>
            <p className="m-0">{explanation.meaning}</p>
            <p className="m-0 mt-1 text-r-soft">
              Clue: <i className="text-r-ink">“{explanation.clue_quote}”</i>
            </p>
          </>
        )}
      </div>
      <p className="m-0 mt-2 flex flex-wrap gap-x-4">
        {status === 'error' && (
          <button type="button" onClick={onRetry} className={link}>
            Try again
          </button>
        )}
        {found && !simple && (
          <button type="button" onClick={onSimpler} className={link}>
            Say it more simply
          </button>
        )}
        <button type="button" onClick={onClose} className={link}>
          Close
        </button>
      </p>
    </aside>
  )
}
