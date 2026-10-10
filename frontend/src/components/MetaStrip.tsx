export interface MetaItem {
  label: string
  value: string
}

interface MetaStripProps {
  items: MetaItem[]
  className?: string
}

/**
 * The ruled metadata strip — label/value facts in hairline-ruled cells, after
 * specimen labels on packaging. Use for story headers and library entries only.
 */
export function MetaStrip({ items, className = '' }: MetaStripProps) {
  return (
    <dl className={`flex w-fit max-w-full flex-wrap pl-px pt-px ${className}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="-ml-px -mt-px flex items-baseline gap-3 border border-rule-strong px-3 py-2"
        >
          <dt className="label-caps text-ink-soft">{item.label}</dt>
          <dd className="m-0 text-[0.8125rem] text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
