# JLPT Scanner & Number Quiz

A mobile-first static web app for scanning study material with browser OCR and practicing JLPT-style appendix number readings/kanji. The interface is inspired by iOS: light surfaces, rounded cards, soft shadows, large touch-friendly controls, and responsive layouts for phones first.

## Main features

- **OCR / Scanner**
  - Open the device camera, capture a frame, or upload an image.
  - Run OCR in the browser with Tesseract.js from the CDN.
  - Choose Japanese, English, Bengali, or Japanese + English recognition.
  - View scanned text, copy it, save it locally, or download it as a `.txt` file.

- **JLPT Appendix Number quiz**
  - Enter how many questions to generate, from 1 to 50.
  - Questions are generated from a Japanese number bank with kanji and accepted kana/romaji readings.
  - Each question includes answer input, Check, Voice, and Answer buttons.
  - Correct answers show a green tick state; wrong answers show a red cross state and reveal the accepted answer.
  - Scoreboard tracks score percentage, total questions, correct answers, wrong answers, and answered questions.

- **UI / UX**
  - iPhone/iOS-inspired minimalist visual design.
  - Rounded glass cards, soft shadows, big controls, and sticky quiz summary.
  - Mobile-first responsive layout with light theme and automatic dark mode support.

## How to open or run

### Option 1: Open directly

Open `index.html` in a modern browser. Camera access generally requires HTTPS or `localhost`, so local serving is recommended for the scanner camera feature.

### Option 2: Serve locally

From the project directory, run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## File structure

```text
/workspace/Jlpt
├── index.html                  # Page structure and app mount points
├── styles.css                  # iOS-inspired responsive theme
├── script.js                   # App bootstrap and smooth scrolling
├── src
│   ├── components
│   │   ├── quiz.js             # Quiz UI, validation interactions, score rendering
│   │   └── scanner.js          # Camera/upload OCR UI, copy/save/download actions
│   ├── data
│   │   └── jlptNumbers.js      # Japanese number question bank
│   └── utils
│       └── quiz.js             # Quiz generation, validation, and summary helpers
└── README.md                   # Project documentation
```

## Notes

- OCR depends on the public Tesseract.js CDN and browser support for WebAssembly/Workers.
- Camera capture uses `navigator.mediaDevices.getUserMedia`, which is available only in secure browser contexts such as HTTPS or `localhost`.
