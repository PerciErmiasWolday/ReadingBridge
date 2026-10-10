import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { MetaStrip } from '../components/MetaStrip'
import { Placeholder } from '../components/Placeholder'
import { SentenceText } from '../components/SentenceText'
import { getLastRead, getStory, saveLastRead } from '../data/stories'
import { explain } from '../services/explain'
import type { ExplainLevel, Explanation, Story } from '../types'

export function ReaderPage() {
  const { storyId } = useParams()
  const story = getStory(storyId)

  if (!story) {
    return <Placeholder title="Story not found" description="This story is not in the library." />
  }
  return <Reader key={story.id} story={story} />
}

interface Panel {
  request: number
  sentenceId: number
  level: ExplainLevel
  trigger: HTMLElement
  status: 'loading' | 'done' | 'error'
  explanation?: Explanation
}

const linkButton =
  'rounded-sm text-[0.9375rem] text-sage decoration-1 underline-offset-4 hover:underline focus-visible:underline'

function Reader({ story }: { story: Story }) {
  const navigate = useNavigate()
  const [sectionIndex, setSectionIndex] = useState(() => {
    const last = getLastRead()
    return last?.storyId === story.id ? Math.min(last.sectionIndex, story.sections.length - 1) : 0
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
  }, [story.id, sectionIndex])

  async function load(sentenceId: number, level: ExplainLevel, trigger: HTMLElement) {
    const request = ++latest.current
    const base = { request, sentenceId, level, trigger }
    setSelectedId(sentenceId)
    setPanel({ ...base, status: 'loading' })
    try {
      const explanation = await explain(story, sentenceId, level)
      if (request === latest.current) setPanel({ ...base, status: 'done', explanation })
    } catch {
      if (request === latest.current) setPanel({ ...base, status: 'error' })
    }
  }

  function close() {
    latest.current++
    panel?.trigger.focus()
    setPanel(null)
  }

  function next() {
    if (isLast) return navigate('/library')
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
    <article className="max-w-measure">
      <title>{`${story.title} — ReadingBridge`}</title>
      <MetaStrip
        items={[
          { label: 'Story', value: story.category },
          { label: 'Section', value: `${sectionIndex + 1} of ${count}` },
          { label: 'Read', value: `${story.readMinutes} min` },
        ]}
      />
      <h1 className="mt-8 font-display text-[2.75rem] font-normal leading-[1.1] text-ink">
        {story.title}
      </h1>
      <p className="mb-0 mt-8 font-reading text-reading text-ink">
        {section.sentences.map((sentence) => (
          <SentenceText
            key={sentence.id}
            sentence={sentence}
            selected={selectedId === sentence.id}
            quote={quote}
            onSelect={setSelectedId}
            onExplain={(id, trigger) => load(id, 'normal', trigger)}
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
      <footer className="mt-12">
        <div aria-hidden="true" className="h-px bg-rule">
          <div
            className="h-px bg-ink"
            style={{ width: `${((sectionIndex + 1) / count) * 100}%` }}
          />
        </div>
        <div className="mt-5 flex items-center justify-between gap-6">
          <p className="m-0 text-[0.9375rem] text-ink-soft">
            Section {sectionIndex + 1} of {count}
          </p>
          <Button onClick={next}>{isLast ? 'Finish' : 'Continue'}</Button>
        </div>
      </footer>
    </article>
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
  useEffect(() => heading.current?.focus(), [])

  const { status, explanation } = panel
  const found = status === 'done' && explanation && !explanation.not_in_text
  const title = found
    ? 'The story says'
    : status === 'loading'
      ? 'Reading the story…'
      : status === 'error'
        ? "Couldn't get an explanation."
        : "The story doesn't tell us this."

  return (
    <aside
      aria-label="Explanation"
      aria-live="polite"
      className="fade-in mt-8 border border-rule bg-surface p-6"
    >
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h2
          ref={heading}
          tabIndex={-1}
          className={
            found
              ? 'label-caps text-ink-soft'
              : `text-[1.0625rem] font-normal ${status === 'done' ? 'text-ink' : 'text-ink-soft'}`
          }
        >
          {title}
        </h2>
        {status === 'error' && (
          <button type="button" onClick={onRetry} className={linkButton}>
            Try again
          </button>
        )}
      </div>
      {found && (
        <>
          <blockquote className="m-0 mt-3 font-reading text-reading text-ink">
            “{explanation.clue_quote}”
          </blockquote>
          <dl className="mt-6">
            <dt className="label-caps text-ink-soft">Clue</dt>
            <dd className="m-0 mt-1 text-ink">{explanation.clue}</dd>
            <dt className="label-caps mt-4 text-ink-soft">What it means</dt>
            <dd className="m-0 mt-1 text-ink">{explanation.meaning}</dd>
          </dl>
        </>
      )}
      <div className="mt-6 flex items-center gap-6">
        {found && panel.level === 'normal' && (
          <Button variant="secondary" onClick={onSimpler}>
            Say it more simply
          </Button>
        )}
        <button type="button" onClick={onClose} className={linkButton}>
          Close
        </button>
      </div>
    </aside>
  )
}
