import { useState, type ReactNode } from 'react'
import { Arrow } from '../components/Arrow'
import { Button } from '../components/Button'
import { Cover } from '../components/Cover'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { SentenceText } from '../components/SentenceText'
import { TextLink } from '../components/TextLink'
import { newStudent } from '../data/newStudent'
import { stories } from '../data/stories'
import { colorTokens } from '../styles/tokens'

/** Development only. Every token and primitive in one place for review. */
export default function StyleguidePage() {
  return (
    <div>
      <PageHeader title="Styleguide" eyebrow="Development only">
        The ReadingBridge identity: colour, type, controls, covers and the reading primitives.
      </PageHeader>
      <Section title="Colour">
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <li key={token.name} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-12 w-12 shrink-0 rounded-full border border-line"
                style={{ background: `var(${token.name})` }}
              />
              <span className="text-[0.9375rem]">
                <code className="block text-midnight">
                  {token.name} {token.hex}
                </code>
                <span className="text-ink-soft">{token.use}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Typography">
        <p className="m-0 font-display text-[4.25rem] leading-none text-midnight">
          Display, <span className="italic text-accent">Instrument Serif</span>
        </p>
        <p className="mt-6 max-w-measure font-reading text-reading text-ink">
          Story text in Source Serif 4 at 20px with 1.75 line spacing, set to the reader’s choices.
        </p>
        <p className="mt-4 text-ink-soft">
          Interface text in Instrument Sans. Secondary text in ink-soft.
        </p>
        <p className="label-caps mt-4 text-accent">Eyebrow label</p>
      </Section>
      <Section title="Buttons and links">
        <div className="flex flex-wrap items-center gap-4">
          <Button>
            Start reading
            <Arrow />
          </Button>
          <Button variant="secondary">Tab to me</Button>
          <Button disabled>Unavailable</Button>
          <TextLink to="/library">A text link</TextLink>
        </div>
      </Section>
      <Section title="Covers">
        <div className="grid max-w-3xl grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="shadow-book">
              <Cover story={story} />
            </div>
          ))}
        </div>
        <ProgressBar value={2 / 3} className="mt-10 w-48" />
      </Section>
      <MarkerSection />
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-12">
      <h2 className="m-0 mb-8 font-display text-[2rem] font-normal text-midnight">{title}</h2>
      {children}
    </section>
  )
}

function MarkerSection() {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <Section title="Markers and selection">
      <p className="m-0 max-w-measure font-reading text-reading text-ink">
        {newStudent.sections[1].sentences.map((sentence) => (
          <SentenceText
            key={sentence.id}
            sentence={sentence}
            selected={selected === sentence.id}
            onSelect={setSelected}
            onExplain={setSelected}
          />
        ))}
      </p>
    </Section>
  )
}
