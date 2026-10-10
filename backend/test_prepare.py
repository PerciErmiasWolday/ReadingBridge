"""Tests for /upload and /prepare with the AI replaced by scripted answers. Run: pytest -q"""
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import main
from text_utils import split_sentences

SAMPLES = Path(__file__).parent / "samples"
TEXT = (
    "Omar had worked on his volcano for three weeks. He carried it into the gym.\n\n"
    "Nothing happened. \"Oh, great,\" Omar said, frowning at the table. He added the soda.\n\n"
    "The volcano foamed over the sides. A judge smiled."
)
client = TestClient(main.app)


@pytest.fixture(autouse=True)
def real_mode(monkeypatch):
    monkeypatch.delenv("FAKE_LLM", raising=False)


def model_returns(monkeypatch, answer):
    monkeypatch.setattr(main, "call_llm", lambda system, user: answer)


def test_sections_follow_paragraphs_and_ids_match_explain(monkeypatch):
    model_returns(monkeypatch, {"markers": []})
    story = client.post("/prepare", json={"title": "Volcano", "text": TEXT}).json()
    sentences = [s for section in story["sections"] for s in section["sentences"]]
    assert [len(section["sentences"]) for section in story["sections"]] == [2, 3, 2]
    assert [s["text"] for s in sentences] == split_sentences(TEXT)
    assert [s["id"] for s in sentences] == list(range(7))
    assert story["id"] == "pasted" and story["category"] == "Own reading" and story["readMinutes"] == 1


def test_markers_are_validated(monkeypatch):
    model_returns(monkeypatch, {"markers": [
        {"sentence_id": 3, "type": "feeling"},
        {"sentence_id": 3, "type": "why"},       # duplicate sentence
        {"sentence_id": 99, "type": "who"},      # no such sentence
        {"sentence_id": 1, "type": "sarcasm"},   # unknown type
        {"sentence_id": 4, "type": "why"},
        {"sentence_id": 6, "type": "feeling"},   # over the cap: 7 sentences allow 2
    ]})
    story = client.post("/prepare", json={"title": "Volcano", "text": TEXT}).json()
    marked = {s["id"]: s["marker"]["type"]
              for section in story["sections"] for s in section["sentences"] if "marker" in s}
    assert marked == {3: "feeling", 4: "why"}


def test_model_failure_returns_story_without_markers(monkeypatch):
    def broken(system, user):
        raise RuntimeError("model unavailable")
    monkeypatch.setattr(main, "call_llm", broken)
    r = client.post("/prepare", json={"title": "Volcano", "text": TEXT})
    assert r.status_code == 200
    assert not any("marker" in s for section in r.json()["sections"] for s in section["sentences"])


def test_prepare_rejects_empty_and_too_long():
    assert client.post("/prepare", json={"text": "   "}).json()["detail"] == "Paste a story first."
    assert client.post("/prepare", json={"text": "a" * 5001}).json()["detail"] == main.TOO_LONG


def test_upload_txt():
    data = (SAMPLES / "new_student.txt").read_bytes()
    r = client.post("/upload", files={"file": ("new_student.txt", data, "text/plain")})
    assert r.status_code == 200
    assert r.json()["title"] == "new_student" and r.json()["text"].startswith("Maya stepped off")


def test_upload_text_pdf():
    data = (SAMPLES / "two_friends.pdf").read_bytes()
    r = client.post("/upload", files={"file": ("two_friends.pdf", data, "application/pdf")})
    assert r.status_code == 200 and "Priya and Jess" in r.json()["text"]


def test_upload_rejects_docx():
    r = client.post("/upload", files={"file": ("story.docx", b"PK...", "application/octet-stream")})
    assert r.status_code == 400 and ".txt and .pdf" in r.json()["detail"]


def test_upload_scanned_pdf_is_refused():
    data = (SAMPLES / "scanned_page.pdf").read_bytes()
    r = client.post("/upload", files={"file": ("scan.pdf", data, "application/pdf")})
    assert r.status_code == 422
    assert r.json()["detail"].startswith("This looks like a scanned page.")
