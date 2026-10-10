"""Code checks that catch plausible-but-wrong AI explanations.

The AI writes the explanation; this file decides whether we are allowed to show it.
"""
from text_utils import normalize

# Figurative phrases we never want in an explanation for a literal reader.
FIGURATIVE = [
    "butterflies", "feeling blue", "on edge", "broke the ice", "cold feet",
    "heart sank", "over the moon", "in a nutshell", "piece of cake",
    "like a fish out of water", "on cloud nine", "down in the dumps",
]
VALID_TYPES = {"feeling", "who", "why", "idiom", "other"}


def check(result: dict, story: str, simple: bool = False) -> str | None:
    """Return None if the explanation passes, otherwise a short reason."""
    if not isinstance(result, dict):
        return "answer was not a JSON object"
    if result.get("not_in_text") is True:
        return None  # an honest "the story doesn't say" is always allowed

    for field in ("clue_quote", "clue", "meaning"):
        if not isinstance(result.get(field), str) or not result[field].strip():
            return f"{field} is missing"
    if result.get("type") not in VALID_TYPES:
        return "type is not one of feeling/who/why/idiom/other"

    quote = normalize(result["clue_quote"]).strip(' ."')
    if quote.lower() not in normalize(story).lower():
        return f'clue_quote "{quote}" is not in the story'
    if len(quote.split()) > 20:
        return "clue_quote is longer than 20 words"

    if len(result["clue"].split()) > 20:
        return "clue is longer than 20 words"
    meaning_limit = 12 if simple else 25
    if len(result["meaning"].split()) > meaning_limit:
        return f"meaning is longer than {meaning_limit} words"

    text = (result["clue"] + " " + result["meaning"]).lower()
    for phrase in FIGURATIVE:
        if phrase in text:
            return f'explanation uses figurative language: "{phrase}"'

    if result["type"] == "feeling" and "probably" not in result["meaning"].lower():
        return 'feeling explanation must say "probably"'
    return None
