import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderAt } from './renderAt'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('style')
  delete document.documentElement.dataset.motion
})

describe('My Reading', () => {
  it('shows an empty shelf, and a labelled example on request', async () => {
    const user = userEvent.setup()
    renderAt('/my-reading')
    expect(screen.getByRole('heading', { name: /Your shelf is empty/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'See an example' }))
    expect(screen.getByRole('status')).toHaveTextContent('sample data, not your reading')
    expect(screen.getByRole('heading', { name: /In progress/ })).toBeInTheDocument()
  })

  it('lists a story saved with the bookmark on the Library shelf', async () => {
    const user = userEvent.setup()
    renderAt('/library')
    const bookmark = screen.getByRole('button', { name: 'Save The Science Fair for later' })
    await user.click(bookmark)
    expect(bookmark).toHaveAttribute('aria-pressed', 'true')

    await user.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'My Reading',
      }),
    )
    const saved = screen
      .getByRole('heading', { name: /Saved for later/ })
      .closest('section') as HTMLElement
    expect(within(saved).getByRole('link', { name: /The Science Fair/ })).toBeInTheDocument()
  })
})

describe('Progress', () => {
  it('records real reading: sections reached and stories finished', async () => {
    const user = userEvent.setup()
    renderAt('/read/two-friends')
    for (const name of ['Continue', 'Continue', 'Finish']) {
      await user.click(screen.getByRole('button', { name }))
    }
    await user.click(
      within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
        name: 'Progress',
      }),
    )
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
    expect(screen.getByText('Finished Two Friends at the Park')).toBeInTheDocument()
    expect(within(screen.getByRole('main')).queryByText(/help/i)).not.toBeInTheDocument()
  })
})

describe('Settings', () => {
  it('changes the live preview and the reading variables', async () => {
    const user = userEvent.setup()
    renderAt('/settings')
    const preview = screen.getByTestId('reading-preview')
    expect(preview).toHaveAttribute('data-theme', 'ivory')

    await user.click(screen.getByRole('radio', { name: 'Night' }))
    expect(preview).toHaveAttribute('data-theme', 'night')
    await user.click(screen.getByRole('radio', { name: /Hyperlegible/ }))
    expect(document.documentElement.style.getPropertyValue('--reading-font-family')).toBe(
      'var(--font-readable)',
    )
    expect(document.documentElement.dataset.motion).toBeUndefined()
    await user.click(screen.getByRole('radio', { name: /^On/ }))
    expect(document.documentElement.dataset.motion).toBe('on')

    await user.click(screen.getByRole('checkbox', { name: /Show markers/ }))
    expect(
      within(preview).queryByRole('button', { name: 'Explain this sentence' }),
    ).not.toBeInTheDocument()
  })
})
