interface MarkerProps {
  onActivate?: (trigger: HTMLElement) => void
  onActiveChange?: (active: boolean) => void
}

/**
 * A quiet 6px clay dot placed after a sentence. The visible dot is small but
 * the button's hit area is 24px. Clay is reserved for markers only.
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
      className="-mr-1.5 -my-1 ml-0 inline-flex h-6 w-6 items-center justify-center rounded-sm align-middle"
    >
      <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-dot bg-clay" />
    </button>
  )
}
