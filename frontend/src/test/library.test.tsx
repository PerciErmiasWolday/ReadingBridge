import { cleanup, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

afterEach(() => vi.restoreAllMocks())

async function openAdd() {
  const user = userEvent.setup()
  renderAt('/library')
  await user.click(screen.getByRole('link', { name: 'Add your own reading' }))
  return user
}

async function paste(text: string) {
  const user = await openAdd()
  if (text) await user.type(screen.getByRole('textbox', { name: 'Your text' }), text)
  await user.click(screen.getByRole('button', { name: 'Start reading' }))
}

/** The step after preparing: name the reading, choose a cover, save. */
async function nameAndSave(name: string, cover = 'Leaves') {
  const user = userEvent.setup()
  await user.type(await screen.findByRole('textbox', { name: 'Name' }), name)
  await user.click(screen.getByRole('radio', { name: cover }))
  await user.click(screen.getByRole('button', { name: 'Save and start reading' }))
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

  it('shows a start card in the same place when there is nothing to continue', () => {
    renderAt('/library')
    expect(screen.queryByRole('heading', { name: /Continue reading/ })).not.toBeInTheDocument()
    expect(screen.queryByText('Your place is saved')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Begin with The New Student' })).toBeInTheDocument()
    expect(screen.getByText('Not started · 3 sections')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start reading' })).toBeInTheDocument()
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
  it('opens on its own page from the shelf, with the Library tab still marked', async () => {
    await openAdd()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Bring your own reading.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Your text' })).toHaveFocus()
    expect(screen.queryByRole('heading', { name: 'Stories to begin with' })).not.toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Library' })).toHaveClass('font-medium')
  })

  it('asks for text when empty and does not navigate', async () => {
    await paste('')
    expect(screen.getByRole('alert')).toHaveTextContent('Paste a story first.')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Bring your own reading.' }),
    ).toBeInTheDocument()
    expect(prepare).not.toHaveBeenCalled()
  })

  it('prepares pasted text, then asks for a name and cover before opening it', async () => {
    vi.mocked(prepare).mockResolvedValue({ ...prepared, title: 'Your reading' })
    await paste('She said hello.')
    expect(prepare).toHaveBeenCalledWith('Your reading', 'She said hello.')
    expect(
      await screen.findByRole('heading', { name: 'Name your reading and choose a cover' }),
    ).toBeInTheDocument()
    expect(localStorage.getItem('readingbridge.own.v2')).toBeNull()

    await nameAndSave('Morning notes', 'Night sky')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Morning notes' }),
    ).toBeInTheDocument()
    const [saved] = JSON.parse(localStorage.getItem('readingbridge.own.v2') ?? '[]')
    expect(saved).toMatchObject({ title: 'Morning notes', cover: 'night' })
  })

  it('requires a name and a cover, and saves nothing until both are given', async () => {
    const user = userEvent.setup()
    vi.mocked(prepare).mockResolvedValue(prepared)
    await paste('She said hello.')
    const save = await screen.findByRole('button', { name: 'Save and start reading' })

    await user.click(save)
    expect(screen.getByRole('alert')).toHaveTextContent('Give your reading a name.')
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'My notes')
    await user.click(save)
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a cover.')
    expect(localStorage.getItem('readingbridge.own.v2')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('textbox', { name: 'Your text' })).toHaveValue('She said hello.')
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
    expect(await screen.findByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'placeholder',
      'notes',
    )
    await nameAndSave('Notes from class')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Notes from class' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Explain this sentence' })).toBeInTheDocument()
  })

  it('shows an upload error and stays on the add page', async () => {
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
      screen.getByRole('heading', { level: 1, name: 'Bring your own reading.' }),
    ).toBeInTheDocument()
  })

  it('keeps prepared readings on the shelf, newest first, and removes them after a confirm', async () => {
    vi.mocked(prepare).mockResolvedValue(prepared)
    await paste('She said hello.')
    await nameAndSave('First notes')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'First notes' }),
    ).toBeInTheDocument()
    cleanup()

    await paste('She said goodbye.')
    await nameAndSave('Second notes', 'Hills')
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
    expect(JSON.parse(localStorage.getItem('readingbridge.own.v2') ?? '[]')).toHaveLength(1)
  })

  it('can use the student’s own picture as the cover, shrunk before it is saved', async () => {
    const user = userEvent.setup()
    // The test browser has no image decoding or canvas drawing, so stand them in.
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 1200, height: 1600 }))
    const drawImage = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,AAA')

    vi.mocked(prepare).mockResolvedValue(prepared)
    await paste('She said hello.')
    await user.type(await screen.findByRole('textbox', { name: 'Name' }), 'Holiday notes')
    await user.upload(
      screen.getByLabelText('Your picture: upload an image'),
      new File(['photo'], 'beach.png', { type: 'image/png' }),
    )
    expect(await screen.findByText('Your picture (change)')).toBeInTheDocument()
    expect(drawImage).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Save and start reading' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Holiday notes' }),
    ).toBeInTheDocument()
    const [saved] = JSON.parse(localStorage.getItem('readingbridge.own.v2') ?? '[]')
    expect(saved).toMatchObject({
      title: 'Holiday notes',
      coverImage: 'data:image/jpeg;base64,AAA',
    })
    vi.unstubAllGlobals()
  })

  it('says so when there is no room to save, instead of losing the reading', async () => {
    vi.mocked(prepare).mockResolvedValue(prepared)
    await paste('She said hello.')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    await nameAndSave('Too big')
    expect(screen.getByRole('alert')).toHaveTextContent('There isn’t enough space to save this.')
    expect(
      screen.getByRole('heading', { name: 'Name your reading and choose a cover' }),
    ).toBeInTheDocument()
  })
})
