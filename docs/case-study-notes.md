# ReadingBridge: case-study notes

**User and problem.** Students, often autistic, who read the words well but miss what a story
implies: feelings, figurative language, who a pronoun means, cause and effect.
[YOU: who you had in mind and why this matters to you]

**First approach.** A calm reader where help appears only when asked: tap a marked sentence or any
sentence, get a short literal explanation that quotes its evidence, or "The story doesn't tell us
this." **Assumption to test:** a confused student notices the confusion and taps for help.
[YOU: how you planned to test this]

## Key decisions (in commit order, 10 October 2026)

1. **React + Vite frontend, FastAPI backend** (Phase 1). [YOU: why React rather than Streamlit]
2. **Shared sentence ids** (Phase 1). Story data is generated with the backend's `split_sentences`,
   so the app and the model always mean the same sentence; ids are never typed by hand.
3. **Grounding checks** (backend, from the start). The quoted evidence must appear in the story word
   for word; a second failure shows "The story doesn't tell us this." rather than a guess.
4. **Help never covers the text** (Phase 3), then **help directly under the sentence**: the paragraph
   breaks at that sentence and continues below the card.
5. **Calm defaults** (redesign): motion off unless the student turns it on; one marker colour; no
   scores, streaks or badges; **asking for help is never counted or recorded**.
6. **Click-only markers** (fix-ups): hovering only underlines; nothing opens by accident.
7. **Own reading through the same pipeline** (Phase 5): paste or upload → sections → AI markers,
   validated in code.
8. **Quiz is optional** (Phase 4): only behind "Quiz me on this", never scored or stored.
9. **Measure before changing prompts** (Phase 6): a 30-case eval with dev and holdout splits;
   prompts changed on dev only, holdout run once.

## Three test results (from `docs/test-results.md`)

- **Normal**, "Maya's heart beat quickly.": correct meaning ("probably nervous"), but the clue quotes
  the sentence itself rather than "Then she looked down at her shoes." Partly unresolved.
- **Difficult**: "Oh, great," gives the right feeling but does not say the words mean the opposite.
  A pasted ambiguous pronoun ("Ben and Sam… He got there first") got "'he' refers to Ben".
  **Fail, unresolved.**
- **Invalid**: empty paste, a `.docx` upload and a scanned PDF each give a plain message. Pass.

## Tools used

OpenAI API (`gpt-4o-mini`), Vite `react-ts` template, React, Tailwind, FastAPI, pypdf, Vitest,
pytest.
[YOU: your own role]

**Time spent:** [YOU: fill in]

## Known limitations

- Ambiguous pronouns: 1 of 3 eval cases says "doesn't say"; the rest get a confident guess.
- Clues are often weaker than the best evidence; missing facts get a different inference.
- No OCR; PDFs lose paragraph breaks; no accounts (everything is in one browser).
- Small, single-run evaluation: one or two cases of difference is noise.

## Reused work

Vite `react-ts` template; open-source libraries and @fontsource fonts (see README); the first
`backend/` from a separate session [YOU: confirm]. Cover art and illustrations are original SVG.
