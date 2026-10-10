import type { ExplainLevel, Explanation, Story } from '../types'

/**
 * Asks the backend to explain one sentence. The story is sent as one text, all sections
 * joined with spaces, so the backend's sentence ids match ours.
 */
export async function explain(
  story: Story,
  sentenceId: number,
  level: ExplainLevel,
): Promise<Explanation> {
  const text = story.sections
    .flatMap((section) => section.sentences)
    .map((sentence) => sentence.text)
    .join(' ')
  const response = await fetch('/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ story: text, sentence_id: sentenceId, level }),
  })
  if (!response.ok) throw new Error(`explain failed: ${response.status}`)
  return (await response.json()) as Explanation
}
