import { Link } from 'react-router-dom'

/** "Reading" in midnight, "Bridge" in forest italic, with a small open-book-as-bridge mark. */
export function Wordmark() {
  return (
    <Link
      to="/library"
      aria-label="ReadingBridge, go to Library"
      className="group flex items-center gap-2.5 rounded font-display text-[1.75rem] leading-none text-midnight"
    >
      <svg
        viewBox="0 0 34 20"
        width="34"
        height="20"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M2 16 Q9 9 17 14 Q25 9 32 16" stroke="var(--midnight)" strokeWidth="2" />
        <path d="M2 16 V19 M17 14 V19 M32 16 V19" stroke="var(--midnight)" strokeWidth="1.5" />
        <circle
          cx="25"
          cy="4"
          r="3"
          fill="var(--accent)"
          className="transition duration-500 group-hover:-translate-y-0.5"
        />
      </svg>
      <span>
        Reading<span className="italic text-accent">Bridge</span>
      </span>
    </Link>
  )
}
