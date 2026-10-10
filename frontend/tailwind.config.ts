import type { Config } from 'tailwindcss'

/**
 * ReadingBridge design tokens. Every colour maps to a CSS variable in
 * src/styles/tokens.css. The default Tailwind palette, radii and shadows are
 * replaced (not extended) so off-system values cannot be used by accident.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      ivory: 'var(--ivory)',
      'ivory-deep': 'var(--ivory-deep)',
      paper: 'var(--paper)',
      midnight: 'var(--midnight)',
      ink: 'var(--ink)',
      'ink-soft': 'var(--ink-soft)',
      line: 'var(--line)',
      'line-strong': 'var(--line-strong)',
      accent: 'var(--accent)',
      'accent-tint': 'var(--accent-tint)',
      'mustard-tint': 'var(--mustard-tint)',
      marker: 'var(--marker)',
      'r-bg': 'var(--r-bg)',
      'r-raised': 'var(--r-raised)',
      'r-ink': 'var(--r-ink)',
      'r-soft': 'var(--r-soft)',
      'r-line': 'var(--r-line)',
      'r-select': 'var(--r-select)',
    },
    fontFamily: {
      display: 'var(--font-display)',
      story: 'var(--font-story)',
      ui: 'var(--font-ui)',
      reading: 'var(--reading-font-family)',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      DEFAULT: '6px', // inputs, panels
      lg: '10px', // the hero arch frame and large panels
      full: '9999px', // pill buttons, chips, dots, progress bars
    },
    borderWidth: {
      0: '0',
      DEFAULT: '1px',
    },
    boxShadow: {
      none: 'none',
      // A printed book resting on paper: a tight contact shadow plus a soft fall-off.
      book: '0 1px 1px rgb(24 33 61 / 0.18), 0 10px 24px -8px rgb(24 33 61 / 0.35)',
      panel: '0 1px 2px rgb(24 33 61 / 0.06), 0 8px 24px -12px rgb(24 33 61 / 0.18)',
    },
    extend: {
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        'label-lg': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        reading: ['var(--reading-font-size)', { lineHeight: 'var(--reading-line-height)' }],
      },
      maxWidth: {
        measure: 'var(--reading-measure)',
      },
      transitionDuration: {
        DEFAULT: 'var(--motion-duration)',
      },
      transitionProperty: {
        DEFAULT: 'opacity, transform',
      },
    },
  },
  plugins: [],
}

export default config
