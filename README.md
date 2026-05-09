# AI Assistant Universe

A responsive static website that showcases what an AI assistant can do across web creation, coding help, research, summarization, creative writing, API guidance, and automation planning.

## Project overview

This project is a full-page cosmic themed landing site with a Bengali/English hero, animated particles, glowing gradient blobs, feature cards, a configurable scoring system, and practical API/access guidance. It is intentionally dependency-free so it can be opened directly in a browser or served by any static web server.

## How to open or run

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Serve locally

From the project directory, run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Main features

- Dark cosmic gradient theme with animated glowing blobs and canvas particles.
- Fixed responsive navigation with smooth scrolling and active section highlighting.
- Mobile hamburger menu for smaller screens.
- Feature filtering for build, knowledge, and creative capabilities.
- Configurable capability scoring in `script.js` via an array of `{ label, score }` values.
- Score progress bars that animate when the scoring section scrolls into view.
- API/access section explaining backend access patterns, API key requirements, authentication, and usage limits.
- Responsive cards and content sections that stack cleanly on mobile.

## File structure

```text
/workspace/Jlpt
├── index.html   # Page structure and content sections
├── styles.css   # Cosmic theme, responsive layout, animations
├── script.js    # Navigation, particles, filters, score rendering
└── README.md    # Project documentation
```
