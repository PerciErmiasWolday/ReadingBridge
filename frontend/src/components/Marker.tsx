import { useRef } from 'react'

interface MarkerProps {
  onActivate?: (trigger: HTMLElement, byHover: boolean) => void
  onActiveChange?: (active: boolean) => void
}

/** Resting the pointer this long on a marker opens its explanation; passing over it does not. */
const HOVER_DELAY_MS = 400

/**
 * A small marker dot after a sentence, in a 24px hit area. Hover (briefly), click, tap or
 * Enter opens the explanation. The marker colour is used nowhere else.
 */
export function Marker({ onActivate, onActiveChange }: MarkerProps) {
  const timer = useRef<number | undefined>(undefined)

  return (
    <button
      type="button"
      aria-label="Explain this sentence"
      onClick={(event) => {
        window.clearTimeout(timer.current)
        onActivate?.(event.currentTarget, false)
      }}
      onMouseEnter={(event) => {
        const target = event.currentTarget
        onActiveChange?.(true)
        timer.current = window.setTimeout(() => onActivate?.(target, true), HOVER_DELAY_MS)
      }}
      onMouseLeave={() => {
        window.clearTimeout(timer.current)
        onActiveChange?.(false)
      }}
      onFocus={() => onActiveChange?.(true)}
      onBlur={() => onActiveChange?.(false)}
      className="-my-1 ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full align-middle"
    >
      <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-marker" />
    </button>
  )
}
