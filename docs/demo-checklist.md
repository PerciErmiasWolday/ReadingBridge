# Demo checklist

## Before recording

1. **Files on the desktop** (make these first):
   - `new_student.txt`: copy `backend/samples/new_student.txt`
   - `two_friends.pdf`: copy `backend/samples/two_friends.pdf`
   - `scanned_page.pdf`: copy `backend/samples/scanned_page.pdf`
   - `story.docx`: any file ending in `.docx`, e.g.
     `printf 'not a real document' > ~/Desktop/story.docx`
   - `passages.txt` containing the two passages below, ready to copy

   ```bash
   cd ~/Desktop/ReadingBridge
   cp backend/samples/new_student.txt backend/samples/two_friends.pdf backend/samples/scanned_page.pdf ~/Desktop/
   ```

2. **Backend with your key** (terminal 1). Paste the key yourself; don't show it on screen.

   ```bash
   cd ~/Desktop/ReadingBridge/backend
   source .venv/bin/activate
   export OPENAI_API_KEY=sk-...
   uvicorn main:app --port 8000
   ```

   Keep this terminal visible but out of the recording, so you can see any `503` or errors.

3. **Frontend** (terminal 2):

   ```bash
   cd ~/Desktop/ReadingBridge/frontend
   npm run dev
   ```

4. **Private browser window** so saved readings, progress and settings start empty. Open
   **http://localhost:5173**. Zoom 100–125% so text is readable on video.

5. Check Settings shows the defaults: Book serif, 20px, Comfortable, Ivory, Motion **Off**,
   Show markers on.

## Passages to paste

- Idiom: `The test was on Friday, so Kofi hit the books every night. On Thursday he finally felt ready.`
- Ambiguous pronoun: `Ben and Sam raced their bikes to the corner shop. He got there first and laughed. Then they bought two cold drinks.`

## Order on screen

1. **Library.** Point at the hero, the shelf, "Add your own reading" and "Read for what you want
   to practise". Don't click yet.
2. **The New Student** → **Continue** (section 2) → click the dot after **"Maya's heart beat
   quickly."** Card opens under the sentence, clue underlined. Press **Escape**: the card closes and
   focus returns to the dot.
3. Still in section 2: **Quiz me on this** → choose **Angry** → **Check answer** ("Not quite…") →
   choose **Nervous** → **Check answer** ("Yes.") → **Close**.
4. **← Library** → **The Science Fair** → **Continue** (section 2) → click the dot after
   **'"Oh, great," Omar said, frowning at the table.'**
5. **← Library** → **Add your own reading** → paste the **idiom** passage → **Start reading** →
   click the sentence **"The test was on Friday, so Kofi hit the books every night."** →
   **Help me with this**.
6. **← Library** → **Add your own reading** → paste the **ambiguous pronoun** passage. *Say what
   you expect first* ("the story doesn't tell us who 'he' is"). **Start reading** → click
   **"He got there first and laughed."** → **Help me with this**.
7. Same again, with "Ben and Sam" changed to **"Ben and Ella"**. *Say what you expect first*
   ("'he' has to mean Ben now"). Click the same sentence → **Help me with this**.
8. **Invalid input:** **Add your own reading** → **Start reading** with the box empty
   ("Paste a story first.") → **Upload file** → `story.docx` → **Upload file** →
   `scanned_page.pdf`. Each shows a plain message.
9. **Upload a real file:** **Upload file** → `new_student.txt` (status text, then the reader).
   Optionally `two_friends.pdf`, which becomes one section because PDFs lose paragraph breaks.
10. **Settings:** choose **Night** and **Hyperlegible**; show the preview, then open a story.
11. **My Reading** and **Progress:** show the real entries from this demo, then **See an example**
    and point at the "sample data" label.

## If something goes wrong

- "Couldn't get an explanation": check terminal 1 for a 503 (key, credit or network).
- Answers vary between runs; if step 6 happens to answer correctly, say that it often doesn't
  (see `docs/evaluation.md`).
- To start clean, close the private window and open a new one.
