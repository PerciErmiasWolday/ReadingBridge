import { useRef, useState } from 'react'
import type { Sentence } from '../types'
import { Marker } from './Marker'

interface SentenceTextProps {
  sentence: Sentence
  selected?: boolean
  /** Evidence from an open explanation, underlined in sage where it appears. */
  quote?: string
  onSelect?: (id: number) => void
  onExplain?: (id: number, trigger: HTMLElement) => void
}

/**
 * One sentence of story text. Selecting it offers "Explain this". When its marker is
 * hovered or focused, the phrase gains a subtle clay underline, so colour is never the
 * only cue.
 */
export function SentenceText({
  sentence,
  selected = false,
  quote,
  onSelect,
  onExplain,
}: SentenceTextProps) {
  const [markerActive, setMarkerActive] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <span data-sentence-id={sentence.id}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={`Select sentence ${sentence.id + 1}`}
        aria-pressed={selected}
        onClick={() => onSelect?.(sentence.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect?.(sentence.id)
          }
        }}
        className={[
          'cursor-pointer rounded-sm decoration-clay decoration-1 underline-offset-[0.3em]',
          markerActive ? 'underline' : '',
          selected ? 'bg-sage-tint' : '',
        ].join(' ')}
      >
        {underlineQuote(sentence.text, quote)}
      </span>
      {selected && (
        <button
          type="button"
          onClick={() => ref.current && onExplain?.(sentence.id, ref.current)}
          className="ml-1.5 rounded-sm font-ui text-[0.9375rem] text-sage decoration-1 underline-offset-4 hover:underline focus-visible:underline"
        >
          Explain this
        </button>
      )}
      {sentence.marker && (
        <Marker
          onActiveChange={setMarkerActive}
          onActivate={(trigger) => onExplain?.(sentence.id, trigger)}
        />
      )}{' '}
    </span>
  )
}

function underlineQuote(text: string, quote: string | undefined) {
  const evidence = 'underline decoration-sage decoration-1 underline-offset-[0.2em]'
  if (!quote) return text
  const start = text.toLowerCase().indexOf(quote.toLowerCase())
  if (start >= 0) {
    const end = start + quote.length
    return (
      <>
        {text.slice(0, start)}
        <span className={evidence}>{text.slice(start, end)}</span>
        {text.slice(end)}
      </>
    )
  }
  // A quote that spans several sentences: underline each whole sentence inside it.
  const bare = text.replace(/^[\s."]+|[\s."]+$/g, '').toLowerCase()
  return quote.toLowerCase().includes(bare) ? <span className={evidence}>{text}</span> : text
}
