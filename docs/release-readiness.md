# Release Readiness Notes

## What Must Pass Before Sharing

- `npm run lint`
- `npm test -- --run`
- `npm run build`
- `npm run verify:supabase`
- `npm run seed:test-account`
- `npm run cap:sync`

## PWA Beta

- Use an HTTPS host.
- Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_AUTH_EMAIL_DOMAIN`, and `VITE_BETA_INVITE_CODE`.
- Share the HTTPS URL plus invite code with friends.
- Android Chrome users can install from browser menu -> Add to Home screen / Install app.
- iOS users can install from Safari Share -> Add to Home Screen.
- Preferred free deployment path: Vercel Git import of `P-JongUk/ColorWalk`.
- Fallback path: GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.

## Security Checklist

- No `service_role` key in browser code or committed env files.
- RLS enabled on exposed public tables.
- Storage paths remain owner-scoped under `{auth.uid()}/...`.
- Uploads are WebP-only and size-guarded before storage upload.
- Invite code is a beta gate only; do not treat it as strong authentication.
- Keep `docs/*.private.md`, `.env*`, `.design-references/`, and `.lazyweb/` out of git.

## GitHub

This local repository currently needs a GitHub remote before push. If the GitHub connector cannot create a repository in the user's account, create `ColorWalk` on GitHub manually, then run:

```powershell
git remote add origin https://github.com/<owner>/ColorWalk.git
git push -u origin main
```
