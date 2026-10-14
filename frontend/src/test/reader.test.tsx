import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { newStudent } from '../data/newStudent'
import { explain } from '../services/explain'
import type { Explanation } from '../types'
import { renderAt } from './renderAt'

vi.mock('../services/explain', () => ({ explain: vi.fn() }))

const answer: Explanation = {
  type: 'feeling',
  clue_quote: 'Then she looked down at her shoes.',
  clue: 'She looked at her shoes instead of the class.',
  meaning: 'Maya probably feels nervous.',
  not_in_text: false,
  sentence_id: 8,
  checks: ['passed'],
}

beforeEach(() => {
  localStorage.clear()
  vi.mocked(explain).mockReset().mockResolvedValue(answer)
})

const lastRead = () => JSON.parse(localStorage.getItem('readingbridge.lastRead') ?? 'null')

async function openHeartMarker() {
  const user = userEvent.setup()
  renderAt('/read/new-student')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  const marker = screen.getAllByRole('button', { name: 'Explain this sentence' })[0]
  await user.click(marker)
  return { user, marker }
}

describe('reader', () => {
  it('moves through sections, saves progress and finishes at the library', async () => {
    const user = userEvent.setup()
    renderAt('/read/new-student')
    expect(screen.getByText(/Maya stepped off the bus/)).toBeInTheDocument()
    expect(lastRead()).toEqual({ storyId: 'new-student', sectionIndex: 0 })

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText("Maya's heart beat quickly.")).toBeInTheDocument()
    expect(lastRead()).toEqual({ storyId: 'new-student', sectionIndex: 1 })

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Finish' }))
    expect(
      screen.getByRole('heading', { level: 1, name: 'A new story is waiting for you.' }),
    ).toBeInTheDocument()
  })

  it('selects a sentence and offers "Help me with this"', async () => {
    const user = userEvent.setup()
    renderAt('/read/new-student')
    const sentence = screen.getByRole('button', { name: 'Select sentence 2' })
    await user.click(sentence)
    expect(sentence).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Help me with this' })).toBeInTheDocument()
  })

  it('opens the card directly under the sentence; the paragraph continues below it', async () => {
    await openHeartMarker()
    const card = await screen.findByRole('complementary', { name: 'Explanation' })
    expect(card).toHaveTextContent(answer.meaning)
    expect(card).toHaveTextContent(`Clue: “${answer.clue_quote}”`)
    expect(explain).toHaveBeenCalledWith(newStudent, 8, 'normal')

    const before = card.previousElementSibling as HTMLElement
    const sentence = screen.getByRole('button', { name: 'Select sentence 9' })
    expect(before.tagName).toBe('P')
    expect(before.lastElementChild).toContainElement(sentence)
    expect(sentence).toHaveAttribute('aria-pressed', 'true')
    expect(card.nextElementSibling).toHaveTextContent(/^She gave a small smile/)
  })

  it('asks for a simpler explanation', async () => {
    const { user } = await openHeartMarker()
    await user.click(await screen.findByRole('button', { name: 'Say it more simply' }))
    expect(explain).toHaveBeenLastCalledWith(newStudent, 8, 'simple')
  })

  it('says honestly when the story does not tell us', async () => {
    vi.mocked(explain).mockResolvedValue({ ...answer, not_in_text: true, clue_quote: '' })
    await openHeartMarker()
    expect(await screen.findByText("The story doesn't tell us this.")).toBeInTheDocument()
    expect(screen.queryByText(/Clue:/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Say it more simply' })).not.toBeInTheDocument()
  })

  it('closes with Escape and returns focus to the marker', async () => {
    const { user, marker } = await openHeartMarker()
    expect(await screen.findByRole('complementary', { name: 'Explanation' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('complementary', { name: 'Explanation' })).not.toBeInTheDocument()
    expect(marker).toHaveFocus()
  })

  it('opens help on click or Space only: hovering a marker just underlines its sentence', async () => {
    const user = userEvent.setup()
    renderAt('/read/new-student')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const marker = screen.getAllByRole('button', { name: 'Explain this sentence' })[0]

    await user.hover(marker)
    await new Promise((resolve) => setTimeout(resolve, 600))
    expect(screen.getByRole('button', { name: 'Select sentence 9' })).toHaveClass('underline')
    expect(screen.queryByRole('complementary', { name: 'Explanation' })).not.toBeInTheDocument()
    expect(explain).not.toHaveBeenCalled()

    marker.focus()
    await user.keyboard(' ')
    expect(await screen.findByText(answer.meaning)).toBeInTheDocument()
  })
})
