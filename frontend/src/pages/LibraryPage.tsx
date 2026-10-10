import { Info } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { MetaStrip } from '../components/MetaStrip'
import { PageHeader } from '../components/PageHeader'
import { getLastRead, getStory, savePastedStory, stories } from '../data/stories'
import { split } from '../services/split'

const MAX_LENGTH = 3000

export function LibraryPage() {
  const lastRead = getLastRead()
  const lastStory = lastRead ? getStory(lastRead.storyId) : undefined

  return (
    <>
      <PageHeader title="Library" />
      {lastRead && lastStory && (
        <LibrarySection title="Continue reading">
          <ContinueReading
            title={lastStory.title}
            category={lastStory.category}
            section={lastRead.sectionIndex + 1}
            sections={lastStory.sections.length}
            to={`/read/${lastStory.id}`}
          />
        </LibrarySection>
      )}
      <LibrarySection title="Your own reading">
        <PasteText />
      </LibrarySection>
      <LibrarySection title="Stories">
        <ul className="m-0 list-none border-t border-rule p-0">
          {stories.map((story) => (
            <li key={story.id} className="border-b border-rule">
              <Link
                to={`/read/${story.id}`}
                aria-labelledby={`${story.id}-title`}
                aria-describedby={`${story.id}-description`}
                className="-mx-4 block px-4 py-6 text-ink no-underline hover:bg-surface"
              >
                <h3 id={`${story.id}-title`} className="font-display text-[1.75rem] font-normal">
                  {story.title}
                </h3>
                <p id={`${story.id}-description`} className="mb-4 mt-1 text-ink-soft">
                  {story.description}
                </p>
                <MetaStrip
                  items={[
                    { label: 'Story', value: story.category },
                    { label: 'Sections', value: String(story.sections.length) },
                    { label: 'Read', value: `${story.readMinutes} min` },
                  ]}
                />
              </Link>
            </li>
          ))}
        </ul>
      </LibrarySection>
    </>
  )
}

function LibrarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12 max-w-[48rem]">
      <h2 className="label-caps mb-4 text-ink-soft">{title}</h2>
      {children}
    </section>
  )
}

interface ContinueReadingProps {
  title: string
  category: string
  section: number
  sections: number
  to: string
}

function ContinueReading({ title, category, section, sections, to }: ContinueReadingProps) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-rule py-5">
      <p className="m-0 font-display text-[1.5rem] text-ink">{title}</p>
      <MetaStrip
        items={[
          { label: 'Story', value: category },
          { label: 'Section', value: `${section} of ${sections}` },
        ]}
      />
      <Button variant="secondary" onClick={() => navigate(to)}>
        Resume
      </Button>
    </div>
  )
}

function PasteText() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function start() {
    const story = text.trim()
    if (!story) return setError('Paste a story first.')
    if (story.length > MAX_LENGTH) {
      return setError(
        'This is longer than ReadingBridge can handle right now. Try a shorter passage.',
      )
    }
    setBusy(true)
    try {
      savePastedStory(await split(story))
      navigate('/read/pasted')
    } catch {
      setError("The reading service isn't running.")
      setBusy(false)
    }
  }

  function cancel() {
    setOpen(false)
    setText('')
    setError('')
  }

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Paste text
        </Button>
        <Button variant="secondary" disabled aria-describedby="upload-note">
          Upload file
        </Button>
        <p id="upload-note" className="m-0 text-[0.9375rem] text-ink-soft">
          File upload is not available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-measure">
      <textarea
        aria-label="Your text"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'paste-error' : undefined}
        rows={10}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="block w-full rounded-sm border border-rule bg-paper p-4 font-reading text-reading text-ink hover:border-rule-strong"
      />
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
      <div className="mt-5 flex items-center gap-6">
        <Button onClick={start} disabled={busy}>
          Start reading
        </Button>
        <button
          type="button"
          onClick={cancel}
          className="rounded-sm text-[0.9375rem] text-sage decoration-1 underline-offset-4 hover:underline focus-visible:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
