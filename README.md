# ColorWalk

ColorWalk is a private daily color-walk app. It gives the user a weather/time-based mood color mission, lets them collect up to eight surrounding photos into a 3x3 color grid, saves a short journal entry, and builds a visual history without social comparison.

## Stack

- React + Vite + TypeScript
- Tailwind CSS with shadcn-style local components
- Zustand
- Supabase Auth, Postgres, Storage
- Open-Meteo weather API
- Capacitor Android
- Vitest

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` needs:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_AUTH_EMAIL_DOMAIN=...
```

This workspace already has `.env.local` configured for the existing ColorWalk Supabase project. The file is ignored by git.
ColorWalk no longer shows a browser invite-code gate. Beta access is handled by the username/password account flow and the shared beta test account.
`VITE_AUTH_EMAIL_DOMAIN` is used only to map a simple username to Supabase email/password auth. For the current beta code, use a deliverable-looking domain such as `gmail.com` unless you configure your own domain.

## Supabase

The database schema and storage policies were applied to the existing project `nhsvmypztjyhqunixxeg`.

Required Dashboard setting:

- Auth -> Sign In / Providers -> Anonymous sign-ins: enabled
- Auth -> Sign In / Providers -> Email: enabled

The app now shows a signup/login screen before the main app when Supabase is configured. Because Supabase password auth is email-based, ColorWalk maps the visible username to an internal beta email address. Signup goes through the `beta-signup` Edge Function so the service role key stays server-side and new beta users can receive an immediate confirmed session without exposing admin credentials in the frontend.

After enabling anonymous sign-ins, run:

```bash
npm run verify:supabase
```

The script signs in anonymously, confirms anonymous data writes are blocked, signs in with the beta test account, upserts a profile, uploads WebP images to `post-images`, inserts/selects/updates a 3x3-grid post, and cleans up the test data.
It also verifies profile beta metadata, DB color-name suggestions, story/grid metadata persistence, signed image access, and confirms another user cannot read the post or create a signed URL for the uploaded images.

## PWA

The app includes a web manifest and service worker. For a deployed HTTPS web beta, testers can open the link and use the browser install action:

- Chrome/Android: menu -> Add to Home screen or Install app
- iOS Safari: Share -> Add to Home Screen

Native Android local notifications are available in the Capacitor build. Web/PWA reminders use browser notifications and depend on browser permission and runtime behavior.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
npm run cap:sync
npm run verify:supabase
```

## Android

The Android platform is scaffolded under `android/`.

For local phone install and mobile preview steps, see [docs/beta-testing-guide.md](docs/beta-testing-guide.md).
For friend testing without APK sideloading, see [docs/web-beta-deployment.md](docs/web-beta-deployment.md).
For Play Store Internal testing preparation, see [docs/play-store-internal-testing.md](docs/play-store-internal-testing.md).

To build an APK locally, install JDK 21 and Android SDK. On this PC:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

Then set one of:

```bash
ANDROID_HOME=C:\Users\<you>\AppData\Local\Android\Sdk
```

or create `android/local.properties`:

```properties
sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
```

You can start from `android/local.properties.example`.

Then run:

```bash
cd android
.\gradlew.bat assembleDebug
```

On this machine, the debug APK has been verified at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```
