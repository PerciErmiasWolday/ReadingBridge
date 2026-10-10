import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Arrow } from '../components/Arrow'
import { buttonClass } from '../components/buttonClass'
import { Cover } from '../components/Cover'
import { ExampleToggle } from '../components/ExampleToggle'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { Reveal } from '../components/Reveal'
import {
  exampleBookmarks,
  exampleLog,
  formatDate,
  getBookmarks,
  getLog,
  type StoryLog,
} from '../data/readingLog'
import { getStory } from '../data/stories'
import type { Story } from '../types'

export function MyReadingPage() {
  const [example, setExample] = useState(false)
  const log = example ? exampleLog : getLog()
  const bookmarks = example ? exampleBookmarks : getBookmarks()

  const entries = Object.entries(log)
    .flatMap(([id, entry]) => {
      const story = getStory(id)
      return story ? [{ story, entry }] : []
    })
    .sort((a, b) => b.entry.lastOpened.localeCompare(a.entry.lastOpened))
  const inProgress = entries.filter(({ entry }) => !entry.finished)
  const finished = entries.filter(({ entry }) => entry.finished)
  const saved = bookmarks.flatMap((id) => getStory(id) ?? [])

  return (
    <>
      <PageHeader
        title="My Reading"
        eyebrow="My Reading"
        display={
          <>
            Your <span className="italic text-accent">shelf</span>
          </>
        }
      >
        Stories you have opened, saved and finished. All of it stays in this browser.
      </PageHeader>
      <div className="mb-14">
        <ExampleToggle on={example} onChange={setExample} />
      </div>

      {entries.length === 0 && saved.length === 0 ? (
        <EmptyShelf />
      ) : (
        <div className="grid gap-x-10 md:grid-cols-3">
          <ShelfRow
            title="In progress"
            empty="Nothing in progress. Every story you start waits here."
          >
            {inProgress.map(({ story, entry }) => (
              <Book key={story.id} story={story}>
                <Progress story={story} entry={entry} />
              </Book>
            ))}
          </ShelfRow>
          <ShelfRow
            title="Saved for later"
            empty="Nothing saved yet. Use the bookmark on any story."
          >
            {saved.map((story) => (
              <Book key={story.id} story={story}>
                <p className="m-0 text-[0.9375rem] text-ink-soft">{story.description}</p>
              </Book>
            ))}
          </ShelfRow>
          <ShelfRow title="Finished" empty="No finished stories yet.">
            {finished.map(({ story, entry }) => (
              <Book key={story.id} story={story}>
                <p className="m-0 text-[0.9375rem] text-ink-soft">
                  Finished {formatDate(entry.finishedAt ?? entry.lastOpened)}
                </p>
              </Book>
            ))}
          </ShelfRow>
        </div>
      )}
    </>
  )
}

function ShelfRow({
  title,
  empty,
  children,
}: {
  title: string
  empty: string
  children: ReactNode[]
}) {
  return (
    <Reveal className="mb-14">
      <section>
        <h2 className="m-0 mb-6 border-t-[2px] border-midnight pt-4 font-display text-[2rem] font-normal text-midnight">
          {title} <span className="text-[1.5rem] text-ink-soft">({children.length})</span>
        </h2>
        {children.length ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-10 border-b-[6px] border-ivory-deep p-0 pb-8">
            {children}
          </ul>
        ) : (
          <p className="m-0 border-b-[6px] border-ivory-deep pb-6 text-ink-soft">{empty}</p>
        )}
      </section>
    </Reveal>
  )
}

function Book({ story, children }: { story: Story; children: ReactNode }) {
  return (
    <li>
      <Link
        to={`/read/${story.id}`}
        className="group block rounded"
        aria-label={`${story.title}, open the story`}
      >
        <div className="shadow-book transition duration-500 group-hover:-translate-y-2 group-hover:-rotate-1">
          <Cover story={story} />
        </div>
        <h3 className="m-0 mt-4 font-display text-[1.375rem] font-normal leading-tight text-midnight">
          {story.title}
        </h3>
      </Link>
      <div className="mt-2">{children}</div>
    </li>
  )
}

function Progress({ story, entry }: { story: Story; entry: StoryLog }) {
  const count = story.sections.length
  return (
    <>
      <ProgressBar value={(entry.sectionIndex + 1) / count} className="w-full" />
      <p className="m-0 mt-2 text-[0.9375rem] text-ink-soft">
        Section {entry.sectionIndex + 1} of {count}
      </p>
    </>
  )
}

function EmptyShelf() {
  return (
    <Reveal>
      <section className="grid items-center gap-10 bg-ivory-deep px-6 py-12 md:grid-cols-12 md:px-12">
        <svg
          viewBox="0 0 320 200"
          aria-hidden="true"
          focusable="false"
          className="w-full max-w-sm md:col-span-5"
        >
          <rect x="10" y="168" width="300" height="10" fill="#18213D" />
          <rect x="46" y="72" width="34" height="96" fill="#2E5B47" />
          <rect x="52" y="86" width="22" height="3" fill="#F2E9D8" />
          <rect x="86" y="92" width="26" height="76" fill="#7E9AB5" />
          <g transform="rotate(14 150 168)">
            <rect x="120" y="80" width="30" height="88" fill="#18213D" />
            <rect x="126" y="96" width="18" height="2" fill="#F2E9D8" />
          </g>
          <path d="M244 168 L238 132 L274 132 L268 168 Z" fill="#D9C9A8" />
          <path d="M256 132 C240 110 236 92 246 76 C258 96 260 114 256 132 Z" fill="#2E5B47" />
          <path d="M256 132 C270 116 286 110 296 112 C288 126 272 134 256 132 Z" fill="#3F7259" />
        </svg>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="m-0 font-display text-[2.5rem] font-normal leading-tight text-midnight">
            Your shelf is empty, <span className="italic">for now</span>.
          </h2>
          <p className="mt-4 max-w-md text-[1.0625rem] text-ink-soft">
            Open any story and it will wait here with your place saved. Bookmark one to keep it for
            later.
          </p>
          <Link to="/library#shelf" className={`${buttonClass('primary')} mt-6`}>
            Browse the shelf
            <Arrow />
          </Link>
        </div>
      </section>
    </Reveal>
  )
}
