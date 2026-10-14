import { Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Arrow } from '../components/Arrow'
import { BookmarkButton } from '../components/BookmarkButton'
import { Button } from '../components/Button'
import { Cover } from '../components/Cover'
import { HeroArt } from '../components/HeroArt'
import { ProgressBar } from '../components/ProgressBar'
import { Reveal } from '../components/Reveal'
import { getLog } from '../data/readingLog'
import {
  getLastRead,
  getOwnReadings,
  getStory,
  removeOwnReading,
  skills,
  stories,
  storySkills,
} from '../data/stories'
import type { Story } from '../types'

export function LibraryPage() {
  const lastRead = getLastRead()
  const lastStory = lastRead ? getStory(lastRead.storyId) : undefined
  // With nothing to continue, the same card suggests the first library story not yet finished.
  const log = getLog()
  const firstStory = stories.find((story) => !log[story.id]?.finished) ?? stories[0]

  return (
    <>
      <title>Library — ReadingBridge</title>
      <Hero />
      {lastRead && lastStory ? (
        <ContinueReading story={lastStory} sectionIndex={lastRead.sectionIndex} resume />
      ) : (
        <ContinueReading story={firstStory} sectionIndex={0} resume={false} />
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
    <section className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="lg:pb-16">
        <p className="label-caps rise m-0 mb-6 text-[0.8125rem] text-accent">
          Stories with quiet help
        </p>
        <h1
          className="rise m-0 font-display text-[3.5rem] font-normal leading-[0.98] text-midnight sm:text-[4.75rem] lg:text-[5.75rem] xl:text-[7rem]"
          style={{ animationDelay: 'calc(var(--motion-duration) * 1)' }}
        >
          A new story is{' '}
          <span className="block lg:whitespace-nowrap">
            <span className="italic text-accent">waiting</span> for you.
          </span>
        </h1>
      </div>
      {/* Sized to the window height too, so Continue reading always fits on the first screen. */}
      <div
        className="mx-auto w-full"
        style={{ maxWidth: 'min(48rem, calc((100svh - 17rem) * 1.25))' }}
      >
        <HeroArt />
      </div>
    </section>
  )
}

/** The card under the hero: continue where you left off, or (with no saved place) start a story. */
function ContinueReading({
  story,
  sectionIndex,
  resume,
}: {
  story: Story
  sectionIndex: number
  resume: boolean
}) {
  const navigate = useNavigate()
  const count = story.sections.length
  const index = Math.min(sectionIndex, count - 1)
  // A raised card that overlaps the foot of the hero picture, with hairline dividers between parts.
  const part = 'lg:flex lg:flex-col lg:justify-center lg:self-stretch lg:px-8'
  return (
    <Reveal className="relative z-10 mb-16 lg:-mt-2">
      <section className="grid items-center gap-x-5 gap-y-4 rounded-lg border border-line bg-paper px-5 py-4 shadow-panel sm:grid-cols-[3.5rem_minmax(0,1fr)] md:px-8 lg:grid-cols-[auto_minmax(0,1fr)_auto_auto] lg:gap-x-0">
        <div className="w-14 -rotate-3 shadow-book lg:mr-8 lg:w-14">
          <Cover story={story} />
        </div>
        <div className={`${part} lg:border-l lg:border-line`}>
          <p className="label-caps m-0 mb-1 text-accent">
            {resume ? 'Your place is saved' : 'Start here'}
          </p>
          <h2 className="m-0 font-display text-[1.5rem] font-normal leading-tight text-midnight md:text-[1.75rem]">
            {resume ? 'Continue reading' : 'Begin with'}{' '}
            <span className="italic">{story.title}</span>
          </h2>
          <p className="m-0 mt-0.5 truncate font-story text-[1rem] italic text-ink-soft">
            {story.sections[index].sentences[0]?.text}
          </p>
        </div>
        <div className={`${part} sm:col-start-2 lg:col-start-auto`}>
          <ProgressBar value={resume ? (index + 1) / count : 0} className="w-40" />
          <span className="mt-2 text-[0.9375rem] text-ink-soft">
            {resume ? `Section ${index + 1} of ${count}` : `Not started · ${count} sections`}
          </span>
        </div>
        <div
          className={`${part} sm:col-start-2 lg:col-start-auto lg:border-l lg:border-line lg:pr-0`}
        >
          <Button onClick={() => navigate(`/read/${story.id}`)}>
            {resume ? 'Resume' : 'Start reading'}
            <Arrow />
          </Button>
        </div>
      </section>
    </Reveal>
  )
}

const textButton =
  'rounded-sm text-[0.9375rem] font-medium text-accent underline-offset-4 hover:underline'

function Shelf() {
  const [own, setOwn] = useState(getOwnReadings)
  const [confirming, setConfirming] = useState<string | null>(null)
  const addButton = useRef<HTMLAnchorElement>(null)
  // The add item comes first, then the reader's own readings (newest first), then the library.

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
      <ul className="m-0 grid list-none grid-cols-2 items-start gap-x-5 gap-y-10 p-0 sm:grid-cols-3 md:grid-cols-4 md:gap-x-10">
        <li>
          <Link
            ref={addButton}
            to="/add-reading"
            className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 border border-line-strong px-4 text-center text-midnight transition hover:border-midnight"
          >
            <Plus size={24} strokeWidth={1.5} aria-hidden="true" />
            <span className="font-display text-[1.25rem] leading-tight">Add your own reading</span>
          </Link>
          <p className="m-0 mt-4 text-[0.875rem] text-ink-soft">
            Paste text, or upload a .txt or .pdf file.
          </p>
        </li>
        {own.map((story) => (
          <li key={story.id}>
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
              className="m-0 mt-4 font-display text-[1.375rem] font-normal leading-tight text-midnight"
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
          <li key={story.id}>
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
                    className="m-0 font-display text-[1.375rem] font-normal leading-tight text-midnight"
                  >
                    {story.title}
                  </h3>
                  <p
                    id={`${story.id}-description`}
                    className="m-0 mt-1 text-[0.875rem] text-ink-soft"
                  >
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
