import { ImagePlus, Info, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Arrow } from '../components/Arrow'
import { Button } from '../components/Button'
import { buttonClass } from '../components/buttonClass'
import { Cover } from '../components/Cover'
import { PageHeader } from '../components/PageHeader'
import { ownCoverChoices } from '../data/covers'
import { saveOwnReading } from '../data/stories'
import { prepare, uploadFile } from '../services/reading'
import type { Story } from '../types'

/** Its own page: paste or upload, then name the reading and choose a cover. */
export function AddReadingPage() {
  return (
    <>
      <PageHeader
        title="Add your own reading"
        eyebrow="Your own reading"
        display={
          <>
            Bring your own <span className="italic text-accent">reading</span>.
          </>
        }
      >
        Paste a passage, or upload a .txt or text-based .pdf file of up to 2 MB. ReadingBridge
        splits it into pages and marks the parts where meaning is unsaid.
      </PageHeader>
      <AddReading />
    </>
  )
}

function AddReading() {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [prepared, setPrepared] = useState<{ story: Story; suggested: string } | null>(null)
  const box = useRef<HTMLTextAreaElement>(null)
  useEffect(() => box.current?.focus(), [])

  // Paste and upload share one pipeline: (upload →) prepare → name and cover → save → open.
  async function start(file?: File) {
    if (!file && !text.trim()) return setError('Paste a story first.')
    setError('')
    try {
      let source = { title: 'Your reading', text }
      if (file) {
        setStatus('Reading your file…')
        source = await uploadFile(file)
      }
      setStatus('Finding the tricky parts…')
      setPrepared({ story: await prepare(source.title, source.text), suggested: source.title })
      setStatus('')
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
      setStatus('')
    }
  }

  if (prepared) {
    return (
      <NameReading
        story={prepared.story}
        suggested={prepared.suggested}
        onBack={() => setPrepared(null)}
      />
    )
  }

  return (
    <div id="add-reading" className="fade-in max-w-3xl rounded bg-paper p-5 shadow-panel md:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="own-text" className="label-caps text-ink-soft">
          Your text
        </label>
        <span className="text-[0.8125rem] text-ink-soft">
          {text.length.toLocaleString('en')} / 5,000
        </span>
      </div>
      <textarea
        ref={box}
        id="own-text"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'paste-error' : undefined}
        rows={7}
        value={text}
        placeholder="Paste a passage here…"
        onChange={(event) => setText(event.target.value)}
        className="ruled mt-3 block w-full resize-y border-0 bg-transparent p-0 font-reading text-reading text-ink placeholder:text-ink-soft"
      />
      {status && (
        <p role="status" className="mb-0 mt-3 text-[0.9375rem] text-ink-soft">
          {status}
        </p>
      )}
      {error && (
        <p
          id="paste-error"
          role="alert"
          className="mb-0 mt-3 flex items-center gap-2 text-[0.9375rem] text-ink-soft"
        >
          <Info size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
        <Button onClick={() => start()} disabled={Boolean(status)}>
          Start reading
          <Arrow />
        </Button>
        {/* The file input is the real control; its label looks like a button. */}
        <label className="relative">
          <input
            type="file"
            accept=".txt,.pdf"
            disabled={Boolean(status)}
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) start(file)
            }}
            className="peer sr-only"
          />
          <span
            className={`${buttonClass('secondary')} cursor-pointer peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent`}
          >
            <Upload size={17} strokeWidth={1.6} aria-hidden="true" />
            Upload file
          </span>
        </label>
        <span className="text-[0.875rem] text-ink-soft">.txt or .pdf, up to 2 MB</span>
      </div>
    </div>
  )
}

/** Before a reading is saved, the student names it and chooses a cover. Both are required. */
function NameReading({
  story,
  suggested,
  onBack,
}: {
  story: Story
  suggested: string
  onBack: () => void
}) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [cover, setCover] = useState<string | null>(null)
  const [picture, setPicture] = useState<string | null>(null)
  const [error, setError] = useState('')
  const field = useRef<HTMLInputElement>(null)
  useEffect(() => field.current?.focus(), [])
  const shownTitle = name.trim() || suggested

  async function choosePicture(file: File) {
    try {
      setPicture(await coverFromFile(file))
      setCover(PICTURE)
      setError('')
    } catch {
      setError('That picture couldn’t be opened. Try a JPG or PNG.')
    }
  }

  function save() {
    const title = name.trim()
    if (!title) return setError('Give your reading a name.')
    if (!cover) return setError('Choose a cover.')
    try {
      const own = cover === PICTURE && picture ? { coverImage: picture } : { cover }
      const saved = saveOwnReading({ ...story, title, ...own })
      navigate(`/read/${saved.id}`)
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    }
  }

  return (
    <div id="add-reading" className="fade-in max-w-4xl rounded bg-paper p-5 shadow-panel md:p-6">
      <h3 className="m-0 font-display text-[1.75rem] font-normal leading-tight text-midnight">
        Name your reading and choose a cover
      </h3>
      <p className="m-0 mt-1 text-[0.9375rem] text-ink-soft">
        It will be saved on your shelf in this browser.
      </p>

      <label htmlFor="own-name" className="label-caps mt-6 block text-ink-soft">
        Name
      </label>
      <input
        ref={field}
        id="own-name"
        value={name}
        maxLength={60}
        placeholder={suggested}
        onChange={(event) => setName(event.target.value)}
        className="mt-2 block w-full max-w-md rounded border border-line-strong bg-ivory px-3 py-2 text-ink placeholder:text-ink-soft"
      />

      <fieldset className="m-0 mt-6 border-0 p-0">
        <legend className="label-caps mb-3 text-ink-soft">Cover</legend>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {ownCoverChoices.map((choice) => (
            <label
              key={choice.id}
              aria-label={choice.name}
              className="relative block cursor-pointer"
            >
              <input
                type="radio"
                name="own-cover"
                aria-label={choice.name}
                checked={cover === choice.id}
                onChange={() => setCover(choice.id)}
                className="peer sr-only"
              />
              <span className="block rounded border border-transparent p-1.5 peer-checked:border-accent peer-checked:bg-accent-tint peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                <span className="block shadow-book">
                  <Cover story={{ ...story, title: shownTitle, cover: choice.id }} />
                </span>
                <span className="mt-2 block text-center text-[0.8125rem] text-ink">
                  {choice.name}
                </span>
              </span>
            </label>
          ))}
          {/* The student's own picture: shrunk to cover size in the browser, never sent anywhere. */}
          <label className="relative block cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Your picture: upload an image"
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file) choosePicture(file)
              }}
              className="peer sr-only"
            />
            <span
              className={`block rounded border p-1.5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${cover === PICTURE ? 'border-accent bg-accent-tint' : 'border-transparent'}`}
            >
              {picture ? (
                <span className="block shadow-book">
                  <Cover story={{ ...story, title: shownTitle, coverImage: picture }} />
                </span>
              ) : (
                <span className="flex aspect-[2/3] flex-col items-center justify-center gap-2 border border-dashed border-line-strong text-midnight">
                  <ImagePlus size={22} strokeWidth={1.5} aria-hidden="true" />
                  <span className="px-2 text-center text-[0.75rem] text-ink-soft">JPG or PNG</span>
                </span>
              )}
              <span className="mt-2 block text-center text-[0.8125rem] text-ink">
                {picture ? 'Your picture (change)' : 'Your picture'}
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="mb-0 mt-4 flex items-center gap-2 text-[0.9375rem] text-ink-soft"
        >
          <Info size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
        <Button onClick={save}>
          Save and start reading
          <Arrow />
        </Button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-sm text-[0.9375rem] font-medium text-accent underline-offset-4 hover:underline"
        >
          Back
        </button>
      </div>
    </div>
  )
}

const PICTURE = 'picture'

/**
 * Shrinks a picture to cover size (450 × 675, cropped to fill) as a JPEG of roughly 50–90 KB,
 * so a few of them fit comfortably in the browser's small storage.
 */
async function coverFromFile(file: File): Promise<string> {
  const image = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = 450
  canvas.height = 675
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  const scale = Math.max(canvas.width / image.width, canvas.height / image.height)
  const width = image.width * scale
  const height = image.height * scale
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
  return canvas.toDataURL('image/jpeg', 0.8)
}
