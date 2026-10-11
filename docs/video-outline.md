# Video outline (8–12 minutes)

Bullet points, not a script. Each part lists what to show and the file or screenshot that proves it.
Follow `docs/demo-checklist.md` to set up before recording.

## 1. Problem and why (1–2 min)

- Who it is for: students who read the words well but miss what is implied. [YOU: your student or
  the situation that started this, without identifying details]
- Why it matters to you. [YOU: why this matters to you]
- On screen: the Library (`docs/screenshots/library.png`), then a story with its quiet markers.
- The principle in one line: reading comes first; help only when asked.

## 2. Approach and decisions (2 min)

- On screen: `backend/prompts.py`, the `EXPLAIN_SYSTEM` prompt. Point at: numbered sentences,
  "say the story doesn't tell us", "copy the quote word for word".
- On screen: `backend/grounding.py`. Point at: quote must be in the story, length limits, no
  figurative language, "probably" for feelings; one retry, then an honest fallback.
- Shared sentence ids: `backend/text_utils.py` `split_sentences` is the one splitter for story data,
  uploads and explanations.
- Calm-by-default decisions, one line each: click-only markers, help under the sentence, motion off,
  quiz optional, help never counted. Proof: `docs/case-study-notes.md`.
- [YOU: why React rather than Streamlit]

## 3. Working product (3–4 min)

- Normal: *The New Student* → Continue → click the marker after "Maya's heart beat quickly." The
  card opens under the sentence; the clue is underlined. (`docs/screenshots/1-normal-heart.png`)
- Sarcasm: *The Science Fair* → Continue → marker after "Oh, great,".
  (`docs/screenshots/2a-difficult-oh-great.png`)
- Optional quiz: "Quiz me on this" → choose "Angry" → "Not quite. Look at this sentence:".
- Live input change. **Say what you expect before each run.**
  - Paste: "Ben and Sam raced their bikes to the corner shop. He got there first and laughed. Then
    they bought two cold drinks." Select "He got there first…" → Help me with this.
    Expect: "The story doesn't tell us this" (two boys, nothing decides). Last test run it guessed
    "Ben" (`docs/screenshots/2b-difficult-ambiguous-pronoun.png`); say so if it happens again.
  - Change "Ben and Sam" to "Ben and Ella" and run again. Expect: "he" now has to mean Ben.
    Point out that the same answer is now right, because the story changed.
- Invalid input: empty paste, the `.docx`, the scanned PDF. (`docs/screenshots/3a…3c`)
- Settings: switch to Night and Hyperlegible, then show the story again.

## 4. What I learned (1–2 min)

- **The "Break a leg" quote-mark lesson:** a correct idiom answer was thrown away because the model
  wrote `'` where the story had `"`. The check was right in spirit but too literal.
  Proof: `docs/evaluation.md` "The quote-mark lesson"; the test in `backend/test_explain.py`.
- **The ambiguous-pronoun failure:** in v1 the model said "doesn't say" in 0 of 6 cases where it
  should have (3 ambiguous pronouns, 3 missing facts). After three prompt versions it is 1 of 6, and
  ambiguous pronouns specifically are 1 of 3. Still unresolved. Proof: the results table in
  `docs/evaluation.md`.
- **The splitter bug:** "Mr." ended a sentence and a two-sentence quotation was cut in half, which
  shifted ids in the data and the quiz. Fixed test-first. Proof: `backend/text_utils.py`, the
  splitter tests.
- Measuring changed decisions: v4 scored one case better but gave wrong idiom meanings, so v3 shipped.
- [YOU: what surprised you most]

## 5. What's next (1–2 min)

- A second-pass check for ambiguous pronouns: if two people of the same kind could fit, refuse a
  "who" answer and show "The story doesn't tell us this."
- The unresolved assumption: does a confused student notice the confusion and tap? Nothing built
  so far tests that.
- The next question for a real user: [YOU: the question you would ask first]
- How to measure whether it helps: [YOU: how you would measure it]. Note that help use is
  deliberately not recorded in the app today, so any measurement would need consent and a
  separate study design.
