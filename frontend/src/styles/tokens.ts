/** Colour tokens as data, for the styleguide. Kept in sync with tokens.css by a test. */
export const colorTokens = [
  { name: '--ivory', hex: '#F5EFE3', use: 'Page background, warm paper' },
  { name: '--ivory-deep', hex: '#EBE2D0', use: 'Bands that set a section apart' },
  { name: '--paper', hex: '#FBF8F1', use: 'Raised paper: panels, inputs' },
  { name: '--midnight', hex: '#18213D', use: 'Headlines, primary buttons, the wordmark' },
  { name: '--ink', hex: '#252B3F', use: 'Body text' },
  { name: '--ink-soft', hex: '#5A5F73', use: 'Secondary text (minimum for any readable text)' },
  { name: '--line', hex: '#DCD3C2', use: 'Rules and borders' },
  { name: '--line-strong', hex: '#BFB49F', use: 'Hover borders' },
  { name: '--accent', hex: '#2E5B47', use: 'Forest green: links, focus, progress, active nav' },
  { name: '--accent-tint', hex: '#DDE8DF', use: 'Forest wash: selected chips' },
  { name: '--mustard-tint', hex: '#F3E3B8', use: 'Sentence selection: the only mustard' },
  { name: '--marker', hex: '#B9502F', use: 'Marker dots only. Used nowhere else.' },
] as const
