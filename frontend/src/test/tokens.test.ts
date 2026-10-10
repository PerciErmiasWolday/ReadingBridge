import { describe, expect, it } from 'vitest'
import tokensCss from '../styles/tokens.css?raw'
import { colorTokens } from '../styles/tokens'

describe('design tokens', () => {
  it('keeps the styleguide colour list in sync with tokens.css', () => {
    for (const token of colorTokens) {
      const match = new RegExp(`${token.name}:\\s*(#[0-9a-f]{6});`, 'i').exec(tokensCss)
      expect(match?.[1].toLowerCase(), token.name).toBe(token.hex.toLowerCase())
    }
  })

  it('uses the marker colour only for markers', () => {
    const sources = import.meta.glob('../**/*.tsx', {
      query: '?raw',
      import: 'default',
      eager: true,
    })
    for (const [file, source] of Object.entries(sources)) {
      if (
        file.includes('/test/') ||
        file.endsWith('/Marker.tsx') ||
        file.endsWith('/SentenceText.tsx')
      ) {
        continue
      }
      expect(source as string, file).not.toMatch(/\b(?:bg|text|border|decoration)-marker\b/)
    }
  })
})
