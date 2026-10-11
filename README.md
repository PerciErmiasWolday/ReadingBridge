# ReadingBridge

ReadingBridge is a reading app designed with autistic readers in mind: students who read the words
well but can miss what a story implies — a feeling, a figure of speech, who "she" is, or why
something happened. Reading comes first; help appears only when the student asks. They tap a
quiet marker or any sentence and get a short, literal explanation that quotes its evidence from the
story, or an honest "The story doesn't tell us this."

![The ReadingBridge Library](docs/screenshots/library.png)

## Setup

You need Python 3.11+ and Node 20+.

**Backend** (FastAPI, port 8000)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...        # your own key; never commit it
uvicorn main:app --port 8000
```

`backend/.env.example` lists the two variables the backend reads. The backend does not load a
`.env` file itself: set them with `export` in the terminal that runs uvicorn. `.env` files are
git-ignored.

**No key?** Run in fake mode instead: `FAKE_LLM=1 uvicorn main:app --port 8000`. This is
**mock data**: only "Maya's heart beat quickly." gets a canned explanation, every other sentence
gets "The story doesn't tell us this.", and pasted text gets one canned marker.

**Frontend** (React, port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The dev server forwards `/api/*` to the backend on port 8000.

**Checks:** in `frontend`: `npm run build`, `npm run lint`, `npm test`, `npm run format:check`.
In `backend`: `pytest -q`.

## Sample inputs

- **Library stories** (on the shelf): *The New Student*, *The Science Fair*, *Two Friends at the
  Park*. Each has markers and an optional quiz per section.
- **Files to upload** ("Add your own reading" → Upload file):
  - `backend/samples/new_student.txt` — plain text
  - `backend/samples/two_friends.pdf` — a PDF with a text layer
  - `backend/samples/scanned_page.pdf` — a page with no text, to see the "scanned page" message
- **Passages to paste:**
  - Idiom: `The test was on Friday, so Kofi hit the books every night. On Thursday he finally felt ready.`
  - Ambiguous pronoun: `Ben and Sam raced their bikes to the corner shop. He got there first and laughed. Then they bought two cold drinks.`

## How it works

1. **Upload** (`POST /upload`): a `.txt` or text-based `.pdf` (max 2 MB) becomes plain text.
2. **Prepare** (`POST /prepare`): paragraphs become sections; `split_sentences` numbers every
   sentence, so the frontend and the model always point at the same sentence ids.
3. **Markers**: the model suggests which sentences need an inference; code keeps only real ids and
   known types, one per sentence, at most one per three sentences.
4. **Explain** (`POST /explain`): the model sees the numbered story and the tapped sentence, and
   returns a meaning plus a `clue_quote` copied from the story.
5. **Grounding checks** (`backend/grounding.py`): the quote must appear in the story word for word,
   answers have length limits, no figurative language, feelings must say "probably". One failed
   check gets one retry; a second failure shows "The story doesn't tell us this." instead of a guess.

The help card opens directly under the sentence, and the quoted evidence is underlined in the story.

## Evaluation

30 hand-written explanation cases (20 dev, 10 holdout) and 5 marker passages, run with
`backend/eval/run_eval.py`. Details, examples and caveats: [`docs/evaluation.md`](docs/evaluation.md).

| metric | v1 dev | final dev | v1 holdout | final holdout |
|---|---|---|---|---|
| passed the grounding checks first try | 18/20 | 20/20 | 10/10 | 10/10 |
| fell back to "doesn't tell us" | 2/20 | 0/20 | 0/10 | 0/10 |
| "doesn't say" decision correct | 14/20 | 17/20 | 8/10 | 8/10 |
| said "doesn't say" when it should | 0/4 | 1/4 | 0/2 | 0/2 |
| said "doesn't say" wrongly (over-correction) | 2/16 | 0/16 | 0/8 | 0/8 |
| meaning keyword hit | 11/16 | 11/16 | 8/8 | 6/8 |
| best clue quoted | 7/16 | 8/16 | 3/8 | 3/8 |

| markers | precision | recall | on stated feelings |
|---|---|---|---|
| v1 | 5/13 | 5/14 | 3 |
| final | 9/13 | 9/14 | 1 |

**These are small, single runs** (`gpt-4o-mini`, temperature 0.2): a difference of one or two cases
is noise. Keyword matching is approximate. Case-study tests: [`docs/test-results.md`](docs/test-results.md).

## Mock data and what is not built

- **Fake mode** (`FAKE_LLM=1`) uses canned answers from `backend/fake_llm.py`. It is mock data.
- **My Reading and Progress** show only the reader's own activity. "See an example" shows
  **sample data**, labelled "Example — sample data, not your reading" wherever it appears.
- **No OCR.** Scanned PDFs are refused with a message.
- **PDFs lose paragraph breaks**, so an uploaded PDF usually becomes one section.
- **No accounts.** Everything (saved readings, progress, bookmarks, settings) lives in this
  browser's localStorage; nothing is synced.
- **Ambiguous pronouns still often get a confident guess** (e.g. "'he' refers to Ben" when the
  story never says). This is the main known weakness; see `docs/evaluation.md`.

## Tools and reused work

- **Frontend:** started from the official Vite `react-ts` template. React 19, TypeScript, React
  Router, Tailwind CSS 3, Lucide icons, Vitest and React Testing Library, ESLint and Prettier.
- **Fonts** (self-hosted via @fontsource): Instrument Serif, Instrument Sans, Source Serif 4,
  Atkinson Hyperlegible.
- **Backend:** FastAPI, uvicorn, Pydantic, pypdf, python-multipart, pytest, httpx.
- **AI:** the OpenAI API (`gpt-4o-mini`) for explanations and markers.
- **Backend origin:** the first version of `backend/` was built in a separate session and added in
  Phase 1. [YOU: confirm who or what built it]
- **Cover art and illustrations** are original SVG drawings made for this project. The design
  reference mockups are in `docs/design/`.

## Privacy

No real student work was used: every story and passage in the repository was written for this
project. A real deployment would need, at least: consent from the school and families; an API
agreement that does not keep or train on student text; a decision about the explanation log
(`backend/logs/explain.jsonl` stores the model's answers, which quote the story); clear rules for
how long anything is kept; and a check against the local rules for children's data. Right now,
pasted and uploaded text is sent to the backend and to OpenAI to be split, marked and explained.
