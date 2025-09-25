# Learn Cebuano — Flashcards & Quizzes

A minimal, fast, offline-friendly web app to practice Cebuano vocabulary using flashcards and multiple-choice quizzes. Progress is saved to your browser (localStorage).

## Features
- Flashcards with flip interaction and keyboard shortcuts
- Multiple-choice quizzes with instant feedback
- Direction control: Cebuano → English, English → Cebuano, or Mixed
- Progress tracking per word (score, seen, accuracy)
- Basic stats: mastered count, seen, accuracy
- Shuffle and reset progress
- No build tools required — plain HTML/CSS/JS

## Getting Started
Serve the folder with any static server. Examples:

```bash
# From /workspace
python3 -m http.server 5173
# or
npx serve -l 5173
```

Then open:

- http://localhost:5173

If you open `index.html` directly via file://, some browsers block `fetch()` for local files. Running a local server avoids that.

## Project Structure
- `index.html` — main page with modes (flashcards, quiz, stats)
- `assets/styles.css` — responsive UI styles
- `scripts/app.js` — client-side logic
- `data/cebuano.json` — vocabulary dataset

## Keyboard Shortcuts (Flashcards)
- Space: flip
- 1: Again (–1)
- 2: Good (+1)
- 3: Easy (+2)

## Notes
- Your progress is stored under `localStorage` keys `cebuano-learner-progress-v1` and `cebuano-learner-settings-v1`.
- The app includes a small fallback dataset if `data/cebuano.json` cannot be loaded.