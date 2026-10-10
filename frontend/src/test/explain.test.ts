import { describe, expect, it } from 'vitest'
import { newStudent } from '../data/newStudent'
import { explain, IS_MOCK } from '../services/explain'

describe('explain (mock)', () => {
  it('is clearly a mock', () => {
    expect(IS_MOCK).toBe(true)
  })

  it('returns the Explanation shape for a marked sentence', async () => {
    const result = await explain(newStudent, 4, 'normal')
    expect(result).toEqual({
      type: 'feeling',
      clue_quote: "Maya's heart beat quickly.",
      clue: expect.stringContaining('MOCK'),
      meaning: expect.stringContaining('MOCK'),
      not_in_text: false,
      checks: [expect.stringContaining('MOCK')],
    })
  })

  it('falls back for an unknown sentence', async () => {
    const result = await explain(newStudent, 999, 'simple')
    expect(result.fallback).toBe(true)
    expect(result.not_in_text).toBe(true)
  })
})

describe('The New Student', () => {
  const sentences = newStudent.sections.flatMap((section) => section.sentences)

  it('has sequential numeric sentence ids', () => {
    expect(sentences.map((s) => s.id)).toEqual(sentences.map((_, i) => i + 1))
  })

  it('marks the three required feeling sentences', () => {
    const marked = sentences.filter((s) => s.marker).map((s) => s.text)
    expect(marked).toHaveLength(3)
    expect(marked[0]).toMatch(/^Maya stepped off the bus/)
    expect(marked[1]).toBe("Maya's heart beat quickly.")
    expect(marked[2]).toBe('Then she looked down at her shoes.')
    expect(sentences.filter((s) => s.marker).every((s) => s.marker?.type === 'feeling')).toBe(true)
  })
})
