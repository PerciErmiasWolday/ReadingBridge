import { ArrowRight } from 'lucide-react'

/** The arrow used inside buttons and links; it nudges forward when its `group` is hovered. */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <ArrowRight
      size={18}
      strokeWidth={1.75}
      aria-hidden="true"
      className={`shrink-0 transition duration-300 group-hover:translate-x-1 ${className}`}
    />
  )
}
