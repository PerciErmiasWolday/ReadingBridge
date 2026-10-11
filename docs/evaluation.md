# Evaluation: explanations and markers

How well does ReadingBridge explain the unsaid parts of a story, and does it admit when the story
doesn't say? This page compares the **v1** baseline with the **final** prompt on a fixed set of
hand-written cases.

- Cases: `backend/eval/explain_cases.jsonl` (30) and `backend/eval/marker_cases.jsonl` (5 passages)
- Runner: `backend/eval/run_eval.py` calls the same functions the endpoints use, with the real model
  (`gpt-4o-mini`, temperature 0.2). Raw answers are in `backend/eval/results/<label>-explain.jsonl`.
- Re-run: `cd backend && python eval/run_eval.py --label <name> --split dev|holdout|all`

## The case set

| kind | cases | what a good answer does |
|---|---|---|
| feeling | 9 | names the probable feeling and quotes the action or body reaction that shows it |
| who | 6 | 3 resolvable pronouns: names the person. 3 truly ambiguous ones (two people of the same gender, nothing decides): says the story doesn't tell us |
| why | 4 | gives the cause, which may sit in an earlier or later sentence |
| idiom | 5 | gives the real meaning |
| sarcasm | 3 | says the words mean the opposite and points to the clue |
| not in text | 3 | the sentence hides a fact the story never gives: says the story doesn't tell us |

20 cases are **dev** (used to change the prompt) and 10 are **holdout** (run once, at the end, with
the final prompt). Marker passages: the three library stories plus two new ones, each listing the
sentences that need an inference and the sentences that state a feeling outright (which should never
be marked).

**Scoring is partly approximate.** "Meaning keyword hit" checks for any of a few expected words
(e.g. *nervous / worried / anxious*), so a correct answer in other words counts as a miss
("she wants him to do well" for *Break a leg*). "Best clue quoted" checks whether the quoted
evidence lies inside one of the expected sentences. Every miss below was also read by hand.

## Results: v1 vs final

| metric | v1 dev | final dev | v1 holdout | final holdout |
|---|---|---|---|---|
| passed the grounding checks first try | 18/20 | **20/20** | 10/10 | 10/10 |
| fell back to "doesn't tell us" after two failed checks | 2/20 | **0/20** | 0/10 | 0/10 |
| "doesn't say" decision correct (all cases) | 14/20 | **17/20** | 8/10 | 8/10 |
| said "doesn't say" when it should (ambiguous pronoun / missing fact) | 0/4 | 1/4 | 0/2 | 0/2 |
| said "doesn't say" when there is an answer (over-correction) | 2/16 | **0/16** | 0/8 | 0/8 |
| meaning keyword hit | 11/16 | 11/16 | 8/8 | 6/8 |
| best clue quoted | 7/16 | 8/16 | 3/8 | 3/8 |

v1's two dev "over-corrections" were not the model refusing: they were the quote-mark fallbacks
(below). The two holdout keyword misses in the final run are wording, not wrong answers: "he folded
the letter and **hid** it" (the keyword was *hide*) and "he is being sarcastic because his day is
going badly" (no *opposite* / *unlucky*).

### Markers (5 passages; same cases for every run)

| | precision | recall | markers on stated feelings |
|---|---|---|---|
| v1 | 5/13 | 5/14 | 3 |
| final | **9/13** | **9/14** | 1 |

v1 marked "everything felt unfamiliar" and "Maya felt a little more relaxed" (feelings the story
states) and missed the backpack strap and "Then she looked down at her shoes". The final prompt
marks the strap, the heartbeat and the shoes.

### Dev iterations (dev only; holdout untouched until the end)

| | first try | fell back | "doesn't say" correct | when it should | over-correction | keyword | clue |
|---|---|---|---|---|---|---|---|
| v2 | 19/20 | 1/20 | 17/20 | 2/4 | 1/16 | 11/16 | 9/16 |
| v3 | 20/20 | 0/20 | 17/20 | 1/4 | 0/16 | 11/16 | 8/16 |
| v4 | 20/20 | 0/20 | 18/20 | 2/4 | 0/16 | 11/16 | 7/16 |

- **v2** added the "doesn't tell us" rules, "explain the one link in this sentence", stronger clue
  rules and the marker rules. The model then invented a `"sarcasm"` type, failed the type check twice
  and fell back; and it explained *who* "Dad" is instead of *why* he lit candles.
- **v3** said to use type `other` for sarcasm, to explain *why* for actions (the reason may come
  later), and never to explain who a named person is. No fallbacks, no over-correction.
- **v4** added a fixed order (vague word first, then pronoun, then why). It got one more
  "doesn't say" right, but the sarcasm rule leaked into idioms: *Break a leg* became "the words mean
  the opposite" and *in the bag* became "Coach was being sarcastic". Those are wrong explanations,
  and for this audience worse than a missing one, while the one extra correct case is within
  run-to-run noise.
- **Final = v3.** Chosen on dev only; the holdout was then run once and the prompt was not changed
  afterwards. The final and v4 prompt texts are kept in `backend/eval/results/`.

## Before and after

**"Maya's heart beat quickly."** (feeling, dev)

| | clue quote | meaning |
|---|---|---|
| v1 | "It was her first day at a new school, and everything felt unfamiliar." | Maya's heart beat quickly because she was probably nervous about being in a new place. |
| final | "Maya's heart beat quickly." | Maya is probably feeling nervous about being in a new school. |

The meaning is right in both. The clue is still not the strongest one: the expected evidence is
"Then she looked down at her shoes." v1 quoted a background fact; the final prompt quotes the
sentence itself, despite the instruction to prefer a nearby action.

**"He got there first and laughed."** (Tom and Leo raced to the gate; ambiguous pronoun, dev)

| | not_in_text | meaning |
|---|---|---|
| v1 | false | The word "He" refers to Tom, who got to the gate first. |
| final | **true** | The story doesn't tell us who "he" refers to. It could be Tom or Leo. |

A confident guess presented as fact became an honest answer. (The app shows only "The story doesn't
tell us this.")

**"At the door, she patted his shoulder and said, "Break a leg.""** (idiom, dev)

| | checks | meaning shown to the student |
|---|---|---|
| v1 | failed, failed → fallback | The story doesn't tell us this. |
| final | passed | "Break a leg" means she wants him to do well at the science fair. |

## The quote-mark lesson

In v1 both fallbacks happened on correct answers. The model copied the evidence but wrote the
story's double quotes as single quotes (`said, 'Break a leg.'`). The grounding check requires the
quote to appear word for word, so it rejected the answer twice and the student was told
"The story doesn't tell us this." about an idiom the model had understood.

The fix changes only the comparison: `'` and `"` (and their curly forms) count as the same mark
(`grounding.py`). Nothing else about the check was loosened. The frontend's evidence underline uses
the same rule. A backend test replays the exact v1 answer.

A related lesson came from the splitter: `Mr.` ended a sentence, and a quotation with two sentences
inside (`"I'm new here too. Want to sit together at lunch?"`) was cut in half, leaving a stray `"` on
each piece. `split_sentences` now keeps titles (Mr, Mrs, Ms, Dr, Prof, St) and open quotations
together. Library data, quiz evidence and eval cases were regenerated from the new splitter by
sentence text, and the key for saved own readings moved to `readingbridge.own.v2`.

## What is still wrong

1. **Ambiguous pronouns are still often guessed.** Final: 1 of 2 dev and 0 of 1 holdout ambiguous
   pronouns got "doesn't say" ("Grace told Hannah that she had won the prize" → "she refers to
   Grace"). This is the most important open problem: a confident guess about who did something.
2. **Missing facts get a different, answerable link instead.** "Inside was the thing she had wanted
   for months" → "Zoe is excited…"; "Ivy packed one more thing…" → "because she was getting ready
   for her trip". These are reasonable inferences, not invented facts, but they dodge the gap the
   student asked about.
3. **Clue choice is weak (8/16 dev, 3/8 holdout).** The model often quotes the tapped sentence
   itself, and sometimes a sentence that *names* a different feeling ("She felt nervous as people
   started to arrive" as evidence for "Ana grinned all the way home") despite the rule against it.
4. **Markers miss implied feelings in quiet passages.** In *The letter* only "He did not come down
   for dinner" is marked; "folded it very small" and "told his mum that everything was fine" are not.
5. **The numbers are small and noisy.** Each figure is a single run at temperature 0.2, so one case
   can flip between runs (who-4 passed in v3 and failed in v4 with nearly the same wording).
   Treat differences of one or two cases as noise.

Likely next steps: send the marker type with the request so the model knows which link was flagged;
a dedicated check that refuses a "who" answer when two same-gender characters fit; and repeated runs
to average out noise.
