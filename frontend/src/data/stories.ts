import type { MarkerType, Section, Story } from '../types'
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

// v2: sentence ids changed with the Phase 6b splitter fix, so readings saved earlier are dropped.
const OWN_KEY = 'readingbridge.own.v2'
const LAST_READ_KEY = 'readingbridge.lastRead'
const MAX_OWN = 10

export interface LastRead {
  storyId: string
  sectionIndex: number
}

/** The reader's own pasted or uploaded readings, newest first. Stored only in this browser. */
export function getOwnReadings(): Story[] {
  try {
    return (JSON.parse(localStorage.getItem(OWN_KEY) ?? '[]') as Story[]).map(toPages)
  } catch {
    return []
  }
}

const MIN_PAGE = 5

/**
 * The backend makes one section per paragraph, so short paragraphs give pages of one or two
 * sentences. Join them until each page has at least five sentences, and fold a short last page
 * into the one before. Sentence ids do not change, so they still match /explain.
 */
export function toPages(story: Story): Story {
  const pages: Section[] = []
  for (const section of story.sections) {
    const last = pages[pages.length - 1]
    if (last && last.sentences.length < MIN_PAGE) last.sentences.push(...section.sentences)
    else pages.push({ ...section, sentences: [...section.sentences] })
  }
  const end = pages[pages.length - 1]
  if (pages.length > 1 && end.sentences.length < 3) {
    pages.pop()
    pages[pages.length - 1].sentences.push(...end.sentences)
  }
  return { ...story, sections: pages.map((page, index) => ({ ...page, id: `s${index + 1}` })) }
}

function writeOwnReadings(readings: Story[]): boolean {
  try {
    localStorage.setItem(OWN_KEY, JSON.stringify(readings))
    return true
  } catch {
    return false // storage full or unavailable
  }
}

/** Saves a prepared reading under a unique id (keeping the newest 10) and returns it. */
export function saveOwnReading(story: Story): Story {
  const saved = { ...story, id: `own-${crypto.randomUUID().slice(0, 8)}` }
  if (!writeOwnReadings([saved, ...getOwnReadings()].slice(0, MAX_OWN))) {
    throw new Error('There isn’t enough space to save this. Remove an older reading and try again.')
  }
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
