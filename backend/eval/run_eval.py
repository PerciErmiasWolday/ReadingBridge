"""Score /explain and the /prepare markers against hand-written cases, with the real model.

Usage (from backend/):  python eval/run_eval.py --label v1 [--split dev|holdout|all]
Calls the same functions the endpoints use (no HTTP). Writes eval/results/<label>.json, and the raw
/explain responses to eval/results/<label>-explain.jsonl. Keyword matching is approximate.
"""
import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))

from fastapi import HTTPException  # noqa: E402

import main  # noqa: E402
from text_utils import normalize, split_sentences  # noqa: E402


def load(name: str) -> list[dict]:
    return [json.loads(line) for line in (HERE / name).read_text().splitlines() if line.strip()]


def rate(values: list) -> str:
    scored = [v for v in values if v is not None]
    return f"{sum(scored)}/{len(scored)}" if scored else "-"


def score_explain(case: dict) -> dict:
    sentences = split_sentences(case["story"])
    try:
        r = main.explain(main.ExplainRequest(story=case["story"], sentence_id=case["sentence_id"]))
    except HTTPException as error:
        return {"id": case["id"], "kind": case["kind"], "error": error.detail}
    quote = normalize(r["clue_quote"]).strip(' ."').lower()
    best = [normalize(sentences[i]).lower() for i in case["best_clue_ids"]]
    return {
        "id": case["id"], "kind": case["kind"], "response": r,
        "first_try_passed": r["checks"][0] == "passed",
        "fallback": bool(r.get("fallback")),
        "not_in_text_correct": bool(r["not_in_text"]) == case["expect_not_in_text"],
        # Only scored when the case expects an explanation (not "the story doesn't tell us").
        "meaning_hit": (any(w.lower() in r["meaning"].lower() for w in case["meaning_any"])
                        if case["meaning_any"] else None),
        "best_clue_hit": (bool(quote) and any(quote in s for s in best)) if best else None,
    }


def score_markers(case: dict) -> dict:
    found = {m["sentence_id"] for m in main.suggest_markers(split_sentences(case["story"]))}
    expected, stated = set(case["expected_marker_ids"]), set(case["stated_feeling_ids"])
    return {"id": case["id"], "found": sorted(found), "expected": sorted(expected),
            "correct": len(found & expected), "on_stated_feelings": len(found & stated)}


def main_cli() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", required=True)
    parser.add_argument("--split", choices=["dev", "holdout", "all"], default="dev")
    args = parser.parse_args()
    out = HERE / "results"
    out.mkdir(exist_ok=True)
    main.LOG_PATH = out / f"{args.label}-explain.jsonl"  # keep eval runs out of the app log

    cases = [c for c in load("explain_cases.jsonl") if args.split in ("all", c["split"])]
    explain = [score_explain(c) for c in cases]
    markers = [score_markers(c) for c in load("marker_cases.jsonl")]

    keys = ["first_try_passed", "fallback", "not_in_text_correct", "meaning_hit", "best_clue_hit"]
    print(f"\nExplain — {args.label}, split {args.split}, model {main.MODEL}")
    print(f"{'kind':<12}{'n':>3}  " + "  ".join(f"{k:>19}" for k in keys) + f"{'errors':>8}")
    by_kind = {}
    for kind in [*dict.fromkeys(c["kind"] for c in cases), "ALL"]:
        rows = [r for r in explain if kind in ("ALL", r["kind"])]
        ok = [r for r in rows if "error" not in r]
        by_kind[kind] = {k: rate([r[k] for r in ok]) for k in keys} | {"n": len(rows), "errors": len(rows) - len(ok)}
        print(f"{kind:<12}{len(rows):>3}  " + "  ".join(f"{by_kind[kind][k]:>19}" for k in keys)
              + f"{by_kind[kind]['errors']:>8}")

    found = sum(len(m["found"]) for m in markers)
    expected = sum(len(m["expected"]) for m in markers)
    correct = sum(m["correct"] for m in markers)
    stated = sum(m["on_stated_feelings"] for m in markers)
    summary = {"precision": f"{correct}/{found}", "recall": f"{correct}/{expected}", "on_stated_feelings": stated}
    print(f"\nMarkers — {len(markers)} passages")
    for m in markers:
        print(f"  {m['id']:<14} found {m['found']}  expected {m['expected']}  on stated feelings {m['on_stated_feelings']}")
    print(f"  precision {summary['precision']}   recall {summary['recall']}   on stated feelings {stated}")
    print("\nNote: meaning_hit is approximate keyword matching, and best_clue_hit checks whether the quote"
          " sits inside an expected sentence. Read the raw responses before drawing conclusions.")

    (out / f"{args.label}.json").write_text(json.dumps({
        "label": args.label, "split": args.split, "model": main.MODEL,
        "explain": {"by_kind": by_kind, "cases": explain},
        "markers": {"summary": summary, "cases": markers},
    }, indent=2, ensure_ascii=False))
    print(f"\nWrote {out / (args.label + '.json')}")


if __name__ == "__main__":
    main_cli()
