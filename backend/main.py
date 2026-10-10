"""ReadingBridge backend: POST /explain.

Run:  uvicorn main:app --reload --port 8000
Env:  OPENAI_API_KEY=...   (or FAKE_LLM=1 to run without a key, using canned answers)
"""
import json
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import grounding
from prompts import EXPLAIN_SYSTEM, RETRY_NOTE, SIMPLE_ADDENDUM, build_user_message
from text_utils import number_sentences, split_sentences

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
NOT_IN_TEXT = {
    "type": "other", "clue_quote": "", "clue": "",
    "meaning": "The story doesn't tell us this.", "not_in_text": True,
}

app = FastAPI(title="ReadingBridge")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class ExplainRequest(BaseModel):
    story: str = Field(..., description="The full passage")
    sentence_id: int = Field(..., ge=0)
    selected_text: str | None = None
    level: str = Field("normal", pattern="^(normal|simple)$")


class SplitRequest(BaseModel):
    story: str


def call_llm(system: str, user: str) -> dict:
    """Call OpenAI and return parsed JSON. Swapped out in tests and FAKE_LLM mode."""
    if os.getenv("FAKE_LLM"):
        from fake_llm import fake_answer
        return fake_answer(user)
    from openai import OpenAI
    client = OpenAI()
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
    )
    try:
        return json.loads(resp.choices[0].message.content)
    except json.JSONDecodeError:
        return {}


@app.post("/split")
def split(req: SplitRequest):
    sentences = split_sentences(req.story)
    if not sentences:
        raise HTTPException(400, "Paste a story first.")
    return {"sentences": sentences}


@app.post("/explain")
def explain(req: ExplainRequest):
    sentences = split_sentences(req.story)
    if not sentences:
        raise HTTPException(400, "Paste a story first.")
    if req.sentence_id >= len(sentences):
        raise HTTPException(400, f"Sentence {req.sentence_id} doesn't exist in this story.")

    simple = req.level == "simple"
    system = EXPLAIN_SYSTEM + (SIMPLE_ADDENDUM if simple else "")
    user = build_user_message(number_sentences(sentences), req.sentence_id,
                              sentences[req.sentence_id], req.selected_text)

    checks = []
    for attempt in range(2):  # first try + one retry with the failure reason
        result = call_llm(system, user)
        reason = grounding.check(result, req.story, simple)
        checks.append(reason or "passed")
        if reason is None:
            return {**result, "sentence_id": req.sentence_id, "checks": checks}
        user += RETRY_NOTE.format(reason=reason)

    # Both attempts failed the checks: say so honestly instead of showing a guess.
    return {**NOT_IN_TEXT, "sentence_id": req.sentence_id, "checks": checks, "fallback": True}
