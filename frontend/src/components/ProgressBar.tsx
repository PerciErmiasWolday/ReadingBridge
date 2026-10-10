/** A thin progress line that draws itself in. Decorative: callers always show progress as text. */
export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`h-1 overflow-hidden rounded-full bg-r-line ${className}`}>
      <div className="draw-in h-full rounded-full bg-accent" style={{ width: `${value * 100}%` }} />
    </div>
  )
}
