import { afterEach, describe, expect, it, vi } from 'vitest'
import { newStudent } from '../data/newStudent'
import { explain } from '../services/explain'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('explain', () => {
  it('posts the whole story as one text with the sentence id and level', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal('fetch', fetchMock)
    await explain(newStudent, 4, 'simple')
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(init.body as string) as { story: string; sentence_id: number }
    expect(url).toBe('/api/explain')
    expect(body).toMatchObject({ sentence_id: 4, level: 'simple' })
    expect(body.story).toMatch(/^Maya stepped off the bus.* after all\.$/)
  })

  it('throws when the backend fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(explain(newStudent, 4, 'normal')).rejects.toThrow()
  })
})

describe('The New Student', () => {
  const sentences = newStudent.sections.flatMap((section) => section.sentences)

  it('has sequential 0-based sentence ids matching the backend', () => {
    expect(sentences.map((s) => s.id)).toEqual(sentences.map((_, i) => i))
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
