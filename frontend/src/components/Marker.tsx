interface MarkerProps {
  onActivate?: (trigger: HTMLElement) => void
  onActiveChange?: (active: boolean) => void
}

/**
 * A small marker dot after a sentence, in a 24px hit area. Click, tap, Enter or Space opens
 * the explanation; hover and focus only underline the sentence. The marker colour is used
 * nowhere else.
 */
export function Marker({ onActivate, onActiveChange }: MarkerProps) {
  return (
    <button
      type="button"
      aria-label="Explain this sentence"
      onClick={(event) => onActivate?.(event.currentTarget)}
      onMouseEnter={() => onActiveChange?.(true)}
      onMouseLeave={() => onActiveChange?.(false)}
      onFocus={() => onActiveChange?.(true)}
      onBlur={() => onActiveChange?.(false)}
      className="-my-1 ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full align-middle"
    >
      <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-marker" />
    </button>
  )
}
