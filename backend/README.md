# ReadingBridge backend

Explains the unstated link in a story sentence (feelings, who "he/it" is, why something happened, idioms) in short, literal language for autistic readers.

## Setup
```bash
pip install fastapi uvicorn openai pydantic pytest httpx
export OPENAI_API_KEY=sk-...        # real AI
uvicorn main:app --reload --port 8000
```
No key? `FAKE_LLM=1 uvicorn main:app --port 8000` uses canned answers from `fake_llm.py` (**mock data**).

## Endpoints
- `POST /split` `{story}` → `{sentences: [...]}` (numbered sentences for the frontend)
- `POST /explain` `{story, sentence_id, selected_text?, level: "normal"|"simple"}` →
  `{type, clue_quote, clue, meaning, not_in_text, checks}`

## How wrong answers are caught (`grounding.py`)
1. `clue_quote` must appear word for word in the story.
2. Length limits on clue and meaning.
3. No figurative phrases in the explanation.
4. Feeling answers must say "probably".
If a check fails, the AI gets one retry with the reason. If it fails again, the student sees "The story doesn't tell us this." instead of a guess. `checks` in the response shows what happened.

## Tests
`pytest -q` — the AI is replaced with scripted answers: normal case, invented quote (retry fixes it), invented twice (honest fallback), missing "probably", idiom, empty story, bad sentence ID.

## Sample input
`samples/new_student.txt`
