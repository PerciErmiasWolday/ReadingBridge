/** Splits a pasted story into sentences with the backend, so sentence ids match /explain. */
export async function split(story: string): Promise<string[]> {
  const response = await fetch('/api/split', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story }),
  })
  if (!response.ok) throw new Error(`split failed: ${response.status}`)
  const data = (await response.json()) as { sentences: string[] }
  return data.sentences
}
