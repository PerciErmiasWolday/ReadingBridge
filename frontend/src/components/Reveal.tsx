import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Rises into view the first time it scrolls onto the screen, when motion is on. With motion off
 * (the default) or without IntersectionObserver, the content simply shows.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(
    () =>
      typeof IntersectionObserver === 'undefined' ||
      document.documentElement.dataset.motion !== 'on',
  )

  useEffect(() => {
    if (seen || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [seen])

  return (
    <div
      ref={ref}
      className={`${seen ? 'rise' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `calc(var(--motion-duration) * ${delay})` }}
    >
      {children}
    </div>
  )
}
