import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  children?: ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="mb-10 max-w-measure">
      <title>{`${title} — ReadingBridge`}</title>
      <h1 className="font-display text-[2.75rem] font-normal leading-[1.1] text-ink">{title}</h1>
      {children && (
        <div className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{children}</div>
      )}
    </header>
  )
}
