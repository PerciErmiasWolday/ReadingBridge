import type { MarkerType, Story } from '../types'
import { newStudent } from './newStudent'
import { scienceFair } from './scienceFair'
import { twoFriends } from './twoFriends'

export const stories: Story[] = [newStudent, scienceFair, twoFriends]

/** The kinds of unstated meaning a marker can point at, in plain words. */
export const skills: Record<MarkerType, { label: string; blurb: string }> = {
  feeling: { label: 'Feelings', blurb: 'What a character feels when the story only shows it.' },
  idiom: {
    label: 'Figurative language',
    blurb: 'Phrases like “break a leg” that mean something other than their words.',
  },
  who: { label: 'Who’s who', blurb: 'Who “he”, “she” or “it” points back to.' },
  why: {
    label: 'Cause and effect',
    blurb: 'Why something happened, when the story leaves it out.',
  },
  other: { label: 'Other clues', blurb: 'Anything else the story suggests without saying.' },
}

/** The marker types a story contains, in a stable order. */
export function storySkills(story: Story): MarkerType[] {
  const found = new Set(
    story.sections.flatMap((section) => section.sentences.map((s) => s.marker?.type)),
  )
  return (Object.keys(skills) as MarkerType[]).filter((type) => found.has(type))
}

const PASTED_KEY = 'readingbridge.pasted'
const LAST_READ_KEY = 'readingbridge.lastRead'

export interface LastRead {
  storyId: string
  sectionIndex: number
}

export function getStory(id: string | undefined): Story | undefined {
  if (id === 'pasted') {
    try {
      const saved = sessionStorage.getItem(PASTED_KEY)
      return saved ? (JSON.parse(saved) as Story) : undefined
    } catch {
      return undefined
    }
  }
  return stories.find((story) => story.id === id)
}

export function savePastedStory(story: Story): void {
  try {
    sessionStorage.setItem(PASTED_KEY, JSON.stringify(story))
  } catch {
    // Storage unavailable: the reader will show "Story not found".
  }
}

export function getLastRead(): LastRead | null {
  try {
    const saved = localStorage.getItem(LAST_READ_KEY)
    return saved ? (JSON.parse(saved) as LastRead) : null
  } catch {
    return null
  }
}

export function clearLastRead(): void {
  try {
    localStorage.removeItem(LAST_READ_KEY)
  } catch {
    // Storage unavailable: nothing to clear.
  }
}

export function saveLastRead(lastRead: LastRead): void {
  try {
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead))
  } catch {
    // Storage unavailable: Continue reading stays hidden.
  }
}
