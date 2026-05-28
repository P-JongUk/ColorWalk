# Beta Test Account

ColorWalk has a shared beta test account for repeatable QA with realistic saved history.

Run this command to create or refresh the account and seed demo posts:

```powershell
npm run seed:test-account
```

The credentials are stored in `docs/beta-test-account.private.md`, which is ignored by git. Do not commit shared test credentials to GitHub.

Use this account for routine browser/PWA checks:

1. Sign in from the first screen.
2. Verify home stats/history are populated.
3. Capture or select a photo.
4. Save a journal entry.
5. Open story styling from Journal or History and export a 9:16 image.

For fresh signup QA, create a separate temporary username and delete it after the test.
