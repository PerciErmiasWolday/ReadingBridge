"""Canned AI answers for running without an API key (FAKE_LLM=1). MOCK DATA — clearly labelled."""
import re


def fake_answer(user_message: str) -> dict:
    msg = user_message.lower()
    if "heart beat quickly" in msg.split("stuck on")[1]:
        return {
            "type": "feeling",
            "clue_quote": "Then she looked down at her shoes.",
            "clue": "Her heart beat fast and she looked at her shoes. People do this when they are nervous.",
            "meaning": "Maya probably feels nervous about talking in front of the new class.",
            "not_in_text": False,
        }
    return {"type": "other", "clue_quote": "", "clue": "", "meaning": "", "not_in_text": True}


def fake_markers(sentences: list[str]) -> list[dict]:
    """Mark the first sentence with "heart", "said" or "she" as a feeling. MOCK DATA."""
    for index, sentence in enumerate(sentences):
        if re.search(r"\b(heart|said|she)\b", sentence, re.IGNORECASE):
            return [{"sentence_id": index, "type": "feeling"}]
    return []
