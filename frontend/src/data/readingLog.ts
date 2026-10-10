/** What the reader has actually done with one story. Stored only in this browser. */
export interface StoryLog {
  sectionIndex: number
  furthest: number
  finished: boolean
  lastOpened: string
  finishedAt?: string
}

export type ReadingLog = Record<string, StoryLog>

const LOG_KEY = 'readingbridge.log'
const BOOKMARKS_KEY = 'readingbridge.bookmarks'

function read<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable: nothing is remembered.
  }
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })

export const getLog = (): ReadingLog => read<ReadingLog>(LOG_KEY, {})
export const getBookmarks = (): string[] => read<string[]>(BOOKMARKS_KEY, [])

/** Records the section being read. Pasted text is never logged: it lasts one session only. */
export function logSection(storyId: string, sectionIndex: number, finished = false): void {
  if (storyId === 'pasted') return
  const log = getLog()
  const now = new Date().toISOString()
  const entry = log[storyId] ?? {
    sectionIndex: 0,
    furthest: 0,
    finished: false,
    lastOpened: now,
  }
  log[storyId] = {
    ...entry,
    sectionIndex,
    furthest: Math.max(entry.furthest, sectionIndex),
    lastOpened: now,
    ...(finished && { finished: true, finishedAt: now }),
  }
  write(LOG_KEY, log)
}

/** Adds or removes a bookmark and returns whether the story is now bookmarked. */
export function toggleBookmark(storyId: string): boolean {
  const bookmarks = getBookmarks()
  const saved = !bookmarks.includes(storyId)
  write(BOOKMARKS_KEY, saved ? [...bookmarks, storyId] : bookmarks.filter((id) => id !== storyId))
  return saved
}

/** SAMPLE DATA, shown only when a reader asks to see an example. Never mixed with real data. */
export const exampleLog: ReadingLog = {
  'new-student': {
    sectionIndex: 2,
    furthest: 2,
    finished: true,
    lastOpened: '2026-10-06T16:20:00.000Z',
    finishedAt: '2026-10-06T16:31:00.000Z',
  },
  'science-fair': {
    sectionIndex: 1,
    furthest: 1,
    finished: false,
    lastOpened: '2026-10-08T15:05:00.000Z',
  },
}
export const exampleBookmarks = ['two-friends']
