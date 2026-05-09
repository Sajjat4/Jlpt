# AI Assistant Universe

A responsive static website and Android APK wrapper that showcases what an AI assistant can do across web creation, coding help, research, summarization, creative writing, API guidance, and automation planning.

## Project overview

This project includes two delivery targets:

1. **Static website**: a full-page cosmic themed landing site with a Bengali/English hero, animated particles, glowing gradient blobs, feature cards, configurable scoring, and API/access guidance.
2. **Android APK version**: a native Android WebView app that packages the same website into an installable APK. The website files at the repository root remain the source of truth and are copied into Android assets at build time.

The web version is dependency-free and can be opened directly in a browser or served by any static web server. The Android version uses Gradle and the Android Gradle Plugin.

## How to open or run the website

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

## How to build the APK

Install the Android SDK, then set `ANDROID_HOME` or create `local.properties` with your SDK path:

```properties
sdk.dir=/path/to/Android/Sdk
```

Build a debug APK from the repository root:

```bash
gradle assembleDebug
```

The generated APK will be available at:

```text
app/build/outputs/apk/debug/app-debug.apk
```

For a release APK, configure signing credentials in Gradle or Android Studio and run:

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
