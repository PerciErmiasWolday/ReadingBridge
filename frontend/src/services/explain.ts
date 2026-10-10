import type { ExplainLevel, Explanation, Story } from '../types'

/*
 * MOCK — no backend call is made.
 * Returns canned data in the exact Explanation shape the backend /explain
 * endpoint returns. A later phase replaces the body of `explain` with a fetch to the
 * backend; the signature stays the same so no component needs to change.
 */
export const IS_MOCK = true

export async function explain(
  story: Story,
  sentenceId: number,
  level: ExplainLevel,
): Promise<Explanation> {
  const sentence = story.sections
    .flatMap((section) => section.sentences)
    .find((s) => s.id === sentenceId)

  if (!sentence) {
    return {
      type: 'other',
      clue_quote: '',
      clue: '',
      meaning: 'MOCK: This sentence could not be found in the story.',
      not_in_text: true,
      checks: [],
      fallback: true,
    }
  }

  const simple = level === 'simple'

  return {
    type: sentence.marker?.type ?? 'other',
    clue_quote: sentence.text,
    clue: simple
      ? 'MOCK: Look at what the character does.'
      : 'MOCK: The clue is in what the character does, not in what the text says directly.',
    meaning: simple
      ? 'MOCK: A short, plain explanation will appear here.'
      : 'MOCK: An explanation grounded in this sentence will appear here.',
    not_in_text: false,
    checks: ['MOCK: A question you can ask yourself about this sentence.'],
  }
}
