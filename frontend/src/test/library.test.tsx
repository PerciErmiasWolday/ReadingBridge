import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { split } from '../services/split'
import { renderAt } from './renderAt'

vi.mock('../services/split', () => ({ split: vi.fn() }))

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.mocked(split).mockReset()
})

async function paste(text: string) {
  const user = userEvent.setup()
  renderAt('/library')
  await user.click(screen.getByRole('button', { name: 'Paste text' }))
  if (text) await user.type(screen.getByRole('textbox', { name: 'Your text' }), text)
  await user.click(screen.getByRole('button', { name: 'Start reading' }))
}

describe('library', () => {
  it('lists all three stories, each linking to its reader', () => {
    renderAt('/library')
    for (const [title, id] of [
      ['The New Student', 'new-student'],
      ['The Science Fair', 'science-fair'],
      ['Two Friends at the Park', 'two-friends'],
    ]) {
      expect(screen.getByRole('link', { name: title })).toHaveAttribute('href', `/read/${id}`)
    }
  })

  it('hides Continue reading when nothing is stored', () => {
    renderAt('/library')
    expect(screen.queryByRole('heading', { name: 'Continue reading' })).not.toBeInTheDocument()
  })

  it('shows Continue reading when a story was opened before', () => {
    localStorage.setItem(
      'readingbridge.lastRead',
      JSON.stringify({ storyId: 'science-fair', sectionIndex: 1 }),
    )
    renderAt('/library')
    expect(screen.getByRole('heading', { name: 'Continue reading' })).toBeInTheDocument()
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })
})

describe('paste text', () => {
  it('asks for text when empty and does not navigate', async () => {
    await paste('')
    expect(screen.getByRole('alert')).toHaveTextContent('Paste a story first.')
    expect(screen.getByRole('heading', { level: 1, name: 'Library' })).toBeInTheDocument()
    expect(split).not.toHaveBeenCalled()
  })

  it('splits valid text and opens it in the reader', async () => {
    vi.mocked(split).mockResolvedValue(['One sentence.', 'Two sentences.'])
    await paste('One sentence. Two sentences.')
    expect(split).toHaveBeenCalledWith('One sentence. Two sentences.')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Your reading' }),
    ).toBeInTheDocument()
  })

  it('rejects text over the length limit', async () => {
    const user = userEvent.setup()
    renderAt('/library')
    await user.click(screen.getByRole('button', { name: 'Paste text' }))
    await user.click(screen.getByRole('textbox', { name: 'Your text' }))
    await user.paste('a'.repeat(3001))
    await user.click(screen.getByRole('button', { name: 'Start reading' }))
    expect(screen.getByRole('alert')).toHaveTextContent('longer than ReadingBridge can handle')
    expect(split).not.toHaveBeenCalled()
  })
})
