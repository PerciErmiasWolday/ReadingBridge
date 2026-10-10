import { ArrowLeft, Lightbulb, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Arrow } from '../components/Arrow'
import { BookmarkButton } from '../components/BookmarkButton'
import { Button } from '../components/Button'
import { Cover } from '../components/Cover'
import { Placeholder } from '../components/Placeholder'
import { ProgressBar } from '../components/ProgressBar'
import { SentenceText } from '../components/SentenceText'
import { getLog, logSection } from '../data/readingLog'
import { getSettings } from '../data/settings'
import { clearLastRead, getLastRead, getStory, saveLastRead } from '../data/stories'
import { explain } from '../services/explain'
import type { ExplainLevel, Explanation, Story } from '../types'

export function ReaderPage() {
  const { storyId } = useParams()
  const story = getStory(storyId)

  if (!story) {
    return (
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-5 py-16">
        <Placeholder title="Story not found" description="This story is not in the library." />
        <Link to="/library" className="font-medium text-accent underline-offset-4 hover:underline">
          Back to the Library
        </Link>
      </main>
    )
  }
  return <Reader key={story.id} story={story} />
}

interface Panel {
  request: number
  sentenceId: number
  level: ExplainLevel
  trigger: HTMLElement
  /** Opened by click, tap or keyboard (true) or by resting the pointer on a marker (false). */
  moveFocus: boolean
  status: 'loading' | 'done' | 'error'
  explanation?: Explanation
}

const linkButton =
  'group inline-flex items-center gap-1 rounded-sm text-[0.9375rem] font-medium text-accent decoration-1 underline-offset-4 hover:underline focus-visible:underline'

function Reader({ story }: { story: Story }) {
  const navigate = useNavigate()
  const [settings] = useState(getSettings)
  const [sectionIndex, setSectionIndex] = useState(() => {
    // Resume an unfinished story where it was left; otherwise use the last place read.
    const entry = getLog()[story.id]
    const last = getLastRead()
    const saved =
      entry && !entry.finished
        ? entry.sectionIndex
        : last?.storyId === story.id
          ? last.sectionIndex
          : 0
    return Math.min(saved, story.sections.length - 1)
  })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [panel, setPanel] = useState<Panel | null>(null)
  const latest = useRef(0)

  const section = story.sections[sectionIndex]
  const count = story.sections.length
  const isLast = sectionIndex === count - 1
  const found = panel?.status === 'done' && !panel.explanation?.not_in_text
  const quote = found ? panel.explanation?.clue_quote.replace(/^[\s."]+|[\s."]+$/g, '') : undefined

  useEffect(() => {
    saveLastRead({ storyId: story.id, sectionIndex })
    logSection(story.id, sectionIndex)
  }, [story.id, sectionIndex])

  async function load(
    sentenceId: number,
    level: ExplainLevel,
    trigger: HTMLElement,
    moveFocus = true,
  ) {
    // Hovering a marker whose explanation is already open does nothing.
    if (!moveFocus && panel?.sentenceId === sentenceId && panel.status !== 'error') return
    const request = ++latest.current
    const base = { request, sentenceId, level, trigger, moveFocus }
    setSelectedId(sentenceId)
    setPanel({ ...base, status: 'loading' })
    try {
      const explanation = await explain(story, sentenceId, level)
      if (request !== latest.current) return
      setPanel({ ...base, status: 'done', explanation })
    } catch {
      if (request === latest.current) setPanel({ ...base, status: 'error' })
    }
  }

  function close() {
    latest.current++
    if (panel?.moveFocus) panel.trigger.focus()
    setPanel(null)
  }

  function next() {
    if (isLast) {
      logSection(story.id, sectionIndex, true)
      clearLastRead()
      return navigate('/library')
    }
    latest.current++
    setPanel(null)
    setSelectedId(null)
    setSectionIndex(sectionIndex + 1)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (panel) close()
      else setSelectedId(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div className="reader min-h-screen" data-theme={settings.theme}>
      <title>{`${story.title} — ReadingBridge`}</title>
      <header className="mx-auto flex max-w-[56rem] items-center justify-between gap-4 px-5 py-5 md:px-8">
        <Link
          to="/library"
          className="group inline-flex items-center gap-2 rounded-sm text-[0.9375rem] text-r-soft hover:text-r-ink"
        >
          <ArrowLeft
            size={18}
            strokeWidth={1.75}
            aria-hidden="true"
            className="transition duration-300 group-hover:-translate-x-1"
          />
          Library
        </Link>
        <div className="flex items-center gap-1 text-r-ink">
          {story.id !== 'pasted' && <BookmarkButton storyId={story.id} title={story.title} />}
          <Link
            to="/settings"
            aria-label="Reading settings"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full font-display text-[1.375rem] hover:bg-r-line"
          >
            Aa
          </Link>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-[56rem] px-5 pb-16 md:px-8">
        <article className="mx-auto max-w-measure">
          <div className="flex items-end gap-6 border-b border-r-line pb-8 pt-6">
            <div className="hidden w-20 shrink-0 -rotate-2 shadow-book sm:block">
              <Cover story={story} />
            </div>
            <div>
              <p className="label-caps m-0 text-r-soft">
                {story.category}
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, </span>
                Section {sectionIndex + 1} of {count}
              </p>
              <h1 className="m-0 mt-2 font-display text-[2.75rem] font-normal leading-[1.02] md:text-[3.5rem]">
                {story.title}
              </h1>
            </div>
          </div>

          <p key={sectionIndex} className="fade-in mb-0 mt-10 font-reading text-reading">
            {section.sentences.map((sentence) => (
              <SentenceText
                key={sentence.id}
                sentence={settings.markers ? sentence : { ...sentence, marker: undefined }}
                selected={selectedId === sentence.id}
                quote={quote}
                onSelect={setSelectedId}
                onExplain={(id, trigger, byHover) => load(id, 'normal', trigger, !byHover)}
              />
            ))}
          </p>
          {panel && (
            <ExplanationPanel
              key={panel.request}
              panel={panel}
              onSimpler={() => load(panel.sentenceId, 'simple', panel.trigger)}
              onRetry={() => load(panel.sentenceId, panel.level, panel.trigger)}
              onClose={close}
            />
          )}

          <footer className="mt-14 border-t border-r-line pt-6">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <ProgressBar
                  key={sectionIndex}
                  value={(sectionIndex + 1) / count}
                  className="w-28"
                />
                <p className="m-0 text-[0.9375rem] text-r-soft">
                  Section {sectionIndex + 1} of {count}
                </p>
              </div>
              <Button variant="reading" onClick={next}>
                {isLast ? 'Finish' : 'Continue'}
                <Arrow />
              </Button>
            </div>
            <p className="mb-0 mt-5 flex items-center gap-2 text-[0.875rem] text-r-soft">
              <Lightbulb size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
              Tap a marker or any sentence if something feels unclear.
            </p>
          </footer>
        </article>
      </main>
    </div>
  )
}

interface ExplanationPanelProps {
  panel: Panel
  onSimpler: () => void
  onRetry: () => void
  onClose: () => void
}

function ExplanationPanel({ panel, onSimpler, onRetry, onClose }: ExplanationPanelProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (panel.moveFocus) heading.current?.focus()
  }, [panel.moveFocus])

  const { status, explanation } = panel
  const found = status === 'done' && explanation && !explanation.not_in_text

  return (
    <aside
      aria-label="Explanation"
      className="fade-in mt-8 rounded border border-r-line bg-r-raised p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-r-line">
          <Lightbulb size={18} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h2
          ref={heading}
          tabIndex={-1}
          className="m-0 flex-1 font-display text-[1.5rem] font-normal"
        >
          Help me with this
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-r-soft hover:bg-r-line"
        >
          <X size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <div aria-live="polite" className="mt-4">
        {status === 'loading' && <p className="m-0 text-r-soft">Reading the story…</p>}
        {status === 'error' && (
          <p className="m-0">
            Couldn't get an explanation.{' '}
            <button type="button" onClick={onRetry} className={linkButton}>
              Try again
            </button>
          </p>
        )}
        {status === 'done' && !found && <p className="m-0">The story doesn't tell us this.</p>}
        {found && (
          <>
            <h3 className="label-caps m-0 flex items-center gap-2 text-r-soft">
              <span aria-hidden="true" className="h-2 w-2 rounded-full border border-current" />
              What's the clue?
            </h3>
            <blockquote className="m-0 mt-3 border-l-2 border-accent pl-4 font-story text-[1.0625rem] italic">
              “{explanation.clue_quote}”
            </blockquote>
            <p className="m-0 mt-3">{explanation.clue}</p>
            <h3 className="label-caps m-0 mt-6 flex items-center gap-2 text-r-soft">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
              What does it mean?
            </h3>
            <p className="m-0 mt-2">{explanation.meaning}</p>
            {panel.level === 'normal' && (
              <div className="mt-6 border-t border-r-line pt-4">
                <button type="button" onClick={onSimpler} className={linkButton}>
                  Say it more simply
                  <Arrow className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
