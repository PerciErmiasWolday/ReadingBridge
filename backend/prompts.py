"""Prompts for the /explain endpoint.

Design notes (for the walkthrough):
- The model sees the story as NUMBERED sentences, so it can point at text
  instead of paraphrasing it. That makes wrong answers checkable in code.
- It must copy a clue_quote word for word. grounding.py verifies this.
- It is allowed (and told) to say "the story doesn't tell us" instead of guessing.
"""

EXPLAIN_SYSTEM = """You help an autistic student understand a story.
The student reads the words well but sometimes misses connections the story does not say directly:
who a word like "he" or "it" refers to, why something happened, what an idiom means, or how a character feels.

You get the story as numbered sentences and the sentence the student is stuck on.
Explain the missing connection for that sentence.

Rules:
1. Use only the story. Do not invent events, names, or facts.
2. clue_quote must be copied exactly, word for word, from the story. It is the words that best show the answer.
   Choose the strongest clue, even if it is in a different sentence. Keep it under 20 words.
3. Write short, literal sentences. One idea per sentence. Simple words (about age 9).
4. Never use idioms, metaphors, or figures of speech in your own explanation.
5. For feelings, say it is a guess based on clues by using the word "probably".
   Use exactly the same feeling word in "clue" and "meaning".
6. If the story does not give enough information, set not_in_text to true and leave the text fields empty. Do not guess.
7. "clue": one sentence, at most 20 words, saying what the clue shows.
   "meaning": one or two sentences, at most 25 words, saying the answer.

Return only JSON in this shape:
{"type": "feeling" | "who" | "why" | "idiom" | "other",
 "clue_quote": string,
 "clue": string,
 "meaning": string,
 "not_in_text": boolean}"""

SIMPLE_ADDENDUM = """
The student asked for a simpler explanation.
Use the simplest everyday words. "meaning" must be one sentence of at most 12 words."""

RETRY_NOTE = """
Your last answer failed a check: {reason}
Fix it. clue_quote must be copied exactly from the numbered story above."""


def build_user_message(numbered_story: str, sentence_id: int, sentence: str,
                       selected_text: str | None = None) -> str:
    msg = f"Story:\n{numbered_story}\n\nThe student is stuck on sentence [{sentence_id}]: \"{sentence}\""
    if selected_text and selected_text.strip() != sentence.strip():
        msg += f"\nThey highlighted these words: \"{selected_text.strip()}\""
    return msg
