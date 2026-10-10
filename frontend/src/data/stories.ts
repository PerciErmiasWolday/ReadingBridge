import type { Story } from '../types'
import { newStudent } from './newStudent'

export const stories: Story[] = [newStudent]

export function getStory(id: string | undefined): Story | undefined {
  return stories.find((story) => story.id === id)
}
