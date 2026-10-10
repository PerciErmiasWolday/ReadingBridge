import { useState, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { SentenceText } from '../components/SentenceText'
import { newStudent } from '../data/newStudent'
import {
  defaultSettings,
  getSettings,
  saveSettings,
  type MotionPreference,
  type ReadingFont,
  type ReadingTheme,
  type Settings,
} from '../data/settings'

const fonts: { value: ReadingFont; name: string; note: string; family: string }[] = [
  { value: 'story', name: 'Book serif', note: 'Source Serif 4', family: 'var(--font-story)' },
  {
    value: 'readable',
    name: 'Hyperlegible',
    note: 'Atkinson Hyperlegible',
    family: 'var(--font-readable)',
  },
  { value: 'sans', name: 'Clean sans', note: 'Instrument Sans', family: 'var(--font-ui)' },
]
const spacings = [
  { value: 1.5, name: 'Snug' },
  { value: 1.75, name: 'Comfortable' },
  { value: 2, name: 'Airy' },
]
const themes: { value: ReadingTheme; name: string; bg: string; ink: string }[] = [
  { value: 'ivory', name: 'Ivory', bg: '#FBF8F1', ink: '#252B3F' },
  { value: 'white', name: 'White', bg: '#FFFFFF', ink: '#1F2433' },
  { value: 'sepia', name: 'Sepia', bg: '#F1E6CF', ink: '#3A2F22' },
  { value: 'night', name: 'Night', bg: '#141A2E', ink: '#E8E2D4' },
]
const motions: { value: MotionPreference; name: string; note: string }[] = [
  { value: 'off', name: 'Off', note: 'Nothing moves. The calmest way to read.' },
  {
    value: 'on',
    name: 'On',
    note: 'Pages ease in and covers lift on hover. Stays off if your device asks for reduced motion.',
  },
]

// A visually hidden radio whose styled label shows the choice and the keyboard focus ring.
const option =
  'block cursor-pointer rounded border border-line bg-paper px-4 py-3 transition hover:border-line-strong peer-checked:border-accent peer-checked:bg-accent-tint peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent'

export function SettingsPage() {
  const [settings, setSettings] = useState(getSettings)

  function update(patch: Partial<Settings>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveSettings(next)
  }

  return (
    <>
      <PageHeader
        title="Settings"
        eyebrow="Settings"
        display={
          <>
            Make reading <span className="italic text-accent">yours</span>.
          </>
        }
      >
        Every choice applies straight away, here in the preview and in every story.
      </PageHeader>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-6">
          <Group legend="Typeface">
            <div className="grid gap-3 sm:grid-cols-3">
              {fonts.map((font) => (
                <Choice
                  key={font.value}
                  name="font"
                  checked={settings.font === font.value}
                  onChange={() => update({ font: font.value })}
                >
                  <span
                    aria-hidden="true"
                    className="block text-[2rem] leading-none text-midnight"
                    style={{ fontFamily: font.family }}
                  >
                    Ag
                  </span>
                  <span className="mt-2 block font-medium text-midnight">{font.name}</span>
                  <span className="block text-[0.8125rem] text-ink-soft">{font.note}</span>
                </Choice>
              ))}
            </div>
          </Group>

          <Group legend="Text size">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="font-display text-[1rem] text-midnight">
                A
              </span>
              <input
                type="range"
                min={16}
                max={28}
                step={1}
                value={settings.size}
                aria-label="Text size"
                aria-valuetext={`${settings.size} pixels`}
                onChange={(event) => update({ size: Number(event.target.value) })}
                className="h-6 flex-1 cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span aria-hidden="true" className="font-display text-[1.75rem] text-midnight">
                A
              </span>
              <output className="w-14 text-right text-ink-soft">{settings.size}px</output>
            </div>
          </Group>

          <Group legend="Line spacing">
            <div className="grid grid-cols-3 gap-3">
              {spacings.map((spacing) => (
                <Choice
                  key={spacing.value}
                  name="spacing"
                  checked={settings.lineHeight === spacing.value}
                  onChange={() => update({ lineHeight: spacing.value })}
                >
                  <span
                    aria-hidden="true"
                    className="mb-2 flex flex-col"
                    style={{ gap: `${(spacing.value - 1) * 10}px` }}
                  >
                    <span className="h-0.5 w-full bg-midnight" />
                    <span className="h-0.5 w-4/5 bg-midnight" />
                    <span className="h-0.5 w-full bg-midnight" />
                  </span>
                  <span className="block font-medium text-midnight">{spacing.name}</span>
                </Choice>
              ))}
            </div>
          </Group>

          <Group legend="Reading theme">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {themes.map((theme) => (
                <Choice
                  key={theme.value}
                  name="theme"
                  checked={settings.theme === theme.value}
                  onChange={() => update({ theme: theme.value })}
                >
                  <span
                    aria-hidden="true"
                    className="mb-2 block rounded-sm border border-line p-2"
                    style={{ background: theme.bg }}
                  >
                    <span className="block h-1 w-full" style={{ background: theme.ink }} />
                    <span className="mt-1.5 block h-1 w-3/4" style={{ background: theme.ink }} />
                    <span className="mt-1.5 block h-1 w-5/6" style={{ background: theme.ink }} />
                  </span>
                  <span className="block font-medium text-midnight">{theme.name}</span>
                </Choice>
              ))}
            </div>
          </Group>

          <Group legend="Motion">
            <div className="grid gap-3 sm:grid-cols-2">
              {motions.map((motion) => (
                <Choice
                  key={motion.value}
                  name="motion"
                  checked={settings.motion === motion.value}
                  onChange={() => update({ motion: motion.value })}
                >
                  <span className="block font-medium text-midnight">{motion.name}</span>
                  <span className="block text-[0.875rem] text-ink-soft">{motion.note}</span>
                </Choice>
              ))}
            </div>
          </Group>

          <Group legend="Story markers">
            <label className="grid cursor-pointer grid-cols-[auto_1fr] gap-x-3">
              <input
                type="checkbox"
                checked={settings.markers}
                onChange={(event) => update({ markers: event.target.checked })}
                className="row-span-2 mt-1 h-5 w-5 cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span className="font-medium text-midnight">Show markers</span>
              <span className="text-[0.875rem] text-ink-soft">
                Small dots after sentences where the meaning is unsaid. When they are hidden you can
                still select any sentence for help.
              </span>
            </label>
          </Group>

          <Button
            variant="secondary"
            onClick={() => {
              setSettings(defaultSettings)
              saveSettings(defaultSettings)
            }}
          >
            Reset to defaults
          </Button>
        </div>

        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-8">
            <p className="label-caps m-0 mb-3 text-ink-soft">Preview</p>
            <Preview settings={settings} />
          </div>
        </div>
      </div>
    </>
  )
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-4 font-display text-[1.75rem] text-midnight">{legend}</legend>
      {children}
    </fieldset>
  )
}

function Choice({
  name,
  checked,
  onChange,
  children,
}: {
  name: string
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label className="relative block">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={option}>{children}</span>
    </label>
  )
}

function Preview({ settings }: { settings: Settings }) {
  const [selected, setSelected] = useState<number | null>(4)
  const section = newStudent.sections[1]
  return (
    <div
      data-testid="reading-preview"
      className="reader rounded p-8 shadow-panel md:p-10"
      data-theme={settings.theme}
    >
      <p className="label-caps m-0 text-r-soft">School · Section 2 of 3</p>
      <p className="m-0 mt-2 font-display text-[2.5rem] leading-none">The New Student</p>
      <p className="mb-0 mt-6 font-reading text-reading">
        {section.sentences.map((sentence) => (
          <SentenceText
            key={sentence.id}
            sentence={settings.markers ? sentence : { ...sentence, marker: undefined }}
            selected={selected === sentence.id}
            onSelect={setSelected}
          />
        ))}
      </p>
    </div>
  )
}
