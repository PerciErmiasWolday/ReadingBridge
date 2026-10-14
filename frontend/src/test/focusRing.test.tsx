import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'
import { renderAt } from './renderAt'
import indexCss from '../styles/index.css?raw'
import tokensCss from '../styles/tokens.css?raw'

/*
 * The focus ring is one global rule in styles/index.css. We load that exact
 * rule into jsdom so getComputedStyle reflects what ships.
 *
 * jsdom only emulates the :focus-visible heuristic, and its result drifts
 * across several Tab presses, so the injected copy uses :focus instead. The selector is asserted
 * separately; this test checks keyboard reachability and the computed ring.
 * var(--accent) is resolved from tokens.css because jsdom ignores custom props.
 */
const accent = /--accent:\s*(#[0-9a-f]{6});/i.exec(tokensCss)?.[1] ?? ''
const focusRule = /:focus-visible\s*\{[^}]*\}/.exec(indexCss)?.[0] ?? ''

beforeAll(() => {
  const style = document.createElement('style')
  style.textContent = focusRule.replace(':focus-visible', ':focus').replace('var(--accent)', accent)
  document.head.appendChild(style)
})

function expectFocusRing(element: Element) {
  // jsdom caches computed styles and does not invalidate them on focus change.
  document.body.dataset.styleBust = String(Math.random())
  const style = getComputedStyle(element)
  expect(style.outline.toLowerCase()).toBe(`2px solid ${accent.toLowerCase()}`)
  expect(style.outlineOffset).toBe('2px')
}

describe('focus ring', () => {
  it('is defined globally on :focus-visible as a 2px accent outline with a 2px offset', () => {
    expect(focusRule.startsWith(':focus-visible')).toBe(true)
    expect(focusRule).toContain('outline: 2px solid var(--accent)')
    expect(focusRule).toContain('outline-offset: 2px')
    expect(accent).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('is visible when a navigation link receives keyboard focus', async () => {
    const user = userEvent.setup()
    renderAt('/library')

    await user.tab()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus()
    await user.tab() // wordmark
    await user.tab()

    const library = screen.getByRole('link', { name: 'Library' })
    expect(library).toHaveFocus()
    expectFocusRing(library)
  })

  it('is visible when a button and a marker receive keyboard focus', async () => {
    const user = userEvent.setup()
    renderAt('/styleguide')
    const button = await screen.findByRole('button', { name: 'Tab to me' }, { timeout: 5000 })
    const marker = screen.getAllByRole('button', { name: /Explain this sentence/ })[0]

    for (const target of [button, marker]) {
      while (document.activeElement !== target) await user.tab()
      expectFocusRing(target)
    }
  })

  it('is never suppressed by component styles', () => {
    const sources = import.meta.glob('../**/*.tsx', {
      query: '?raw',
      import: 'default',
      eager: true,
    })
    for (const [file, source] of Object.entries(sources)) {
      if (file.includes('/test/')) continue
      expect(source as string, file).not.toMatch(/outline-none|outline-0|outline:\s*none/)
    }
  })
})
