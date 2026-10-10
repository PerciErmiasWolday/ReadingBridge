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

const OWN_KEY = 'readingbridge.own'
const LAST_READ_KEY = 'readingbridge.lastRead'
const MAX_OWN = 10

export interface LastRead {
  storyId: string
  sectionIndex: number
}

/** The reader's own pasted or uploaded readings, newest first. Stored only in this browser. */
export function getOwnReadings(): Story[] {
  try {
    return JSON.parse(localStorage.getItem(OWN_KEY) ?? '[]') as Story[]
  } catch {
    return []
  }
}

function writeOwnReadings(readings: Story[]): void {
  try {
    localStorage.setItem(OWN_KEY, JSON.stringify(readings))
  } catch {
    // Storage unavailable: the reading opens now but is not kept.
  }
}

/** Saves a prepared reading under a unique id (keeping the newest 10) and returns it. */
export function saveOwnReading(story: Story): Story {
  const saved = { ...story, id: `own-${crypto.randomUUID().slice(0, 8)}` }
  writeOwnReadings([saved, ...getOwnReadings()].slice(0, MAX_OWN))
  return saved
}

export function removeOwnReading(id: string): void {
  writeOwnReadings(getOwnReadings().filter((story) => story.id !== id))
}

export function getStory(id: string | undefined): Story | undefined {
  return stories.find((story) => story.id === id) ?? getOwnReadings().find((s) => s.id === id)
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
