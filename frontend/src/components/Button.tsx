import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary: 'border-ink bg-ink text-paper hover:opacity-90',
  secondary: 'border-rule bg-transparent text-ink hover:border-rule-strong',
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-sm border px-5 py-2.5 text-[0.9375rem] font-medium transition',
        'disabled:cursor-not-allowed disabled:border-rule disabled:bg-transparent disabled:text-ink-soft disabled:opacity-100',
        variants[variant],
        className,
      ].join(' ')}
    />
  )
}
