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

The build has 7 phases:

1. Foundation, design system, shell — done
2. Library — done
3. Reading screen — done (followed by the full redesign described below)
4. Optional quiz — never forced, never automatic
5. Bring your own reading: paste or upload (.txt, text-based .pdf), sections and AI markers — done
6. Testing and evaluation (uses `backend/logs/explain.jsonl`)
7. Case study deliverables: README, notes, video

## Repository

- `/frontend` — React 19 + TypeScript (strict) + Vite, Tailwind CSS v3, React Router, Lucide,
  Vitest + React Testing Library, ESLint 9 + Prettier, fonts self-hosted via @fontsource.
- `/backend` — Python FastAPI. **Do not modify it** unless a request explicitly allows it. Never
  change the `/explain` prompt or `grounding.py` without approval. Approved changes so far:
  `/upload` and `/prepare` (Phase 5, below), and in `/explain`: OpenAI errors return HTTP 503
  `{"detail": "The explanation service is unavailable."}`, and every `/explain` response is
  appended as one JSON line (`sentence_id`, `level`, full `response` with `checks`) to
  `backend/logs/explain.jsonl` (git-ignored). Frontend types must match its API
  (`POST /upload`, `POST /prepare`, `POST /explain`; see `backend/README.md`). Setup:
  `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`; tests: `.venv/bin/pytest -q`.
  Run: `.venv/bin/uvicorn main:app --port 8000`, with `OPENAI_API_KEY` set. Without a key, run
  `FAKE_LLM=1 .venv/bin/uvicorn main:app --port 8000`: canned answers from `fake_llm.py` (mock data;
  only "Maya's heart beat quickly." gets a real explanation, every other sentence gets not_in_text).
  The Vite dev server proxies `/api/*` to `localhost:8000`.

Commands (run in `/frontend`): `npm run dev`, `npm run build`, `npm run lint`, `npm test`,
`npm run format`. All four of build, lint, test and format:check must pass before a phase ends.

Source layout: `src/components`, `src/pages`, `src/data`, `src/types`, `src/services`,
`src/styles`, `src/test`. Keep components small and understandable.

Routes: `/library`, `/read/:storyId`, `/my-reading`, `/progress`, `/settings`, and `/styleguide`
(development only; excluded from production builds). `/` redirects to `/library`.
All routes except the reader use `AppShell` (wordmark, horizontal `MainNav`, colophon footer).
`/read/:storyId` uses `ReaderLayout`: no navigation, only "← Library", a bookmark and an "Aa" link
to Settings, so the story is the only thing on screen.

## Design system: calm bookshop

This is the only design system. (It replaced the earlier "Austurbane" direction and the
rounded-card version; neither applies any more.) Reference mockups: `docs/design/`.

A quiet independent bookshop: warm paper, editorial type, original screenprint-style covers. It
should be memorable without being stimulating, and the reading view stays plain.

1. **Warm paper.** Ivory page with a faint static grain (`body` background). Sections are set apart
   by colour bands (`ivory-deep`, one `midnight` band) and hairline rules, not repeated cards.
2. **Editorial type.** Instrument Serif headlines, often with one italic forest-green word. Small
   tracked uppercase eyebrows (`.label-caps`). Story text is never in the display face.
3. **Asymmetric composition.** Unequal columns; the shelf is staggered by hand (`shelfOffsets`).
   Covers rest on the page with a printed-book shadow (`shadow-book`).
4. **Original art only.** `Cover` draws each story's cover as flat screenprint layers in midnight,
   forest, dusty blue, sand and ivory, with slight misregistration and grain. A new story needs its
   own art in `Cover.tsx`; unknown ids get the typographic "Your reading" cover. `HeroArt` is the
   Library's arch window with a bridge over an open book. No coral or mustard in any art.
5. **Library above the fold.** The hero is compact (eyebrow, headline, one paragraph, small art; no
   buttons) so Continue reading and the top of the shelf show on a laptop without scrolling.
6. **Honest data.** My Reading and Progress show only the reader's own log (`data/readingLog.ts`:
   sections reached, finished stories, bookmarks). Sample data appears only behind "See an example"
   and is labelled wherever it shows. Help requests are not recorded or counted anywhere.

### Colour

Source of truth: `frontend/src/styles/tokens.css` (mirrored in `styles/tokens.ts`; a test keeps
them in sync). Tailwind maps to these variables, and the default palette, radii and shadows are
**replaced**. Tailwind `/opacity` modifiers do not work on these variable colours; use a token.

| Token           | Value     | Use                                                       |
| --------------- | --------- | --------------------------------------------------------- |
| `--ivory`       | `#F5EFE3` | Page background                                           |
| `--ivory-deep`  | `#EBE2D0` | Bands that set a section apart                            |
| `--paper`       | `#FBF8F1` | Raised paper: panels, inputs                              |
| `--midnight`    | `#18213D` | Headlines, primary buttons, the wordmark, the paste band  |
| `--ink`         | `#252B3F` | Body text                                                 |
| `--ink-soft`    | `#5A5F73` | Secondary text (lightest allowed for readable text)       |
| `--line`        | `#DCD3C2` | Rules and borders                                         |
| `--line-strong` | `#BFB49F` | Hover borders                                             |
| `--accent`      | `#2E5B47` | Forest: links, focus ring, progress, active nav, numerals |
| `--accent-tint` | `#DDE8DF` | Selected options, the example badge                       |
| `--mustard-tint`| `#F3E3B8` | Sentence selection. The **only** mustard in the app       |
| `--marker`      | `#B9502F` | Marker dots and the help card's left rule. The **only** clay/coral anywhere (test-checked: `Marker`, `SentenceText`, `HelpCard`) |

Reading themes (`.reader[data-theme=ivory|white|sepia|night]` in `index.css`) set `--r-bg`,
`--r-raised`, `--r-ink`, `--r-soft`, `--r-line`, `--r-select`; night also lightens `--accent` and
`--marker`. Every text pair in every theme passes WCAG AA.

### Type

- Instrument Serif (400 + italic): headlines, the wordmark — `font-display`
- Source Serif 4: stories — `font-reading text-reading max-w-measure` (follows reader settings)
- Instrument Sans: interface — `font-ui` (the default)
- Atkinson Hyperlegible: a reading choice in Settings

### Motion: off by default

`--motion-duration` is `0ms` unless the reader turns **Motion: On** in Settings
(`data-motion="on"` on `:root`) **and** the device does not ask for reduced motion. A global rule
also zeroes every animation and transition when motion is not on. Every animation is a multiple of
`--motion-duration`, so nothing moves by default. With motion on: content rises in once (`.rise`,
`Reveal`), progress lines draw in (`.draw-in`), covers lift on hover, arrows nudge, bookmarks pop,
and the help card fades in. Never add looping animation or anything that bypasses this switch.

### Reader settings

`data/settings.ts`, applied on start in `main.tsx`: font, size (16–28px, set in rem), line
spacing, theme, motion (`off` default | `on`), and whether markers show.

### Components

- `Button` / `buttonClass`: pill buttons. `primary` midnight, `secondary` outlined, `reading`
  follows the reading theme. Put `<Arrow />` inside for the forward nudge.
- Focus ring: 2px accent outline, 2px offset, global `:focus-visible` rule. Never remove outlines.
- `Marker` (via `SentenceText`): 8px marker dot in a 24px hit area, one colour for every type.
  Only click, tap, Enter or Space opens help. Hover and focus only show the clay underline.
- Any sentence can be selected (`r-select` background) and then offers "Help me with this".
- Help card (`HelpCard`): opens directly under the sentence asked about. The paragraph breaks at
  that sentence, the card sits under it (never over text), and the paragraph continues below.
  Compact: text-column width, 2px left rule in the marker colour, interface font ~15px, ~12px
  padding, no headings. Order: the meaning; "Clue:" + the quote in italics (also underlined in the
  story); then "Say it more simply" and "Close" as small links. not_in_text shows only "The story
  doesn't tell us this." and Close. The sentence keeps its highlight; focus moves into the card and
  back to the trigger; Escape closes; one card at a time.
- `BookmarkButton`, `ProgressBar`, `Reveal`, `ExampleToggle`, `Cover`, `HeroArt`.

### Do not

- Cover story text with any popover, overlay or card
- Interrupt reading: no automatic check-ins or quizzes; quizzes are opt-in only
- Show asking for help as a score, count or chart, or record it
- Use coral/clay anywhere but markers, or mustard anywhere but sentence selection
- Turn motion on by default, add looping animation, or animate outside `--motion-duration`
- Use emoji, gradients, glow or blur
- Use grey placeholders, stock imagery or childish illustration
- Invent statistics, streaks, badges or achievements; label any sample data as an example
- Show controls with nothing behind them (search, accounts, "View all")
- Repeat the same white card for every section

## Accessibility

- Every interactive element is keyboard-accessible with a visible focus ring
- No information is conveyed by colour alone
- Comfortable text spacing; respect browser zoom (use rem, never fixed px for reading text)
- Motion is off by default; when turned on, `prefers-reduced-motion` still turns it off
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
interface Story    { id: string; title: string; description: string; category: string; readMinutes: number; sections: Section[] }

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
`explain(story, sentenceId, level): Promise<Explanation>`. It POSTs to `/api/explain` with the
whole story as one text (all sentences joined with spaces) so sentence ids match the backend.
There is no frontend mock. Never show `checks` to students.
## Bring your own reading (Phase 5)

Own readings live on the shelf. Its first item is a plain "Add your own reading" cover (hairline
border, plus icon, no art) that opens the paste box and Upload file directly under the shelf.
Paste and upload share one pipeline (`LibraryPage` → `services/reading.ts`):
(`POST /upload` →) `POST /prepare` → `saveOwnReading` → `/read/:id`, the normal reading screen.
Saved readings are kept in localStorage (`readingbridge.own`, newest first, at most 10) with
unique `own-…` ids and a typographic cover (title, "Your reading", ruled strip). Each has a
"Remove" link with a "Remove this reading? Yes / Cancel" step; library stories cannot be removed.
They work with Continue reading, bookmarks, My Reading and the reading log. While working, show only plain status text ("Reading your file…",
"Finding the tricky parts…"); show backend error messages as they are.

- `/upload`: `.txt` or text-based `.pdf` (pypdf), max 2 MB; scanned PDFs get 422; no OCR.
- `/prepare`: max 5,000 characters. Paragraphs (blank lines) become sections; sentence ids come
  from `split_sentences` over the whole text, so they match `/explain`. Markers come from
  `MARKERS_SYSTEM` and are checked in code: real ids, known types, one per sentence, at most
  `max(1, sentences // 3)`. If the model fails, the story comes back without markers.
- PDF extraction loses blank lines, so a PDF usually becomes one section.
- Own readings are never added to the built-in library or to the Progress page.
