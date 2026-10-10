import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from './renderAt'

describe('navigation', () => {
  it('renders the four main navigation items', () => {
    renderAt('/library')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)
    expect(labels).toEqual(['Library', 'My Reading', 'Progress', 'Settings'])
  })

  it('redirects / to the library', () => {
    renderAt('/')
    expect(
      screen.getByRole('heading', { level: 1, name: 'A new story is waiting for you.' }),
    ).toBeInTheDocument()
  })

  it.each([
    ['/library', 'A new story is waiting for you.'],
    ['/my-reading', 'Your shelf'],
    ['/progress', 'Your reading journey'],
    ['/settings', 'Make reading yours.'],
  ])('routes %s to the %s page', (path, title) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })

  it('navigates between pages and marks the current item', async () => {
    const user = userEvent.setup()
    renderAt('/library')
    const nav = screen.getByRole('navigation', { name: 'Main' })

    await user.click(within(nav).getByRole('link', { name: 'Progress' }))

    expect(
      screen.getByRole('heading', { level: 1, name: 'Your reading journey' }),
    ).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Progress' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Library' })).not.toHaveAttribute('aria-current')
  })

  it('serves the styleguide in development', async () => {
    renderAt('/styleguide')
    expect(await screen.findByRole('heading', { level: 1, name: 'Styleguide' })).toBeInTheDocument()
  })

  it('shows a not-found page for unknown routes', () => {
    renderAt('/nowhere')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})

describe('reader', () => {
  it('hides the main navigation on /read/:storyId for distraction-free reading', () => {
    renderAt('/read/new-student')
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library')
    expect(screen.getByRole('heading', { level: 1, name: 'The New Student' })).toBeInTheDocument()
  })

  it('handles a story id that does not exist', () => {
    renderAt('/read/missing')
    expect(screen.getByRole('heading', { level: 1, name: 'Story not found' })).toBeInTheDocument()
  })
})
