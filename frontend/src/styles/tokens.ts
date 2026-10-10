/** Colour tokens as data, for the styleguide. Kept in sync with tokens.css by a test. */
export const colorTokens = [
  { name: '--paper', hex: '#F3F1EC', use: 'Page background' },
  { name: '--surface', hex: '#EAE7E0', use: 'Subtle raised areas such as the panel background' },
  { name: '--ink', hex: '#22221F', use: 'Primary text and the primary button fill' },
  { name: '--ink-soft', hex: '#5E5B54', use: 'Secondary text (minimum for any readable text)' },
  { name: '--rule', hex: '#D6D2C8', use: 'Hairline borders and dividers' },
  { name: '--rule-strong', hex: '#B9B4A8', use: 'Hover borders and the strip dividers' },
  {
    name: '--sage',
    hex: '#576B5E',
    use: 'The single interface accent: links, focus, selected nav',
  },
  { name: '--sage-tint', hex: '#E3E7E1', use: 'Sentence selection and highlight background' },
  { name: '--clay', hex: '#A65F45', use: 'Markers only. Used nowhere else.' },
] as const
