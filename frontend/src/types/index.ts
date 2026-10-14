export type MarkerType = 'feeling' | 'who' | 'why' | 'idiom' | 'other'

export interface Sentence {
  id: number
  text: string
  marker?: { type: MarkerType }
}

/** An optional check of something the section implies. Never scored or stored. */
export interface Quiz {
  question: string
  options: [string, string, string]
  answerIndex: number
  evidenceSentenceId: number
  why: string
}

export interface Section {
  id: string
  sentences: Sentence[]
  quiz?: Quiz
}

export interface Story {
  id: string
  title: string
  description: string
  category: string
  readMinutes: number
  sections: Section[]
  /** Own readings only: the cover picture the student chose (see data/covers.ts). */
  cover?: string
  /** Own readings only: the student's own picture, already shrunk to cover size (a data URL). */
  coverImage?: string
}

/** Must match the backend /explain response exactly. */
export interface Explanation {
  type: MarkerType
  clue_quote: string
  clue: string
  meaning: string
  not_in_text: boolean
  sentence_id: number
  checks: string[]
  fallback?: boolean
}

export type ExplainLevel = 'normal' | 'simple'
