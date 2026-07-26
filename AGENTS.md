# Hueday Codex Handoff

Read this file before coding in this repository.

## Current Product Direction

- Public product brand: `Hueday`. Keep internal repo paths, Supabase namespace, Android package, storage keys, and Vercel project names as `ColorWalk`/`colorwalk` unless a deliberate migration is planned.
- Main target: Korean beta users, especially teens and young adults.
- Release priority: ship as quickly as possible, but launch with the complete set of feasible high-impact elements that make Hueday distinctive and likely to succeed. Do not reduce the product to a bare minimum beta; defer only features whose implementation or operational complexity is disproportionate to their launch value. Optimize dependencies and scope without skipping product coherence, security, data-loss protection, or required device QA.
- Experience goal: soft, emotional, polished color diary/PWA with a camera-first habit loop.
- Visual source of truth and artifact status: `docs/design-reference-index.md`. Large source images remain on D under `.design-references/` and `.lazyweb/` and are ignored by git.
- Do not add ad monetization before beta. The approved monetization hypotheses are optional creative packs, `Hueday Studio` one-time tools, and `Hueday Cloud` recurring storage; details and prices live only in the monetization source of truth.
- Monetization source of truth: `docs/product-growth-strategy.md` under `Monetization Model`. Keep the free core promise and earned badge rewards useful when paid packs or subscriptions are designed.
- Product analytics source of truth: `docs/product-growth-strategy.md` under `Metrics`. Measure only allowlisted product actions and aggregate retention/quality signals; do not record every tap, raw photo or journal content, exact location, credentials, tokens, or device fingerprints. Start beta operations with Supabase aggregate queries. A private aggregate-only admin web dashboard is a post-launch follow-up, not a reason to add an external analytics SDK or a custom always-on server before launch.
- Reward direction: use flexible Color Rhythm and cumulative discovery to unlock real Story/Hueprint/found-color creative tools. Do not make consecutive-day streaks, scores, punishment, or reward loss the primary loop. When capture, mission packs, found-color content, story, profile, or monetization changes, update `docs/colorwalk-reward-system.md` plus the reward mapping helper in the same change.
- Daily Color Hunt contract: each device-local calendar day starts with a fresh mission color. Show one weather/time/coarse-location recommendation, allow up to three more contextual rerolls, then draw uniformly from the full curated color catalog. The first accepted photo locks that day's color. Preserve 1–7 photos as a valid daily record, count 8 photos as a completed 3x3 and the major reward unit, close the record at local midnight, and never carry yesterday's color forward as today's active mission.
- Overall product source of truth: read `docs/hueday-product-blueprint.md`, then check the current phase and next action in `docs/hueday-development-roadmap.md`. Use `docs/development-reference-guide.md` to load only the relevant detailed documents. `docs/hueday-breakout-strategy.md` owns code-grounded diagnosis and market/iOS evidence; `docs/product-growth-strategy.md` owns detailed growth and monetization.
- Do not clone Locket, BeReal, Setlog, Cyworld, or generic story/decorating apps. Preserve Hueday's loop: everyday mission color -> real-world similar-color finding -> center-color 3x3 collection -> Living Hue Deck/Color Volume growth -> Hueprint/Story sharing.
- First-release representative content is `Living Hue Deck`; source of truth: `docs/living-hue-deck-product-spec.md` and `docs/launch-scope-and-update-safety-contract.md`. `docs/discovered-color-content-strategy.md` keeps the candidate/history map. Hue Canvas G1 is preserved but deferred and must not resume without an explicit new user decision and post-launch evidence. Hue Room is completely removed from the first-release critical path and deferred as a post-launch hypothesis; preserve its historical spec and local concepts, but do not resume room, furniture, placement, or art-production work without a new explicit user decision and evidence that it is worth the cost.
- Friend features are not first-release scope. `Hue Drop` is the first post-launch update priority and its only source of truth is `docs/hue-drop-post-launch-spec.md`: invite-only, authenticated friends, center mission color plus eight optional slots, no public discovery or anonymous UGC. Do not pre-create its DB/Realtime skeleton.
- Storage, sync, image-quality, migration, update safety, and cost source of truth: `docs/data-storage-sync-and-cost-strategy.md` plus `docs/launch-scope-and-update-safety-contract.md`. Treat local-first storage as an approved target architecture, not as already implemented.
- Product decisions have four explicit states: `approved`, `candidate`, `deferred`, and `historical`. Do not promote a candidate, resume a deferred feature, or reinterpret an approved contract to match current code without the user's explicit approval.
- Before changing a core loop, representative content, visual direction, reward economy, free/paid boundary, persistence model, package identity, or release scope, present the current decision, conflict/evidence, user impact, and at least two choices in text. Change documents or code only after explicit approval. Implementation details that preserve the approved contract may be chosen autonomously and verified.

## Local Commands

If the C drive is full, route npm cache and temp writes to D before running npm commands:

```powershell
$env:npm_config_cache='D:\JongUk\Documents\ColorWalk\.npm-cache'
$env:TEMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:TMP='D:\JongUk\Documents\ColorWalk\.tmp'
New-Item -ItemType Directory -Force .tmp | Out-Null
```

```powershell
npm run lint
npm test -- --run
npm run build
npm run verify:supabase
npm run seed:test-account
npm run cap:sync
```

Android build commands require JDK 21:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
cd android
.\gradlew.bat :app:assembleDebug --console=plain
.\gradlew.bat :app:bundleRelease --console=plain
```

## Environment

Required browser env vars:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_AUTH_EMAIL_DOMAIN
```

Only publishable Supabase keys may be used in Vite/browser code. Service role keys are allowed only in Supabase Edge Functions or local admin tooling and must never be committed.

## Live Web Beta

- URL: `https://colorwalk-tau.vercel.app`
- Browser invite gate: disabled. Use the username/password beta account flow.
- Vercel project: `parkjonguks-projects/colorwalk`

For local Vercel CLI work, keep Vercel config/cache on D because the C drive can be full:

```powershell
$env:XDG_DATA_HOME='D:\JongUk\Documents\ColorWalk\.vercel-local\data'
$env:XDG_CONFIG_HOME='D:\JongUk\Documents\ColorWalk\.vercel-local\config'
$env:VERCEL_TELEMETRY_DISABLED='1'
```

The last successful production deploy used local `npm run build`, manual `.vercel/output` packaging from `dist`, and `npx vercel deploy --prebuilt --prod --yes`.

## Supabase

- Project id: `nhsvmypztjyhqunixxeg`
- App tables: `profiles`, `posts`, `color_name_suggestions`
- Storage bucket: `post-images`
- Additive Supabase changes that do not rewrite existing data (new table, nullable/default-safe column, index, or owner-scoped RLS on a new table) may be applied and verified without a separate user approval only after confirming the migration diff, target project id, current schema, a non-destructive disable/rollback path, and that no secret is exposed. Still require explicit approval immediately before destructive or uncertain changes: DROP/TRUNCATE, data deletion, type/rename/strong constraint changes that can reject existing rows, bulk backfills/transforms, access-expanding or meaning-changing existing RLS/Storage/Auth policies, and changes with material recovery, cost, security, or user-data impact. Edge Function deploys and account-deletion QA remain separate gates.
- Account creation path: username/password form calls the deployed `beta-signup` Edge Function, then signs in through Supabase Auth.
- RLS/storage policies are owner-scoped by `auth.uid()`.
- `npm run verify:supabase` must keep checking anonymous sign-in, anonymous data-write denial, password-user profile upsert, post CRUD, signed storage read, and cross-user denial.
- Current 3x3-grid beta code writes `posts.grid_images` when the migration exists, and automatically falls back to `posts.client_meta.gridImages` on the live project until the `20260529200000_add_grid_images.sql` migration can be applied with authenticated Supabase admin access.
- Latest live verification: 2026-07-23 KST. Auth, profile/post CRUD, storage upload/signed read, grid/story metadata, anonymous-write denial, and cross-user denial passed; `grid_images` still used `client_meta_fallback`.

## Beta Test Account

Use `npm run seed:test-account` to create/update the shared beta test account and seed demo posts. The private credentials are stored in `docs/beta-test-account.private.md` and should stay out of git.

When coding or QA-ing account-specific flows, sign in with that account unless the task specifically needs a fresh signup.

## Android Local Paths

- JDK 21: `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot`
- Primary Android SDK: `D:\Android\Sdk`
- Primary AVD home: `D:\Android\Avd`
- Working AVD: `ColorWalkPixel7`
- ADB: `D:\Android\Sdk\platform-tools\adb.exe`
- Legacy C-drive SDK: `C:\Users\JongUk\AppData\Local\Android\Sdk`
- Debug APK: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\apk\debug\app-debug.apk`
- Release AAB: `D:\JongUk\Documents\ColorWalk\android\app\build\outputs\bundle\release\app-release.aab`

Use the D-drive SDK/AVD for emulator QA so the C drive does not fill up:

```powershell
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
$env:GRADLE_USER_HOME='D:\GradleCacheColorWalk'
$env:TEMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:TMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:GRADLE_OPTS='-Djava.io.tmpdir=D:\JongUk\Documents\ColorWalk\.tmp'
Start-Process -FilePath 'D:\Android\Sdk\emulator\emulator.exe' -ArgumentList '-avd ColorWalkPixel7 -no-snapshot -no-audio -no-boot-anim -camera-back emulated -gpu swiftshader_indirect' -WindowStyle Hidden
```

For Android Gradle builds on this machine, keep Gradle and Java temp writes on D because C can be completely full:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
$env:ANDROID_SDK_ROOT='D:\Android\Sdk'
$env:ANDROID_HOME='D:\Android\Sdk'
$env:ANDROID_AVD_HOME='D:\Android\Avd'
$env:GRADLE_USER_HOME='D:\GradleCacheColorWalk'
$env:TEMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:TMP='D:\JongUk\Documents\ColorWalk\.tmp'
$env:GRADLE_OPTS='-Djava.io.tmpdir=D:\JongUk\Documents\ColorWalk\.tmp'
cd android
.\gradlew.bat --console=plain --no-daemon --max-workers=1 --no-watch-fs --no-build-cache :app:assembleDebug
.\gradlew.bat --console=plain --no-daemon --max-workers=1 --no-watch-fs --no-build-cache :app:bundleRelease
```

Android emulator QA on `ColorWalkPixel7` has verified location permission, camera permission, camera capture, journal save/replace, history, native story share sheet, notification permission, and immediate test notification display. Physical phone PWA install QA is still user-side.

## Design QA Routine

1. Capture 430x932 screenshots for auth, home, camera, journal, story editor, history, and profile.
2. Save current captures under `.design-references/01-current-screens/`.
3. Compare against `.design-references/00-target-mockup/` before deciding a design pass is done.
4. For story/sticker UX, compare against `.design-references/02-lazyweb-story-editor/`, `.design-references/03-stickers/`, and `.design-references/04-template-gallery/`.
5. For Living Hue Deck, compare 1/3/5/8 card states, Color Volume, collection, Hueprint, and Story export at 430x932; verify every card returns to its source 3x3. Hue Room concepts under `.design-references/05-hue-room/` are historical post-launch evidence only.
6. Hue Canvas is deferred. Preserve its G1 reference/prototype evidence on D, but do not run Canvas design or performance work unless the user explicitly reopens it.

## Risk-Based QA Scope

- Test reachable user behavior, not every theoretically constructible state. Before fixing an unusual input or combination, confirm that the released UI, supported import format, migration, or public API can actually produce it.
- P0 always verify: the changed core user journey, authentication/authorization boundaries, cross-user denial, secret exposure, payment when introduced, destructive migration, and any path that can lose or corrupt a user's only record.
- P1 verify when the touched feature can realistically encounter it: permission denial, ordinary offline/retry, app restart during save, expired auth, supported-device layout, and one likely error recovery.
- P2 defer until a real report, telemetry signal, supported requirement, or high-impact threat model justifies it: impossible UI input, arbitrary fuzz values outside the curated catalog, unsupported devices/browsers, exhaustive timing races, and full Cartesian combinations of state/platform/network.
- For a normal feature checkpoint, prefer one happy-path test and one likely failure-path test for the changed behavior. Run broader existing suites at merge/release gates or when the shared root is changed; do not create a new harness, dependency, abstraction, or large fixture matrix for a hypothetical edge case.
- If a deferred case is noticed, record the trigger that would reopen it instead of implementing it immediately. Token and QA time are product resources; stop when the approved success conditions and applicable P0/P1 checks pass.

## Release Rules

- PWA must be served over HTTPS for camera/location/install behavior.
- The browser invite-code gate is disabled; do not reintroduce it unless the product direction changes.
- Browser build must not expose service role keys or local private docs.
- Before sharing a URL, run lint/test/build/Supabase verification and one browser QA path from login to story export.
- Before the first Play Console upload, get explicit user confirmation for permanent package ID `com.colorwalk.app`, configure an upload key and Play App Signing, increment version metadata, and complete account deletion, privacy policy, and Data Safety requirements. Never commit keystores or passwords.

## Git Workflow

- `main` is the integration branch. Do not develop large features directly on `main`.
- Before starting a large feature, update local `main` from `origin/main`, then create a dedicated branch using the `feature/<feature-name>` naming convention. Do not add a `codex/` prefix.
- Keep each commit focused on one meaningful checkpoint. Use Korean commit messages with a conventional prefix when appropriate, such as `feat:`, `fix:`, `refactor:`, `docs:`, or `chore:`.
- Push each meaningful, verified checkpoint so work can be resumed safely: use `git push -u origin <branch>` for the first push and `git push` afterward.
- Run the relevant lint, test, build, Supabase, browser, or Android checks before pushing a checkpoint. Do not hide failing verification behind a commit message.
- Before merging into `main`, review the complete diff and preserve existing product functionality, security rules, and required documentation. Merge only the intended feature branch changes.
- Never commit secrets, `.env` files, private beta-account documents, generated caches, or local design-reference assets.

## Work Continuation and Stop Criteria

- An intermediate commit and push are recovery checkpoints, not completion conditions. Continue until the requested success conditions are met.
- After context compaction, reread the relevant AI memory and Git state, then resume toward the current completion conditions. Do not claim that work can continue after an actual system-enforced termination; apply this rule while execution remains available.
- Unverified WIP is not a reason to stop. Verify the narrow reachable flow, commit and push the next safe checkpoint, then continue.
- A failed check is not an automatic stop. Narrow the cause within the real user-flow scope and fix it; if it is environmental, record the evidence and continue with the next feasible work.
- Never send an in-progress lint, build, Gradle, Capacitor, or similar process state as the final answer. If an execution cell is still running, wait for its result and continue.
- Do not stop merely because work is long unless the user explicitly raises usage concerns. If a real system usage or time limit ends execution, leave a Git checkpoint and AI memory handoff.
- Stop only when a product-direction choice needs the user, destructive DB/data/access expansion needs approval, login or physical-device control requires the user, a real system limit ends execution, or the same environmental block recurs after safe alternatives are exhausted.

## AI Context Workflow

- Every meaningful development task must use the project-scoped `.codex/skills/hueday-development-workflow` skill. The `SessionStart` hook prints its checklist automatically; do not wait for the user to repeat these rules.
- At task start, read `docs/hueday-product-blueprint.md`, the current phase and next action in `docs/hueday-development-roadmap.md`, and the task-specific documents routed by `docs/development-reference-guide.md`.
- Before every meaningful task, consult `docs/ai-model-selection-guide.md` and classify the work by ambiguity, impact, reversibility, and verification cost. When a different setting would materially improve quality or cost, tell the user the recommended model, reasoning effort, Plan mode, Goal mode, and speed setting before implementation. Do not repeat unchanged advice for trivial follow-ups.
- At task start, classify every relevant product statement as approved, candidate, deferred, historical, or implementation fact. If the requested work conflicts with an approved statement, stop that conflicting part and ask for a decision instead of silently normalizing the documents.
- Prefer the lowest model and reasoning effort that can reliably satisfy the success conditions. Treat current official OpenAI guidance and observed project results as stronger evidence than a single external benchmark chart. Never claim the active model changed automatically; tell the user what to select when a change is needed.
- Do not use or recommend Ultra because it depends on subagents. Use Plan mode for ambiguous, multi-step, high-rework-cost work, and Goal mode only for an explicit objective that must persist across multiple turns until completion.
- Execute repository work in the current Codex task only. Do not create, spawn, or delegate to subagents, worker agents, or parallel agents. Use ordinary tools and processes directly from the current agent.
- If a skill or workflow normally requires subagents, choose its single-agent or direct CLI path instead. For Graphify, `query`, `path`, `explain`, and code-only `update` are allowed; do not start semantic-extraction subagents. If no safe single-agent path exists, report the limitation instead of enabling multi-agent execution.
- For codebase questions, use the project-scoped Graphify skill first when `graphify-out/graph.json` exists. Query the relevant subgraph before opening broad source files.
- Before changing code, state the scope, success conditions, and likely files. Follow these four rules: think before coding, start with the simplest solution, change only what is needed, and verify the success conditions.
- Use the project-scoped Ponytail skills under `.codex/skills/ponytail*` and its minimum-change ladder: first ask whether the change is needed, then reuse an existing helper or pattern, then prefer the standard library, native platform features, or already-installed dependencies before adding abstraction or a package.
- After a meaningful task, record the current state, decisions, failed approaches, verification results, and next tasks in `docs/ai-memory/`. Keep credentials and private account data out of these notes.
- At task completion, run `.codex/skills/hueday-development-workflow/scripts/ai-workflow.ps1 -Mode finish ...`; this creates a timestamped session note and refreshes Graphify. Fill in the note's semantic details rather than leaving the scaffold unchanged.
- Treat `docs/ai-memory/` as an Obsidian-compatible local vault. Keep durable project context there so the next coding session can resume from notes instead of re-reading the repository.

## Documentation Freshness Contract

- Documentation is part of the implementation. At the end of every meaningful task, inspect the actual diff and decide whether `AGENTS.md`, `plan.md`, `docs/hueday-product-blueprint.md`, `docs/hueday-development-roadmap.md`, `docs/launch-scope-and-update-safety-contract.md`, `docs/living-hue-deck-product-spec.md`, `docs/hue-drop-post-launch-spec.md`, `docs/release-readiness.md`, `docs/security-audit.md`, `docs/hueday-breakout-strategy.md`, `docs/product-growth-strategy.md`, `docs/discovered-color-content-strategy.md`, `docs/hue-canvas-product-spec.md`, `docs/data-storage-sync-and-cost-strategy.md`, `docs/design-reference-index.md`, `docs/colorwalk-reward-system.md`, the deferred Hue Room documents, and `docs/ai-memory/` are still accurate.
- Update only documents affected by the task, but never leave a known contradiction between code and documentation. If no durable document changes, record `영향 없음` and the reason in the session note.
- Keep facts, interpretations, and unvalidated experiments distinct. Do not claim a deployment, migration, test, metric, or external market fact is current unless it was actually verified; preserve the date of historical checks.
- When a task resolves a meaningful bug, platform constraint, security issue, performance problem, or product tradeoff, add or update a case in `docs/career-problem-solving-log.md` with evidence, alternatives, verification, outcome, and remaining debt. Include measured before/after values, units, environment, date, command or evidence path, and sample size when they exist. If they do not exist, write `아직 측정하지 않음` and the next measurement instead of inventing a number.
- When product positioning, priorities, monetization, market references, or iOS release assumptions change, update `docs/hueday-breakout-strategy.md`. Re-check external primary sources and their access date before treating time-sensitive claims as current.
- The finish workflow must include documentation impact, career-log impact, and quantitative evidence or an explicit unmeasured reason/next measurement. Generated scaffolds are reminders only; Codex must replace placeholders with semantic content before committing.

## D-Drive AI Tool Storage

- Graphify virtual environment: `D:\JongUk\Documents\ColorWalk\.graphify-venv`
- Codex CLI package: `D:\JongUk\Documents\ColorWalk\.codex-cli`
- Graphify graph and generated Obsidian map: `D:\JongUk\Documents\ColorWalk\graphify-out\`
- Python package cache: `D:\JongUk\Documents\ColorWalk\.pip-cache\`
- Obsidian working vault: `D:\JongUk\Documents\ColorWalk\docs\ai-memory\`
- npm cache: `D:\JongUk\Documents\ColorWalk\.npm-cache\`
- Playwright browser cache: `D:\JongUk\Documents\ColorWalk\.playwright-browsers\`
- Gradle user home: `D:\GradleCacheColorWalk\`
- Android SDK/AVD: `D:\Android\Sdk\` and `D:\Android\Avd\`
- Keep project caches, generated graphs, and AI working data on D. Do not recreate them on C unless a tool requires a system-level installation.
- The Codex-managed plugin registry may still keep a small cache under the user profile on C; the CLI package and project data remain on D.

### Persistent D-drive environment

The user-level environment is configured so new terminals route project tooling to D: `npm_config_cache`, `PIP_CACHE_DIR`, `UV_CACHE_DIR`, `GRADLE_USER_HOME`, `ANDROID_SDK_ROOT`, `ANDROID_HOME`, `ANDROID_AVD_HOME`, `XDG_DATA_HOME`, `XDG_CONFIG_HOME`, `PLAYWRIGHT_BROWSERS_PATH`, and `VERCEL_TELEMETRY_DISABLED`. Reopen terminals after changing these values.

`TEMP` and `TMP` remain at their Windows defaults globally because changing them for every application can break unrelated software. The project workflow and Android/npm commands explicitly route temporary writes to `D:\JongUk\Documents\ColorWalk\.tmp`.

The Playwright cache was moved from `C:\Users\JongUk\AppData\Local\ms-playwright` to `D:\JongUk\Documents\ColorWalk\.playwright-browsers` and verified. Obsidian's executable, the JDK, and Codex's global plugin registry remain on C because they are system/user-level installations and moving them manually could break updates or desktop integration; the Obsidian vault and project Codex skills remain on D.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
