import type { Config } from 'tailwindcss'

/**
 * Austurbane design tokens. Every value maps to a CSS variable in
 * src/styles/tokens.css. The default Tailwind palette, radii and shadows are
 * replaced (not extended) so off-system values cannot be used by accident.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      paper: 'var(--paper)',
      surface: 'var(--surface)',
      ink: 'var(--ink)',
      'ink-soft': 'var(--ink-soft)',
      rule: 'var(--rule)',
      'rule-strong': 'var(--rule-strong)',
      sage: 'var(--sage)',
      'sage-tint': 'var(--sage-tint)',
      clay: 'var(--clay)',
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
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      dot: '50%', // the marker dot only — never for buttons or containers
    },
    borderWidth: {
      0: '0',
      DEFAULT: '1px',
    },
    boxShadow: {
      none: 'none',
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
