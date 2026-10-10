# ReadingBridge — project memory

Every phase must follow this file. If a rule here conflicts with a request, raise it before building.

**Keep code minimal.** Write the smallest amount of code that meets the requirement. No extra
abstractions, helper layers, config systems, wrapper components, or speculative features. Prefer
editing existing files over adding new ones.

## Product

ReadingBridge is an AI-assisted reading app designed with autistic readers in mind: students who
read the words well but can miss what a text implies (feelings, figurative language, who a pronoun
refers to, cause and effect). It must also work for any student who finds those things hard.

- Respectful, calm, age-appropriate (mature enough for a 14-year-old, never childish).
- Never assume all autistic readers have the same needs. Preferences are adjustable, not presumed.

**Product principle: Reading comes first. Assistance appears only when requested.**
Students read a story, tap a quiet marker or select any sentence for a short explanation grounded in
the text, and can optionally quiz themselves. Nothing interrupts reading unless the student asks.

The build has 7 phases. Phase 1 (foundation, design system, shell) is complete.

## Repository

- `/frontend` — React 19 + TypeScript (strict) + Vite, Tailwind CSS v3, React Router, Lucide,
  Vitest + React Testing Library, ESLint 9 + Prettier, fonts self-hosted via @fontsource.
- `/backend` — Python FastAPI. **Do not modify it.** Frontend types must match its API
  (`POST /split`, `POST /explain`; see `backend/README.md`). Setup:
  `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`; tests: `.venv/bin/pytest -q`.

Commands (run in `/frontend`): `npm run dev`, `npm run build`, `npm run lint`, `npm test`,
`npm run format`. All four of build, lint, test and format:check must pass before a phase ends.

Source layout: `src/components`, `src/pages`, `src/data`, `src/types`, `src/services`,
`src/styles`, `src/test`. Keep components small and understandable.

Routes: `/library`, `/read/:storyId`, `/my-reading`, `/progress`, `/settings`, and `/styleguide`
(development only; excluded from production builds). `/` redirects to `/library`.
On `/read/:storyId` the left navigation is hidden; only a quiet "← Library" link shows.

## Visual direction: Austurbane

Austere + urbane. The restraint of premium apothecary and tea packaging, translated into a reading
app. Quiet material, precise structure, editorial typography. The story is always the most
important thing on the screen.

1. **Paper and mineral colours.** Warm off-white paper, bone and stone neutrals, charcoal ink, one
   muted sage, one clay accent reserved for markers. Nothing saturated.
2. **Hairline structure instead of cards.** 1px rules divide content, like a printed label. Content
   sits on the page, not in floating boxes. Corners 0–2px. No shadows. Elevation = hairline border
   plus a slight surface-tone change.
3. **The ruled metadata strip** (`MetaStrip`). Small facts in hairline-ruled cells, small uppercase
   tracked sans, label/value pairs. Use for story headers and library entries only.
4. **Editorial typography.** Display serif for titles and the wordmark only; a readable text serif
   for stories; a neutral grotesk for interface. The contrast between them is the decoration.
5. **Generous, deliberate whitespace on a strict grid.** Left-aligned, ragged right. Asymmetry is
   fine; clutter is not.
6. **Illustration is rare and botanical.** At most one fine-line monochrome specimen drawing per
   story cover. Until then, covers are typographic (`StoryCover`: title, strip, thin frame) with an
   empty `data-slot="illustration"` area.

**Austere never means hard to read.** Readability always wins. Story text is never light grey,
never small, never in the display serif. All text meets WCAG AA.

## Design tokens

Source of truth: `frontend/src/styles/tokens.css`. Tailwind maps to these variables in
`frontend/tailwind.config.ts`, and the default Tailwind palette, radii and shadows are **replaced**,
so only token classes exist (`bg-paper`, `text-ink-soft`, `border-rule`, …).

| Token           | Value     | Use                                                       |
| --------------- | --------- | --------------------------------------------------------- |
| `--paper`       | `#F3F1EC` | Page background                                           |
| `--surface`     | `#EAE7E0` | Subtle raised areas such as the panel background          |
| `--ink`         | `#22221F` | Primary text and the primary button fill                  |
| `--ink-soft`    | `#5E5B54` | Secondary text (minimum for any readable text)            |
| `--rule`        | `#D6D2C8` | Hairline borders and dividers                             |
| `--rule-strong` | `#B9B4A8` | Hover borders and the strip dividers                      |
| `--sage`        | `#576B5E` | The single interface accent: links, focus, selected nav   |
| `--sage-tint`   | `#E3E7E1` | Sentence selection and highlight background               |
| `--clay`        | `#A65F45` | Markers only. Used nowhere else.                          |

`--sage` was specified as `#5F7466`, which is 4.45:1 on paper and fails AA for text. It was darkened
to `#576B5E` (same hue): 5.07:1 on paper, 4.63:1 on surface, 4.57:1 on sage-tint. Do not revert.

**Typography**

- Display (titles, wordmark only): Instrument Serif — `font-display`
- Story text: Source Serif 4, 20px, line-height 1.75, measure 65ch — `font-reading text-reading max-w-measure`
- Interface: Instrument Sans — `font-ui` (the default)
- Readable alternative: Atkinson Hyperlegible — `var(--font-readable)`
- Strip labels: Instrument Sans 11–12px, uppercase, 0.08em tracking — `.label-caps`
- Two weights only: 400 (`font-normal`) and 500 (`font-medium`)

**Reader preferences** — CSS variables a Settings page sets on `:root`:
`--reading-font-family` (`var(--font-story)` or `var(--font-readable)`), `--reading-font-size`
(rem, so browser zoom is respected), `--reading-line-height`, `--reading-measure`.

**Spacing, shape, motion**

- 4px base spacing scale (Tailwind's default scale: `1` = 4px)
- Radius: `rounded-none` (0) for structure, `rounded-sm` (2px) for buttons and inputs. No pills.
  `rounded-dot` exists only for the marker dot.
- Borders: 1px hairlines only (`border` is 1px; there are no thicker widths)
- Shadows: none (`shadow-none` is the only shadow)
- Motion: opacity and transform only, 150ms (`--motion-duration`), 0ms under
  `prefers-reduced-motion`

**Components**

- Primary button (`Button`): ink fill, paper text, 2px radius, rectangular
- Secondary button (`Button variant="secondary"`): transparent, 1px rule border, ink text
- Text link (`TextLink`): sage, underline on hover and focus
- Focus ring: 2px sage outline, 2px offset, global `:focus-visible` rule in `styles/index.css`.
  Never use `outline-none` or remove outlines (a test enforces this).
- Marker (`Marker`, via `SentenceText`): 6px clay dot after the sentence in a 24px hit area. On
  hover or focus the marked phrase gets a subtle clay underline, so colour is never the only cue.
- Selected nav item: sage text plus a 1px sage rule on its left edge, never a filled pill.
- Wordmark: "ReadingBridge" set in Instrument Serif. No logo, no illustration.

## Anti-AI design rules

Do not use:

- Gradients, glassmorphism, glow, or blur
- Decorative blobs or floating shapes
- Large rounded cards, or putting every section in a card
- Drop shadows
- Emoji anywhere in the interface
- Generic dashboard widgets, stat tiles, or charts
- Purple, cyan, or bright blue "AI" branding
- Oversized welcome banners or hero sections
- The "big heading, subtitle, three feature cards, colourful CTA" layout
- Pill-shaped buttons
- More than one accent colour on a screen (clay markers excepted)
- Watercolour or stock-style illustrations
- Decorative or cute microcopy
- Fake statistics, streaks, badges, or achievements

## Accessibility

- Every interactive element is keyboard-accessible with a visible focus ring
- No information is conveyed by colour alone
- Comfortable text spacing; respect browser zoom (use rem, never fixed px for reading text)
- `prefers-reduced-motion` is honoured
- No flashing and no unnecessary animation
- Quizzes are never forced
- AA contrast for all text (`--ink-soft` is the lightest colour allowed for readable text)
- A "Skip to content" link is the first focusable element on every layout
- Interactive targets are at least 24×24px

## Shared types (`frontend/src/types/index.ts`)

```ts
type MarkerType = 'feeling' | 'who' | 'why' | 'idiom' | 'other'

interface Sentence { id: number; text: string; marker?: { type: MarkerType } }
interface Section  { id: string; sentences: Sentence[] }
interface Story    { id: string; title: string; category: string; readMinutes: number; sections: Section[] }

// Must match the backend /explain response exactly
interface Explanation {
  type: MarkerType
  clue_quote: string
  clue: string
  meaning: string
  not_in_text: boolean
  sentence_id: number
  checks: string[]   // "passed" or the failure reason, one per attempt
  fallback?: boolean // true when both attempts failed the grounding checks
}

type ExplainLevel = 'normal' | 'simple'
```

Sentence ids are the backend's 0-based indices from `backend/text_utils.split_sentences` over the
whole story. Story data must be generated with that function, never split by hand.

`frontend/src/services/explain.ts` exports
`explain(story, sentenceId, level): Promise<Explanation>`. It is currently a **MOCK**
(`IS_MOCK = true`); a later phase points it at the backend without changing components.