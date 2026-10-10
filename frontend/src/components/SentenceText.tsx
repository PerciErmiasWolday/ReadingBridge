import { useState } from 'react'
import type { Sentence } from '../types'
import { Marker } from './Marker'

interface SentenceTextProps {
  sentence: Sentence
  selected?: boolean
  onSelect?: (id: number) => void
}

/**
 * One sentence of story text. When its marker is hovered or focused, the
 * phrase gains a subtle clay underline, so colour is never the only cue.
 */
export function SentenceText({ sentence, selected = false, onSelect }: SentenceTextProps) {
  const [markerActive, setMarkerActive] = useState(false)

  return (
    <span data-sentence-id={sentence.id}>
      <span
        className={[
          'decoration-clay decoration-1 underline-offset-[0.3em]',
          markerActive ? 'underline' : '',
          selected ? 'bg-sage-tint' : '',
        ].join(' ')}
      >
        {sentence.text}
      </span>
      {sentence.marker && (
        <Marker
          type={sentence.marker.type}
          onActiveChange={setMarkerActive}
          onActivate={() => onSelect?.(sentence.id)}
        />
      )}{' '}
    </span>
  )
}
