import { Info, Plus, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Arrow } from '../components/Arrow'
import { BookmarkButton } from '../components/BookmarkButton'
import { Button } from '../components/Button'
import { buttonClass } from '../components/buttonClass'
import { Cover } from '../components/Cover'
import { HeroArt } from '../components/HeroArt'
import { ProgressBar } from '../components/ProgressBar'
import { Reveal } from '../components/Reveal'
import {
  getLastRead,
  getOwnReadings,
  getStory,
  removeOwnReading,
  saveOwnReading,
  skills,
  stories,
  storySkills,
} from '../data/stories'
import { prepare, uploadFile } from '../services/reading'
import type { Story } from '../types'

export function LibraryPage() {
  const lastRead = getLastRead()
  const lastStory = lastRead ? getStory(lastRead.storyId) : undefined

  return (
    <>
      <title>Library — ReadingBridge</title>
      <Hero />
      {lastRead && lastStory && (
        <ContinueReading story={lastStory} sectionIndex={lastRead.sectionIndex} />
      )}
      <Shelf />
      <Themes />
    </>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="label-caps m-0 mb-4 flex items-center gap-3 text-accent">
      <span aria-hidden="true" className="h-px w-8 bg-accent" />
      {children}
    </p>
  )
}

function Hero() {
  return (
    <section className="grid items-center gap-8 pb-8 md:grid-cols-[minmax(0,1fr)_11rem] md:gap-12 lg:grid-cols-[minmax(0,1fr)_12.5rem]">
      <div>
        <p className="label-caps rise m-0 mb-4 text-accent">Stories with quiet help</p>
        <h1
          className="rise m-0 font-display text-[3rem] font-normal leading-[1] text-midnight sm:text-[3.75rem] lg:text-[4.5rem]"
          style={{ animationDelay: 'calc(var(--motion-duration) * 1)' }}
        >
          A new story is <span className="italic text-accent">waiting</span> for you.
        </h1>
        <p
          className="rise mb-0 mt-5 max-w-[44rem] text-[1.125rem] leading-relaxed text-ink-soft"
          style={{ animationDelay: 'calc(var(--motion-duration) * 2)' }}
        >
          Read at your own pace. When a story leaves something unsaid — a feeling, a figure of
          speech, who “she” is — ask, and it shows you the clue in the text.
        </p>
      </div>
      <div className="relative mx-auto w-40 md:w-full">
        <div aria-hidden="true" className="absolute -right-4 top-8 h-[78%] w-[82%] bg-ivory-deep" />
        <HeroArt className="relative" />
      </div>
    </section>
  )
}

function ContinueReading({ story, sectionIndex }: { story: Story; sectionIndex: number }) {
  const navigate = useNavigate()
  const count = story.sections.length
  const index = Math.min(sectionIndex, count - 1)
  return (
    <Reveal className="mb-10">
      <section className="grid items-center gap-x-8 gap-y-4 bg-ivory-deep px-6 py-5 sm:grid-cols-[4rem_1fr] md:px-8 lg:grid-cols-[4rem_1fr_auto]">
        <div className="w-16 -rotate-2 shadow-book">
          <Cover story={story} />
        </div>
        <div>
          <p className="label-caps m-0 mb-1 text-accent">Your place is saved</p>
          <h2 className="m-0 font-display text-[1.75rem] font-normal leading-tight text-midnight md:text-[2rem]">
            Continue reading <span className="italic">{story.title}</span>
          </h2>
          <blockquote className="m-0 mt-1 max-w-2xl border-l-[2px] border-accent pl-4 font-story text-[1.0625rem] italic text-ink">
            {story.sections[index].sentences[0]?.text}
          </blockquote>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-start-2 lg:col-start-3">
          <div className="flex items-center gap-3">
            <ProgressBar value={(index + 1) / count} className="w-24" />
            <span className="text-[0.9375rem] text-ink-soft">
              Section {index + 1} of {count}
            </span>
          </div>
          <Button onClick={() => navigate(`/read/${story.id}`)}>
            Resume
            <Arrow />
          </Button>
        </div>
      </section>
    </Reveal>
  )
}

// Staggered heights make the shelf feel arranged by hand rather than gridded.
const shelfOffsets = ['md:mt-0', 'md:mt-16', 'md:mt-6']

const textButton =
  'rounded-sm text-[0.9375rem] font-medium text-accent underline-offset-4 hover:underline'

function Shelf() {
  const [own, setOwn] = useState(getOwnReadings)
  const [adding, setAdding] = useState(false)
  const [confirming, setConfirming] = useState<string | null>(null)
  const addButton = useRef<HTMLButtonElement>(null)
  // The add item comes first, then the reader's own readings (newest first), then the library.
  const offset = (index: number) => shelfOffsets[index % shelfOffsets.length]

  function remove(id: string) {
    removeOwnReading(id)
    setOwn(getOwnReadings())
    setConfirming(null)
    addButton.current?.focus()
  }

  return (
    <section id="shelf" className="scroll-mt-8 pb-24">
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>The shelf</Eyebrow>
          <h2 className="m-0 font-display text-[2.75rem] font-normal leading-none text-midnight md:text-[3.5rem]">
            Stories to begin with
          </h2>
        </div>
        <p className="m-0 max-w-sm text-ink-soft">
          Short, complete stories. Each one has a few quiet markers where the meaning is unsaid.
        </p>
      </Reveal>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-12 p-0 md:grid-cols-3 md:gap-x-10">
        <li className={offset(0)}>
          <button
            ref={addButton}
            type="button"
            aria-expanded={adding}
            aria-controls="add-reading"
            onClick={() => setAdding(!adding)}
            className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 border border-line-strong px-4 text-center text-midnight transition hover:border-midnight"
          >
            <Plus size={24} strokeWidth={1.5} aria-hidden="true" />
            <span className="font-display text-[1.5rem] leading-tight">Add your own reading</span>
          </button>
          <p className="m-0 mt-5 text-ink-soft">Paste text, or upload a .txt or .pdf file.</p>
        </li>
        {own.map((story, index) => (
          <li key={story.id} className={offset(index + 1)}>
            <Link
              to={`/read/${story.id}`}
              aria-labelledby={`${story.id}-title`}
              className="group block rounded"
            >
              <div className="shadow-book transition duration-500 group-hover:-translate-y-2 group-hover:-rotate-1">
                <Cover story={story} />
              </div>
            </Link>
            <h3
              id={`${story.id}-title`}
              className="m-0 mt-5 font-display text-[1.75rem] font-normal leading-tight text-midnight"
            >
              {story.title}
            </h3>
            <p className="label-caps m-0 mt-2 text-ink-soft">Your reading</p>
            {confirming === story.id ? (
              <p className="m-0 mt-3 flex flex-wrap items-center gap-x-3 text-[0.9375rem] text-ink">
                Remove this reading?
                <button type="button" onClick={() => remove(story.id)} className={textButton}>
                  Yes
                </button>
                <button type="button" onClick={() => setConfirming(null)} className={textButton}>
                  Cancel
                </button>
              </p>
            ) : (
              <button
                type="button"
                aria-label={`Remove ${story.title}`}
                onClick={() => setConfirming(story.id)}
                className={`${textButton} mt-3`}
              >
                Remove
              </button>
            )}
          </li>
        ))}
        {stories.map((story, index) => (
          <li key={story.id} className={offset(own.length + index + 1)}>
            <Reveal delay={index}>
              <Link
                to={`/read/${story.id}`}
                aria-labelledby={`${story.id}-title`}
                aria-describedby={`${story.id}-description`}
                className="group block rounded"
              >
                <div className="shadow-book transition duration-500 group-hover:-translate-y-2 group-hover:-rotate-1">
                  <Cover story={story} />
                </div>
              </Link>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h3
                    id={`${story.id}-title`}
                    className="m-0 font-display text-[1.75rem] font-normal leading-tight text-midnight"
                  >
                    {story.title}
                  </h3>
                  <p id={`${story.id}-description`} className="m-0 mt-1 text-ink-soft">
                    {story.description}
                  </p>
                </div>
                <BookmarkButton storyId={story.id} title={story.title} />
              </div>
              <p className="label-caps m-0 mt-3 text-ink-soft">
                {[story.category, ...storySkills(story).map((type) => skills[type].label)].join(
                  ' · ',
                )}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
      {adding && <AddReading />}
    </section>
  )
}

function Themes() {
  const categories = [...new Set(stories.map((story) => story.category))]
  const practised = (Object.keys(skills) as (keyof typeof skills)[]).filter((type) =>
    stories.some((story) => storySkills(story).includes(type)),
  )

  return (
    <section className="grid gap-12 border-t border-line pb-24 pt-16 md:grid-cols-12">
      <Reveal className="md:col-span-4">
        <Eyebrow>Explore</Eyebrow>
        <h2 className="m-0 font-display text-[2.75rem] font-normal leading-none text-midnight">
          Read for what you want to <span className="italic text-accent">practise</span>
        </h2>
        <p className="mt-5 text-ink-soft">
          Every marker points at one kind of unsaid meaning. Pick the kind you want to notice.
        </p>
        <p className="label-caps mb-3 mt-10 text-ink-soft">By setting</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {categories.map((category) => (
            <li
              key={category}
              className="rounded-full border border-line-strong px-4 py-1.5 text-[0.9375rem] text-midnight"
            >
              {category}{' '}
              <span className="text-ink-soft">
                · {stories.filter((story) => story.category === category).length}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
      <ol className="m-0 list-none p-0 md:col-span-7 md:col-start-6">
        {practised.map((type, index) => (
          <li key={type}>
            <Reveal
              delay={index}
              className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line py-6"
            >
              <span
                aria-hidden="true"
                className="font-display text-[2.5rem] leading-none text-accent"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="m-0 font-display text-[1.75rem] font-normal leading-tight text-midnight">
                  {skills[type].label}
                </h3>
                <p className="m-0 mt-1 text-ink-soft">{skills[type].blurb}</p>
                <p className="m-0 mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {stories
                    .filter((story) => storySkills(story).includes(type))
                    .map((story) => (
                      <Link
                        key={story.id}
                        to={`/read/${story.id}`}
                        className="group inline-flex items-center gap-1 rounded-sm font-medium text-accent underline-offset-4 hover:underline"
                      >
                        {story.title}
                        <Arrow className="h-4 w-4" />
                      </Link>
                    ))}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

function AddReading() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const box = useRef<HTMLTextAreaElement>(null)
  useEffect(() => box.current?.focus(), [])

  // Paste and upload share one pipeline: (upload →) prepare → save on the shelf → open.
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
      const saved = saveOwnReading(await prepare(source.title, source.text))
      navigate(`/read/${saved.id}`)
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
      setStatus('')
    }
  }

  return (
    <div
      id="add-reading"
      className="fade-in mt-12 max-w-3xl rounded bg-paper p-5 shadow-panel md:p-6"
    >
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
