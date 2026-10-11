import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { stories } from '../data/stories'
import { renderAt } from './renderAt'

const evidence = 'Then she looked down at her shoes.'
const why = 'She looked down at her shoes instead of at the class.'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

/** Opens The New Student at section 2 and its quiz. */
async function openQuiz() {
  const user = userEvent.setup()
  renderAt('/read/new-student')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('button', { name: 'Quiz me on this' }))
  return { user, quiz: screen.getByRole('region', { name: 'Quiz' }) }
}

async function answer(user: ReturnType<typeof userEvent.setup>, option: string) {
  await user.click(screen.getByRole('radio', { name: option }))
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
}

describe('quiz data', () => {
  it('has a valid answer and evidence sentence in every section', () => {
    for (const story of stories) {
      for (const section of story.sections) {
        const quiz = section.quiz
        expect(quiz, `${story.id} ${section.id}`).toBeDefined()
        if (!quiz) continue
        expect(quiz.options).toHaveLength(3)
        expect([0, 1, 2]).toContain(quiz.answerIndex)
        expect(section.sentences.map((s) => s.id)).toContain(quiz.evidenceSentenceId)
      }
    }
  })
})

describe('quiz', () => {
  it('stays hidden until asked for, and Continue works without it', async () => {
    const user = userEvent.setup()
    renderAt('/read/new-student')
    expect(screen.queryByRole('region', { name: 'Quiz' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText("Maya's heart beat quickly.")).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Quiz' })).not.toBeInTheDocument()
  })

  it('asks for a choice before checking', async () => {
    const { user, quiz } = await openQuiz()
    expect(quiz).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(within(quiz).getByText('Choose an answer first.')).toBeInTheDocument()
    expect(within(quiz).queryByText('Yes.')).not.toBeInTheDocument()
  })

  it.each([
    ['Nervous', 'Yes.'],
    ['Angry', 'Not quite. Look at this sentence:'],
    ['I’m not sure', 'Here’s a clue:'],
  ])('answering "%s" shows "%s" with the evidence and why', async (option, lead) => {
    const { user, quiz } = await openQuiz()
    await answer(user, option)
    expect(within(quiz).getByText(lead)).toBeInTheDocument()
    expect(within(quiz).getByText(`“${evidence}”`)).toBeInTheDocument()
    expect(within(quiz).getByText(new RegExp(why))).toBeInTheDocument()

    const sentence = screen.getByRole('button', { name: 'Select sentence 7' })
    expect(within(sentence).getByText(evidence.replace(/\.$/, ''))).toHaveClass('underline')
  })

  it('writes nothing to storage when answering, and Close returns to the button', async () => {
    const { user } = await openQuiz()
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    await answer(user, 'Angry')
    await answer(user, 'Nervous')
    expect(setItem).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('region', { name: 'Quiz' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quiz me on this' })).toHaveFocus()
  })

  it('does not offer a quiz for the reader’s own readings', () => {
    localStorage.setItem(
      'readingbridge.own.v2',
      JSON.stringify([
        {
          id: 'own-test',
          title: 'Notes',
          description: '',
          category: 'Own reading',
          readMinutes: 1,
          sections: [{ id: 's1', sentences: [{ id: 0, text: 'She waved.' }] }],
        },
      ]),
    )
    renderAt('/read/own-test')
    expect(screen.queryByRole('button', { name: 'Quiz me on this' })).not.toBeInTheDocument()
  })
})
