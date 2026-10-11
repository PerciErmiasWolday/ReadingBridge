"""Split a story into numbered sentences, so the AI can point at sentence IDs."""
import re

def normalize(text: str) -> str:
    """Make quote marks and spacing consistent so exact-match checks are fair."""
    text = text.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
    return re.sub(r"\s+", " ", text).strip()


TITLE = re.compile(r"\b(?:Mr|Mrs|Ms|Dr|Prof|St)\.$")


def split_sentences(story: str) -> list[str]:
    story = normalize(story)
    if not story:
        return []
    # A sentence = text up to . ! or ? plus an optional closing quote, then a space or the end.
    parts = re.findall(r'.+?[.!?]"?(?=\s+["A-Z0-9]|\s*$)|.+$', story)
    sentences: list[str] = []
    for part in (p.strip() for p in parts if p.strip()):
        # Keep going after a title ("Mr.") or while a quotation is still open.
        if sentences and (TITLE.search(sentences[-1]) or sentences[-1].count('"') % 2):
            sentences[-1] += " " + part
        else:
            sentences.append(part)
    return sentences


def number_sentences(sentences: list[str]) -> str:
    return "\n".join(f"[{i}] {s}" for i, s in enumerate(sentences))
