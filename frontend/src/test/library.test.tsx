import { cleanup, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prepare, uploadFile } from '../services/reading'
import type { Story } from '../types'
import { renderAt } from './renderAt'

vi.mock('../services/reading', () => ({ prepare: vi.fn(), uploadFile: vi.fn() }))

const prepared: Story = {
  id: 'pasted',
  title: 'notes',
  description: '',
  category: 'Own reading',
  readMinutes: 1,
  sections: [
    { id: 's1', sentences: [{ id: 0, text: 'She said hello.', marker: { type: 'feeling' } }] },
  ],
}

/** A promise the test resolves by hand, to see the status text in between. */
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => (resolve = done))
  return { promise, resolve }
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.mocked(prepare).mockReset()
  vi.mocked(uploadFile).mockReset()
})

async function openAdd() {
  const user = userEvent.setup()
  renderAt('/library')
  await user.click(screen.getByRole('button', { name: 'Add your own reading' }))
  return user
}

async function paste(text: string) {
  const user = await openAdd()
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
      const shelf = document.getElementById('shelf') as HTMLElement
      expect(within(shelf).getByRole('link', { name: title })).toHaveAttribute(
        'href',
        `/read/${id}`,
      )
    }
  })

  it('hides Continue reading when nothing is stored', () => {
    renderAt('/library')
    expect(screen.queryByRole('heading', { name: /Continue reading/ })).not.toBeInTheDocument()
  })

  it('shows Continue reading when a story was opened before', () => {
    localStorage.setItem(
      'readingbridge.lastRead',
      JSON.stringify({ storyId: 'science-fair', sectionIndex: 1 }),
    )
    renderAt('/library')
    expect(screen.getByRole('heading', { name: /Continue reading/ })).toBeInTheDocument()
    expect(screen.getByText('Section 2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })
})

describe('bring your own reading', () => {
  it('asks for text when empty and does not navigate', async () => {
    await paste('')
    expect(screen.getByRole('alert')).toHaveTextContent('Paste a story first.')
    expect(
      screen.getByRole('heading', { level: 1, name: 'A new story is waiting for you.' }),
    ).toBeInTheDocument()
    expect(prepare).not.toHaveBeenCalled()
  })

  it('prepares pasted text and opens it in the reader', async () => {
    vi.mocked(prepare).mockResolvedValue({ ...prepared, title: 'Your reading' })
    await paste('She said hello.')
    expect(prepare).toHaveBeenCalledWith('Your reading', 'She said hello.')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Your reading' }),
    ).toBeInTheDocument()
  })

  it('shows the backend message as it is, e.g. for text that is too long', async () => {
    vi.mocked(prepare).mockRejectedValue(
      new Error('This is longer than ReadingBridge can handle right now. Try a shorter passage.'),
    )
    await paste('A very long passage.')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'longer than ReadingBridge can handle',
    )
  })

  it('uploads a .txt file, shows each step, then opens the reader', async () => {
    const upload = deferred<{ title: string; text: string }>()
    const ready = deferred<Story>()
    vi.mocked(uploadFile).mockReturnValue(upload.promise)
    vi.mocked(prepare).mockReturnValue(ready.promise)
    const user = await openAdd()

    const file = new File(['She said hello.'], 'notes.txt', { type: 'text/plain' })
    await user.upload(screen.getByLabelText('Upload file'), file)
    expect(uploadFile).toHaveBeenCalledWith(file)
    expect(screen.getByRole('status')).toHaveTextContent('Reading your file…')

    upload.resolve({ title: 'notes', text: 'She said hello.' })
    expect(await screen.findByText('Finding the tricky parts…')).toBeInTheDocument()
    expect(prepare).toHaveBeenCalledWith('notes', 'She said hello.')

    ready.resolve(prepared)
    expect(await screen.findByRole('heading', { level: 1, name: 'notes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Explain this sentence' })).toBeInTheDocument()
  })

  it('shows an upload error and stays on the Library', async () => {
    vi.mocked(uploadFile).mockRejectedValue(
      new Error(
        'This looks like a scanned page. ReadingBridge can only read PDFs that contain text.',
      ),
    )
    const user = await openAdd()
    await user.upload(
      screen.getByLabelText('Upload file'),
      new File(['%PDF'], 'scan.pdf', { type: 'application/pdf' }),
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('This looks like a scanned page.')
    expect(prepare).not.toHaveBeenCalled()
    expect(
      screen.getByRole('heading', { level: 1, name: 'A new story is waiting for you.' }),
    ).toBeInTheDocument()
  })

  it('keeps prepared readings on the shelf, newest first, and removes them after a confirm', async () => {
    vi.mocked(prepare).mockResolvedValue({ ...prepared, title: 'First notes' })
    await paste('She said hello.')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'First notes' }),
    ).toBeInTheDocument()
    cleanup()

    vi.mocked(prepare).mockResolvedValue({ ...prepared, title: 'Second notes' })
    await paste('She said goodbye.')
    await screen.findByRole('heading', { level: 1, name: 'Second notes' })
    cleanup()

    const user = userEvent.setup()
    renderAt('/library')
    const shelf = document.getElementById('shelf') as HTMLElement
    const titles = within(shelf)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent)
    expect(titles.slice(0, 2)).toEqual(['Second notes', 'First notes'])
    expect(within(shelf).queryByRole('button', { name: 'Remove The New Student' })).toBeNull()

    await user.click(within(shelf).getByRole('button', { name: 'Remove First notes' }))
    expect(within(shelf).getByText('Remove this reading?')).toBeInTheDocument()
    await user.click(within(shelf).getByRole('button', { name: 'Cancel' }))
    expect(within(shelf).getByRole('heading', { name: 'First notes' })).toBeInTheDocument()

    await user.click(within(shelf).getByRole('button', { name: 'Remove First notes' }))
    await user.click(within(shelf).getByRole('button', { name: 'Yes' }))
    expect(within(shelf).queryByRole('heading', { name: 'First notes' })).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('readingbridge.own') ?? '[]')).toHaveLength(1)
  })
})
