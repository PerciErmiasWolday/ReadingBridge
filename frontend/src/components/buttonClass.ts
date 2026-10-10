/** `reading` and `readingSecondary` follow the reading theme, so they stay visible on night pages. */
export type Variant = 'primary' | 'secondary' | 'reading' | 'readingSecondary'

/** Shared look for buttons and button-styled links. `group` lets an arrow inside nudge on hover. */
export const buttonClass = (variant: Variant = 'primary') =>
  [
    'group inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition',
    'disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-ink-soft',
    {
      primary: 'border-midnight bg-midnight text-ivory hover:-translate-y-0.5',
      secondary: 'border-line-strong bg-transparent text-midnight hover:border-midnight',
      reading: 'border-r-ink bg-r-ink text-r-bg hover:-translate-y-0.5',
      readingSecondary: 'border-r-soft bg-transparent text-r-ink hover:border-r-ink',
    }[variant],
  ].join(' ')
