import type { Story } from '../types'
import { newStudent } from './newStudent'
import { scienceFair } from './scienceFair'
import { twoFriends } from './twoFriends'

export const stories: Story[] = [newStudent, scienceFair, twoFriends]

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

export function savePastedStory(sentences: string[]): void {
  const story: Story = {
    id: 'pasted',
    title: 'Your reading',
    description: '',
    category: 'Own reading',
    readMinutes: Math.max(1, Math.round(sentences.join(' ').split(/\s+/).length / 200)),
    sections: [{ id: 's1', sentences: sentences.map((text, id) => ({ id, text })) }],
  }
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

export function saveLastRead(lastRead: LastRead): void {
  try {
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead))
  } catch {
    // Storage unavailable: Continue reading stays hidden.
  }
}
