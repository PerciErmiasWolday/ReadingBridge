import { Link } from 'react-router-dom'

/** "Reading" in midnight, "Bridge" in forest italic. Text only, no mark. */
export function Wordmark() {
  return (
    <Link
      to="/library"
      aria-label="ReadingBridge, go to Library"
      className="rounded font-display text-[1.75rem] leading-none text-midnight"
    >
      Reading<span className="italic text-accent">Bridge</span>
    </Link>
  )
}
