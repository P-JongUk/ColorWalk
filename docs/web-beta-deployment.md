# Hueday Web Beta Deployment

This is the fastest way to let friends test Hueday without installing an APK.

## Recommended Free Flow

Use an HTTPS static host such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages. Vercel/Netlify/Cloudflare Pages are easiest for a Vite app because they can serve the app at a root domain without changing Vite `base`.

This repo includes:

- `vercel.json` for Vercel static deployment.
- `.vercelignore` so local env/private reference files are not uploaded.
- `.github/workflows/deploy-pages.yml` as a GitHub Pages fallback.

## Required Environment Variables

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_AUTH_EMAIL_DOMAIN=gmail.com
```

`VITE_SUPABASE_PUBLISHABLE_KEY` is safe for browser use. Never put a Supabase service role key in Vite env vars.

## Build Settings

```text
Build command: npm run build
Output directory: dist
Node install command: npm ci
```

## Vercel

Current live beta:

```text
https://colorwalk-tau.vercel.app
```

Latest production deploy:

```text
dpl_HsbEcLU7JDaZUgy6cvr8DAd9UfkL
https://colorwalk-2vznpjmlx-parkjonguks-projects.vercel.app
Aliased to https://colorwalk-tau.vercel.app
```

The public product name is Hueday, while the repository, Vercel project, Supabase namespace, and some storage keys still use the original `ColorWalk`/`colorwalk` codename for compatibility. The project is linked to Vercel as `parkjonguks-projects/colorwalk`. Because this Windows workspace has very little C-drive space and `vercel build` can collide with locked native `node_modules` files, the successful local deployment path was:

```powershell
$env:npm_config_cache='D:\JongUk\Documents\ColorWalk\.npm-cache'
$env:TEMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:TMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:XDG_DATA_HOME='D:\JongUk\Documents\ColorWalk\.vercel-local\data'
$env:XDG_CONFIG_HOME='D:\JongUk\Documents\ColorWalk\.vercel-local\config'
$env:VERCEL_TELEMETRY_DISABLED='1'
npm run build
# Copy dist into .vercel/output/static and create .vercel/output/config.json.
npx vercel deploy --prebuilt --prod --yes
```

For long-term deployment, importing `P-JongUk/ColorWalk` through the Vercel Git integration is cleaner. Set the required environment variables in Vercel Production and Preview before using Git deployments.

## GitHub Pages Fallback

The workflow builds with `VITE_BASE_PATH=/ColorWalk/` so repository Pages can serve the Vite app from `/ColorWalk/`.

Before running it, add repository secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

And repository variable:

```text
VITE_AUTH_EMAIL_DOMAIN=gmail.com
```

Then enable Pages with GitHub Actions as the source and run the `Deploy PWA to GitHub Pages` workflow.

## Tester Steps

1. Open the HTTPS beta link.
2. Sign up or sign in with username/password.
3. Allow camera and location permission when prompted.
4. Capture a real-world color, save the journal, decorate a story, and export/share the 9:16 image.
5. Install as PWA:
   - Android Chrome: browser menu -> Add to Home screen / Install app
   - iOS Safari: Share -> Add to Home Screen

## Backend Notes

- User accounts are Supabase Auth email/password accounts behind a simple username UI.
- The `beta-signup` Edge Function creates confirmed users with the service role key on the server only.
- Saved entries are protected by owner-scoped RLS on `posts`.
- Uploaded images are stored in `post-images` under the authenticated user's id path.
- Journal/story saves do not persist the user's current capture location; location is used only to generate the weather/time color mission.
- The old browser invite-code gate is disabled; do not use it as a security boundary.

## Pre-Share Verification

```powershell
npm run lint
npm test -- --run
npm run build
npm run verify:supabase
npm run seed:test-account
npm run cap:sync
```

Latest local browser path: beta test account login -> home -> camera album input -> journal daily diary panel -> story export actions visible.

Latest production browser path: beta test account login -> home.
