# AI Assistant Universe

AI Assistant Universe is a responsive static showcase website with an Android APK wrapper. It presents what an AI assistant can do across website creation, coding help, research, document summarization, creative writing, API integration guidance, and automation planning.

> Conflict resolution note: this README keeps the static website documentation and the Android APK build documentation together in one clean version, with no merge-conflict markers.

## Project overview

This repository has two delivery targets that share the same web content:

1. **Static website** — `index.html`, `styles.css`, and `script.js` provide a full-page cosmic themed landing site with a Bengali/English hero, animated particles, glowing gradient blobs, feature cards, configurable scoring, API/access guidance, and responsive navigation.
2. **Android APK version** — the `app/` module wraps the same website in a native Android WebView app. The root website files remain the source of truth and are copied into Android assets at build time.

The website can run without frontend dependencies. The APK build uses Gradle, the Android Gradle Plugin, and a local Android SDK installation.

## Open or run the website

### Option 1: Open directly

Open `index.html` in any modern browser.

### Option 2: Serve locally

From the repository root, run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Build the Android APK

Install the Android SDK, then either set `ANDROID_HOME` or create a `local.properties` file in the repository root:

```properties
sdk.dir=/path/to/Android/Sdk
```

Build a debug APK:

```bash
gradle assembleDebug
```

The generated debug APK will be available at:

```text
app/build/outputs/apk/debug/app-debug.apk
```

For a release APK, configure signing credentials in Gradle or Android Studio, then run:

```bash
gradle assembleRelease
```

## Main features

- Dark cosmic gradient theme with animated glowing blobs and canvas particles.
- Fixed responsive navigation with smooth scrolling and active section highlighting.
- Mobile hamburger menu for smaller screens.
- Feature filtering for build, knowledge, and creative capabilities.
- Configurable capability scoring in `script.js` via an array of `{ label, score }` values.
- Score progress bars that animate when the scoring section scrolls into view.
- API/access section explaining backend access patterns, API key requirements, authentication, and usage limits.
- Android WebView APK wrapper that loads the static site from packaged local assets.
- Responsive cards and content sections that stack cleanly on mobile.

## File structure

```text
/workspace/Jlpt
├── app/
│   ├── build.gradle                       # Android app module build rules
│   └── src/main/
│       ├── AndroidManifest.xml            # App permissions and launch activity
│       ├── java/com/aiassistant/universe/
│       │   └── MainActivity.java          # WebView APK wrapper
│       └── res/values/                    # Android app label and theme
├── build.gradle                           # Android Gradle Plugin declaration
├── gradle.properties                      # Gradle JVM and Android build settings
├── settings.gradle                        # Gradle repository and module settings
├── index.html                             # Website structure and content sections
├── styles.css                             # Cosmic theme, responsive layout, animations
├── script.js                              # Navigation, particles, filters, score rendering
└── README.md                              # Project documentation
```

## Notes for contributors

- Keep `index.html`, `styles.css`, and `script.js` at the repository root as the canonical website files.
- The Android Gradle task `syncWebAssets` copies those files into the APK asset tree during builds.
- Do not commit generated Gradle build folders, APKs, AABs, or `local.properties`.
