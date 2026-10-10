export type MarkerType = 'feeling' | 'who' | 'why' | 'idiom' | 'other'

export interface Sentence {
  id: number
  text: string
  marker?: { type: MarkerType }
}

export interface Section {
  id: string
  sentences: Sentence[]
}

export interface Story {
  id: string
  title: string
  category: string
  readMinutes: number
  sections: Section[]
}

/** Must match the backend /explain response exactly. */
export interface Explanation {
  type: MarkerType
  clue_quote: string
  clue: string
  meaning: string
  not_in_text: boolean
  checks: string[]
  fallback?: boolean
}

export type ExplainLevel = 'normal' | 'simple'
