import type { Story } from '../types'

const UNAVAILABLE = "The reading service isn't running."

/** Throws the backend's own plain message, or a calm fallback if there is none. */
async function post<T>(url: string, body: BodyInit, headers?: HeadersInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { method: 'POST', body, headers })
  } catch {
    throw new Error(UNAVAILABLE)
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(typeof data?.detail === 'string' ? data.detail : UNAVAILABLE)
  }
  return data as T
}

/** Reads a .txt or text-based .pdf file on the backend. */
export function uploadFile(file: File): Promise<{ title: string; text: string }> {
  const form = new FormData()
  form.append('file', file)
  return post('/api/upload', form)
}

/** Turns text into a Story with sections, backend sentence ids and AI-suggested markers. */
export function prepare(title: string, text: string): Promise<Story> {
  return post('/api/prepare', JSON.stringify({ title, text }), {
    'Content-Type': 'application/json',
  })
}
