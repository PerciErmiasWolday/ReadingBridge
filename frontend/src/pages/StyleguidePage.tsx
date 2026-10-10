import { useState, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { MetaStrip } from '../components/MetaStrip'
import { PageHeader } from '../components/PageHeader'
import { SentenceText } from '../components/SentenceText'
import { StoryCover } from '../components/StoryCover'
import { TextLink } from '../components/TextLink'
import { newStudent } from '../data/newStudent'
import { colorTokens } from '../styles/tokens'

/** Development only. Every token and primitive in one place for review. */
export default function StyleguidePage() {
  return (
    <div className="max-w-5xl">
      <PageHeader title="Styleguide">
        The Austurbane design system: tokens, type, controls, and the reading primitives. This page
        is only available in development.
      </PageHeader>
      <ColourSection />
      <TypeSection />
      <SpacingSection />
      <ControlsSection />
      <FocusSection />
      <MarkerSection />
      <StripSection />
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = `sg-${title.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <section aria-labelledby={id} className="border-t border-rule py-10">
      <h2 id={id} className="label-caps mb-8 text-ink-soft">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ColourSection() {
  return (
    <Section title="Colour">
      <ul className="border-t border-rule">
        {colorTokens.map((token) => (
          <li
            key={token.name}
            className="grid grid-cols-[2.5rem_9rem_6rem_1fr] items-center gap-4 border-b border-rule py-3 text-[0.9375rem]"
          >
            <span
              aria-hidden="true"
              className="block h-8 w-8 border border-rule-strong"
              style={{ background: `var(${token.name})` }}
            />
            <code className="font-ui text-ink">{token.name}</code>
            <span className="text-ink-soft">{token.hex}</span>
            <span className="text-ink-soft">{token.use}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-rule py-5 md:grid-cols-[12rem_1fr] md:gap-8">
      <p className="label-caps m-0 pt-1 text-ink-soft">{label}</p>
      <div>{children}</div>
    </div>
  )
}

function TypeSection() {
  return (
    <Section title="Typography">
      <div className="border-t border-rule">
        <Specimen label="Display · 44 / Instrument Serif">
          <p className="m-0 font-display text-[2.75rem] leading-[1.1]">The New Student</p>
        </Specimen>
        <Specimen label="Display · 32 / Instrument Serif">
          <p className="m-0 font-display text-[2rem] leading-[1.1]">ReadingBridge</p>
        </Specimen>
        <Specimen label="Story · 20 / 1.75 / Source Serif 4">
          <p className="m-0 max-w-measure font-reading text-reading text-ink">
            Maya stepped off the bus and stood very still on the pavement, holding both straps of
            her backpack. The school was larger than the one she had left behind in the spring.
          </p>
        </Specimen>
        <Specimen label="Story alt · Atkinson Hyperlegible">
          <p
            className="m-0 max-w-measure text-reading text-ink"
            style={{ fontFamily: 'var(--font-readable)' }}
          >
            Maya stepped off the bus and stood very still on the pavement, holding both straps of
            her backpack. The school was larger than the one she had left behind in the spring.
          </p>
        </Specimen>
        <Specimen label="Interface · 15 / Instrument Sans">
          <p className="m-0 text-[0.9375rem] text-ink">
            Regular 400 for body interface text.{' '}
            <span className="font-medium">Medium 500 for emphasis.</span>
          </p>
          <p className="m-0 mt-2 text-[0.9375rem] text-ink-soft">
            Secondary text in ink-soft, the lightest colour allowed for readable text.
          </p>
        </Specimen>
        <Specimen label="Label · 11 / caps / 0.08em">
          <p className="label-caps m-0 text-ink-soft">Section 1 / 3</p>
        </Specimen>
      </div>
      <dl className="mt-8 grid max-w-xl grid-cols-[1fr_auto] gap-x-8 gap-y-2 text-[0.9375rem]">
        <dt className="text-ink-soft">--reading-font-family</dt>
        <dd className="m-0 text-ink">Source Serif 4 (or Atkinson Hyperlegible)</dd>
        <dt className="text-ink-soft">--reading-font-size</dt>
        <dd className="m-0 text-ink">1.25rem (20px)</dd>
        <dt className="text-ink-soft">--reading-line-height</dt>
        <dd className="m-0 text-ink">1.75</dd>
        <dt className="text-ink-soft">--reading-measure</dt>
        <dd className="m-0 text-ink">65ch</dd>
      </dl>
    </Section>
  )
}

const spacingSteps = [1, 2, 3, 4, 6, 8, 12, 16]

function SpacingSection() {
  return (
    <Section title="Spacing and shape">
      <ul className="m-0 grid gap-3 p-0">
        {spacingSteps.map((step) => (
          <li key={step} className="flex items-center gap-4 text-[0.875rem]">
            <span className="w-14 text-ink-soft">{step * 4}px</span>
            <span
              aria-hidden="true"
              className="block h-3 bg-rule-strong"
              style={{ width: step * 4 }}
            />
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-10 text-[0.875rem] text-ink-soft">
        <figure className="m-0">
          <div className="h-16 w-24 border border-ink" />
          <figcaption className="mt-2">Structure · radius 0</figcaption>
        </figure>
        <figure className="m-0">
          <div className="h-10 w-24 rounded-sm border border-ink" />
          <figcaption className="mt-2">Controls · radius 2px</figcaption>
        </figure>
        <figure className="m-0">
          <div className="h-16 w-24 border border-rule bg-surface" />
          <figcaption className="mt-2">Elevation · hairline + surface</figcaption>
        </figure>
      </div>
    </Section>
  )
}

function ControlsSection() {
  return (
    <Section title="Buttons and links">
      <div className="flex flex-wrap items-center gap-4">
        <Button>Start reading</Button>
        <Button variant="secondary">Quiz myself</Button>
        <Button disabled>Unavailable</Button>
      </div>
      <p className="mt-6 text-[0.9375rem] text-ink">
        A text link looks like this: <TextLink to="/library">Go to the library</TextLink>.
      </p>
    </Section>
  )
}

function FocusSection() {
  return (
    <Section title="Focus ring">
      <p className="mb-6 max-w-measure text-[0.9375rem] text-ink-soft">
        2px sage outline with a 2px offset, shown whenever an element receives keyboard focus. Press
        Tab to move through this page. The button below shows the ring at rest for review.
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <span className="inline-block rounded-sm outline outline-2 outline-offset-2 outline-sage">
          <Button tabIndex={-1} aria-hidden="true">
            Focused
          </Button>
        </span>
        <Button variant="secondary">Tab to me</Button>
      </div>
    </Section>
  )
}

function MarkerSection() {
  const [selected, setSelected] = useState<number | null>(null)
  const sentences = newStudent.sections[0].sentences

  return (
    <Section title="Marker">
      <p className="mb-6 max-w-measure text-[0.9375rem] text-ink-soft">
        A 6px clay dot after a sentence. Hover or focus it and the sentence gains a clay underline.
        Activate it and the sentence takes the sage-tint selection background.
      </p>
      <p className="m-0 max-w-measure font-reading text-reading text-ink">
        {sentences.map((sentence) => (
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

function StripSection() {
  return (
    <Section title="Ruled metadata strip and cover">
      <MetaStrip
        items={[
          { label: 'Story', value: newStudent.category },
          { label: 'Section', value: `1 / ${newStudent.sections.length}` },
          { label: 'Read', value: `${newStudent.readMinutes} min` },
        ]}
        className="mb-10"
      />
      <StoryCover story={newStudent} />
    </Section>
  )
}
