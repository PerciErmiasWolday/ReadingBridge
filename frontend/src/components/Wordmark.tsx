import { Link } from 'react-router-dom'

export function Wordmark() {
  return (
    <Link
      to="/library"
      className="font-display text-[1.75rem] leading-none text-ink rounded-sm"
      aria-label="ReadingBridge, go to Library"
    >
      ReadingBridge
    </Link>
  )
}
