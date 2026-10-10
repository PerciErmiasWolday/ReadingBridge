import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SentenceText } from '../components/SentenceText'

const sentence = { id: 4, text: "Maya's heart beat quickly.", marker: { type: 'feeling' as const } }

describe('marker', () => {
  it('underlines the marked phrase on hover and focus, not by colour alone', async () => {
    const user = userEvent.setup()
    render(<SentenceText sentence={sentence} />)
    const phrase = screen.getByText(sentence.text)
    const marker = screen.getByRole('button', {
      name: /Explain this sentence: it hints at a feeling/,
    })

    expect(phrase).not.toHaveClass('underline')
    await user.hover(marker)
    expect(phrase).toHaveClass('underline')
    await user.unhover(marker)
    expect(phrase).not.toHaveClass('underline')

    await user.tab()
    expect(marker).toHaveFocus()
    expect(phrase).toHaveClass('underline')
  })

  it('reports activation with the sentence id', async () => {
    const onSelect = vi.fn()
    render(<SentenceText sentence={sentence} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(4)
  })

  it('renders no marker for an unmarked sentence', () => {
    render(<SentenceText sentence={{ id: 2, text: 'Plain sentence.' }} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
