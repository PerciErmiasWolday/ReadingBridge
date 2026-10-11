import { Lightbulb } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Sentence } from '../types'
import { Marker } from './Marker'

interface SentenceTextProps {
  sentence: Sentence
  selected?: boolean
  /** Its help card is open, so the "Help me with this" offer is not needed. */
  open?: boolean
  /** Evidence from an open explanation, underlined in the accent colour where it appears. */
  quote?: string
  onSelect?: (id: number) => void
  onExplain?: (id: number, trigger: HTMLElement) => void
}

/**
 * One sentence of story text. Selecting it offers "Help me with this", for anything that
 * is not marked. When its marker is hovered or focused, the phrase gains a subtle underline
 * in the marker colour, so colour is never the only cue.
 */
export function SentenceText({
  sentence,
  selected = false,
  open = false,
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
          'cursor-pointer rounded-sm decoration-marker decoration-1 underline-offset-[0.3em]',
          markerActive ? 'underline' : '',
          selected ? 'bg-r-select' : '',
        ].join(' ')}
      >
        {underlineQuote(sentence.text, quote)}
      </span>
      {selected && onExplain && !open && (
        <button
          type="button"
          onClick={() => ref.current && onExplain?.(sentence.id, ref.current)}
          className="fade-in mx-1 inline-flex items-center gap-1 rounded-full border border-current px-2.5 py-0.5 align-[0.1em] font-ui text-[0.875rem] font-medium text-accent hover:underline"
        >
          <Lightbulb size={14} strokeWidth={1.75} aria-hidden="true" />
          Help me with this
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
  const evidence = 'underline decoration-accent decoration-2 underline-offset-[0.25em]'
  if (!quote) return text
  // Like the backend check, ' and " count as the same mark (one character for one, so indexes hold).
  const plain = (value: string) => value.replace(/[‘’“”']/g, '"').toLowerCase()
  const start = plain(text).indexOf(plain(quote))
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
  const bare = plain(text.replace(/^[\s."]+|[\s."]+$/g, ''))
  return plain(quote).includes(bare) ? <span className={evidence}>{text}</span> : text
}
