import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Plain title for the document title and the accessible heading. */
  title: string
  eyebrow?: string
  /** Optional styled version of the title, e.g. with an italic word. */
  display?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, eyebrow, display, children }: PageHeaderProps) {
  return (
    <header className="rise mb-12 max-w-3xl">
      <title>{`${title} — ReadingBridge`}</title>
      {eyebrow && <p className="label-caps m-0 mb-4 text-accent">{eyebrow}</p>}
      <h1 className="font-display text-[3rem] font-normal leading-[1.02] text-midnight md:text-[4.25rem]">
        {display ?? title}
      </h1>
      {children && (
        <div className="mt-5 max-w-xl text-[1.125rem] leading-relaxed text-ink-soft">
          {children}
        </div>
      )}
    </header>
  )
}
