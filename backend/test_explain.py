"""Tests for /explain with the AI replaced by scripted answers. Run: pytest -q"""
from fastapi.testclient import TestClient

import main

STORY = (
    "Maya stepped off the bus and held the strap of her backpack a little tighter. "
    "It was her first day at a new school, and everything felt unfamiliar. "
    "In homeroom, the teacher smiled and asked Maya to introduce herself. "
    "Maya's heart beat quickly. She gave a small smile and said, “Hi, I'm Maya.” "
    "Then she looked down at her shoes."
)
client = TestClient(main.app)

GOOD = {"type": "feeling", "clue_quote": "Then she looked down at her shoes.",
        "clue": "She looked at her shoes instead of the class.",
        "meaning": "Maya probably feels nervous.", "not_in_text": False}
INVENTED = {**GOOD, "clue_quote": "Maya started to cry."}  # plausible, but not in the story


def script(monkeypatch, answers):
    calls = iter(answers)
    monkeypatch.setattr(main, "call_llm", lambda s, u: next(calls))


def test_split_sentences():
    r = client.post("/split", json={"story": STORY}).json()
    assert r["sentences"][3] == "Maya's heart beat quickly."
    assert len(r["sentences"]) == 6


def test_normal_case_passes(monkeypatch):
    script(monkeypatch, [GOOD])
    r = client.post("/explain", json={"story": STORY, "sentence_id": 3}).json()
    assert r["meaning"] == "Maya probably feels nervous." and r["checks"] == ["passed"]


def test_invented_quote_is_retried_then_fixed(monkeypatch):
    script(monkeypatch, [INVENTED, GOOD])
    r = client.post("/explain", json={"story": STORY, "sentence_id": 3}).json()
    assert r["checks"][0].startswith("clue_quote") and r["checks"][1] == "passed"


def test_invented_twice_falls_back_to_honest_answer(monkeypatch):
    script(monkeypatch, [INVENTED, INVENTED])
    r = client.post("/explain", json={"story": STORY, "sentence_id": 3}).json()
    assert r["not_in_text"] and r["fallback"] and r["meaning"] == "The story doesn't tell us this."


def test_feeling_without_probably_is_rejected(monkeypatch):
    certain = {**GOOD, "meaning": "Maya feels nervous."}
    script(monkeypatch, [certain, GOOD])
    r = client.post("/explain", json={"story": STORY, "sentence_id": 3}).json()
    assert "probably" in r["checks"][0]


def test_figurative_language_is_rejected(monkeypatch):
    idiom = {**GOOD, "meaning": "Maya probably has butterflies in her stomach."}
    script(monkeypatch, [idiom, GOOD])
    r = client.post("/explain", json={"story": STORY, "sentence_id": 3}).json()
    assert "figurative" in r["checks"][0]


def test_empty_story_is_invalid():
    r = client.post("/explain", json={"story": "   ", "sentence_id": 0})
    assert r.status_code == 400


def test_sentence_out_of_range():
    r = client.post("/explain", json={"story": STORY, "sentence_id": 40})
    assert r.status_code == 400
