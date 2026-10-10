import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SentenceText } from '../components/SentenceText'

const sentence = { id: 4, text: "Maya's heart beat quickly.", marker: { type: 'feeling' as const } }

describe('marker', () => {
  it('underlines the marked phrase on hover and focus, not by colour alone', async () => {
    const user = userEvent.setup()
    render(<SentenceText sentence={sentence} />)
    const phrase = screen.getByRole('button', { name: 'Select sentence 5' })
    const marker = screen.getByRole('button', { name: 'Explain this sentence' })

    expect(phrase).not.toHaveClass('underline')
    await user.hover(marker)
    expect(phrase).toHaveClass('underline')
    await user.unhover(marker)
    expect(phrase).not.toHaveClass('underline')

    await user.tab() // the sentence
    await user.tab() // its marker
    expect(marker).toHaveFocus()
    expect(phrase).toHaveClass('underline')
  })

  it('asks for an explanation with the sentence id and the marker as trigger', async () => {
    const onExplain = vi.fn()
    render(<SentenceText sentence={sentence} onExplain={onExplain} />)
    const marker = screen.getByRole('button', { name: 'Explain this sentence' })
    await userEvent.click(marker)
    expect(onExplain).toHaveBeenCalledWith(4, marker, false)
  })

  it('renders no marker for an unmarked sentence', () => {
    render(<SentenceText sentence={{ id: 2, text: 'Plain sentence.' }} />)
    expect(screen.queryByRole('button', { name: 'Explain this sentence' })).not.toBeInTheDocument()
  })

  it('selects with Enter when focused', async () => {
    const onSelect = vi.fn()
    render(<SentenceText sentence={sentence} onSelect={onSelect} />)
    screen.getByRole('button', { name: 'Select sentence 5' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith(4)
  })
})
