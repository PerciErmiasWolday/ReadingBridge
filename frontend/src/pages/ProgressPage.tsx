import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow } from '../components/Arrow'
import { buttonClass } from '../components/buttonClass'
import { ExampleToggle } from '../components/ExampleToggle'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { exampleLog, formatDate, getLog } from '../data/readingLog'
import { stories } from '../data/stories'

export function ProgressPage() {
  const [example, setExample] = useState(false)
  const log = example ? exampleLog : getLog()

  const rows = stories.map((story) => ({ story, entry: log[story.id] }))
  const started = rows.filter((row) => row.entry)
  const finishedCount = started.filter((row) => row.entry.finished).length
  const sectionsRead = started.reduce((sum, row) => sum + row.entry.furthest + 1, 0)

  const history = started
    .flatMap(({ story, entry }) => [
      {
        date: entry.lastOpened,
        text: `Read ${story.title}, up to section ${entry.furthest + 1} of ${story.sections.length}`,
      },
      ...(entry.finishedAt ? [{ date: entry.finishedAt, text: `Finished ${story.title}` }] : []),
    ])
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader
        title="Progress"
        eyebrow="Progress"
        display={
          <>
            Your reading <span className="italic text-accent">journey</span>
          </>
        }
      >
        A plain record of what you have read. No scores and no streaks.
      </PageHeader>
      <div className="mb-14">
        <ExampleToggle on={example} onChange={setExample} />
      </div>

      {started.length === 0 ? (
        <EmptyJourney />
      ) : (
        <>
          <Reveal>
            <dl className="m-0 grid border-y border-line sm:grid-cols-2">
              {[
                ['Stories finished', `${finishedCount} of ${stories.length}`],
                ['Sections read', String(sectionsRead)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-line py-7 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="label-caps text-ink-soft">{label}</dt>
                  <dd className="m-0 mt-2 font-display text-[3.25rem] leading-none text-midnight">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="mt-16 grid gap-16 md:grid-cols-2">
            <Reveal>
              <section>
                <h2 className="m-0 font-display text-[2.25rem] font-normal text-midnight">
                  Story by story
                </h2>
                <p className="mt-2 text-ink-soft">Each square is one section of the story.</p>
                <ul className="m-0 mt-6 list-none p-0">
                  {rows.map(({ story, entry }) => {
                    const read = entry ? entry.furthest + 1 : 0
                    const count = story.sections.length
                    const status = !entry
                      ? 'Not started'
                      : entry.finished
                        ? 'Finished'
                        : `Section ${read} of ${count}`
                    return (
                      <li
                        key={story.id}
                        className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5"
                      >
                        <div>
                          <p className="m-0 font-display text-[1.5rem] leading-tight text-midnight">
                            {story.title}
                          </p>
                          <p className="m-0 text-[0.9375rem] text-ink-soft">{status}</p>
                        </div>
                        <span aria-hidden="true" className="flex gap-1.5">
                          {story.sections.map((section, index) => (
                            <span
                              key={section.id}
                              className={`rise h-7 w-7 border ${index < read ? 'border-accent bg-accent' : 'border-line-strong'}`}
                              style={{ animationDelay: `calc(var(--motion-duration) * ${index})` }}
                            />
                          ))}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </Reveal>

            <Reveal delay={1}>
              <section>
                <h2 className="m-0 font-display text-[2.25rem] font-normal text-midnight">
                  Reading history
                </h2>
                <p className="mt-2 text-ink-soft">Most recent first.</p>
                <ol className="m-0 mt-6 list-none border-l-2 border-ivory-deep p-0">
                  {history.map((event) => (
                    <li key={event.date + event.text} className="relative py-4 pl-8">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[7px] top-6 h-3 w-3 rounded-full bg-accent"
                      />
                      <p className="label-caps m-0 text-ink-soft">{formatDate(event.date)}</p>
                      <p className="m-0 mt-1 text-[1.0625rem] text-ink">{event.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>
          </div>
        </>
      )}
    </>
  )
}

function EmptyJourney() {
  return (
    <Reveal>
      <section className="grid items-center gap-10 bg-ivory-deep px-6 py-12 md:grid-cols-12 md:px-12">
        <svg
          viewBox="0 0 320 180"
          aria-hidden="true"
          focusable="false"
          className="w-full max-w-sm md:col-span-5"
        >
          <path
            d="M14 150 C80 150 70 70 150 84 S240 30 306 30"
            fill="none"
            stroke="#18213D"
            strokeWidth="2.5"
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
          <circle cx="14" cy="150" r="10" fill="#2E5B47" />
          <circle cx="150" cy="84" r="8" fill="none" stroke="#18213D" strokeWidth="2" />
          <circle cx="306" cy="30" r="8" fill="none" stroke="#18213D" strokeWidth="2" />
          <path d="M296 30 L306 4 L316 30" fill="#2E5B47" />
        </svg>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="m-0 font-display text-[2.5rem] font-normal leading-tight text-midnight">
            Your journey starts with <span className="italic">one story</span>.
          </h2>
          <p className="mt-4 max-w-md text-[1.0625rem] text-ink-soft">
            Once you read, this page shows the stories you finish, each section you reach, and when
            you read them.
          </p>
          <Link to="/library#shelf" className={`${buttonClass('primary')} mt-6`}>
            Choose a story
            <Arrow />
          </Link>
        </div>
      </section>
    </Reveal>
  )
}
