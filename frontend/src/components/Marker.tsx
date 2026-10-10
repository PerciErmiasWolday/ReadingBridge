import type { MarkerType } from '../types'

const descriptions: Record<MarkerType, string> = {
  feeling: 'a feeling',
  who: 'who someone is',
  why: 'why something happens',
  idiom: 'a figure of speech',
  other: 'something implied',
}

interface MarkerProps {
  type: MarkerType
  onActivate?: () => void
  onActiveChange?: (active: boolean) => void
}

/**
 * A quiet 6px clay dot placed after a sentence. The visible dot is small but
 * the button's hit area is 24px. Clay is reserved for markers only.
 */
export function Marker({ type, onActivate, onActiveChange }: MarkerProps) {
  return (
    <button
      type="button"
      aria-label={`Explain this sentence: it hints at ${descriptions[type]}`}
      onClick={onActivate}
      onMouseEnter={() => onActiveChange?.(true)}
      onMouseLeave={() => onActiveChange?.(false)}
      onFocus={() => onActiveChange?.(true)}
      onBlur={() => onActiveChange?.(false)}
      className="-mr-1.5 -my-1 ml-0 inline-flex h-6 w-6 items-center justify-center rounded-sm align-middle"
    >
      <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-dot bg-clay" />
    </button>
  )
}
