"""ReadingBridge backend: POST /explain.

Run:  uvicorn main:app --reload --port 8000
Env:  OPENAI_API_KEY=...   (or FAKE_LLM=1 to run without a key, using canned answers)
"""
import io
import json
import logging
import os
import re
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader

import grounding
from prompts import EXPLAIN_SYSTEM, MARKERS_SYSTEM, RETRY_NOTE, SIMPLE_ADDENDUM, build_user_message
from text_utils import normalize, number_sentences, split_sentences

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
LOG_PATH = Path(__file__).parent / "logs" / "explain.jsonl"
MAX_UPLOAD_BYTES = 2 * 1024 * 1024
MAX_STORY_CHARS = 5000
TOO_LONG = "This is longer than ReadingBridge can handle right now. Try a shorter passage."
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


class PrepareRequest(BaseModel):
    title: str = "Your reading"
    text: str


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


def log_explain(response: dict, level: str) -> dict:
    """Append one /explain response as a JSON line, for later evaluation."""
    LOG_PATH.parent.mkdir(exist_ok=True)
    with LOG_PATH.open("a") as f:
        f.write(json.dumps({"sentence_id": response["sentence_id"], "level": level,
                            "response": response}) + "\n")
    return response


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """Read a .txt or text-based .pdf file and return its title and text. No OCR."""
    stem, ext = os.path.splitext(file.filename or "")
    if ext.lower() not in (".txt", ".pdf"):
        raise HTTPException(400, "ReadingBridge can open .txt and .pdf files only.")
    data = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, "This file is larger than 2 MB. Try a shorter file.")
    if ext.lower() == ".txt":
        text = data.decode("utf-8-sig", errors="replace")
    else:
        try:
            text = "\n\n".join(page.extract_text() or "" for page in PdfReader(io.BytesIO(data)).pages)
        except Exception:
            raise HTTPException(400, "This PDF could not be opened.")
        if len(text.strip()) < 50:
            raise HTTPException(422, "This looks like a scanned page. ReadingBridge can only read PDFs that contain text.")
    return {"title": stem.strip() or "Your reading", "text": text}


def valid_markers(result, count: int) -> list[dict]:
    """Keep only markers with a real sentence id and a known type, once each, up to the cap."""
    cap = max(1, count // 3)  # at most one marker per three sentences
    markers = result.get("markers") if isinstance(result, dict) else None
    kept, seen = [], set()
    for marker in markers if isinstance(markers, list) else []:
        if not isinstance(marker, dict):
            continue
        sid, kind = marker.get("sentence_id"), marker.get("type")
        if type(sid) is not int or not 0 <= sid < count or kind not in grounding.VALID_TYPES or sid in seen:
            continue
        seen.add(sid)
        kept.append({"sentence_id": sid, "type": kind})
        if len(kept) == cap:
            break
    return kept


def suggest_markers(sentences: list[str]) -> list[dict]:
    """Ask the model which sentences need a marker. Any failure means no markers."""
    if os.getenv("FAKE_LLM"):
        from fake_llm import fake_markers
        return fake_markers(sentences)
    cap = max(1, len(sentences) // 3)
    try:
        result = call_llm(MARKERS_SYSTEM, f"{number_sentences(sentences)}\n\nMark at most {cap} sentences.")
    except Exception:
        logging.getLogger("uvicorn.error").exception("Marker suggestion failed")
        return []
    return valid_markers(result, len(sentences))


@app.post("/prepare")
def prepare(req: PrepareRequest):
    """Turn pasted or uploaded text into a Story shaped like the frontend type."""
    text = req.text.strip()
    if not text:
        raise HTTPException(400, "Paste a story first.")
    if len(text) > MAX_STORY_CHARS:
        raise HTTPException(400, TOO_LONG)

    # Paragraphs become sections. Sentence ids come from the whole text, exactly as /explain
    # splits it; each sentence goes to the paragraph it starts in.
    paragraphs = [p for p in (normalize(p) for p in re.split(r"\n\s*\n", text)) if p]
    whole = " ".join(paragraphs)
    starts, offset = [], 0
    for paragraph in paragraphs:
        starts.append(offset)
        offset += len(paragraph) + 1
    sentences = split_sentences(whole)
    markers = {m["sentence_id"]: m["type"] for m in suggest_markers(sentences)}

    sections: list[list[dict]] = [[] for _ in paragraphs]
    cursor = 0
    for index, sentence in enumerate(sentences):
        at = whole.find(sentence, cursor)
        cursor = at + len(sentence)
        item = {"id": index, "text": sentence}
        if index in markers:
            item["marker"] = {"type": markers[index]}
        sections[max(i for i, start in enumerate(starts) if start <= at)].append(item)

    return {
        "id": "pasted",
        "title": req.title.strip() or "Your reading",
        "description": "",
        "category": "Own reading",
        "readMinutes": max(1, round(len(whole.split()) / 200)),
        "sections": [{"id": f"s{n + 1}", "sentences": items}
                     for n, items in enumerate(s for s in sections if s)],
    }


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
        try:
            result = call_llm(system, user)
        except Exception:
            logging.getLogger("uvicorn.error").exception("OpenAI call failed")
            raise HTTPException(503, "The explanation service is unavailable.")
        reason = grounding.check(result, req.story, simple)
        checks.append(reason or "passed")
        if reason is None:
            return log_explain({**result, "sentence_id": req.sentence_id, "checks": checks}, req.level)
        user += RETRY_NOTE.format(reason=reason)

    # Both attempts failed the checks: say so honestly instead of showing a guess.
    return log_explain({**NOT_IN_TEXT, "sentence_id": req.sentence_id, "checks": checks,
                        "fallback": True}, req.level)
