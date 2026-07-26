---
name: hueday-development-workflow
description: "Run every meaningful Hueday/ColorWalk coding task through a Graphify-first, Ponytail-minimal, verified workflow, keep durable product/release/career documents aligned with the code, and persist the outcome in the Obsidian-compatible docs/ai-memory vault. Use for feature work, bug fixes, refactors, QA changes, and architecture questions in this repository."
---

# Hueday Development Workflow

Use this workflow for every meaningful coding task in this repository. Keep the process small and evidence-based; do not read the whole repository by default.

## 0. Stay in the current agent

- Perform the entire task in the current Codex task. Never create, spawn, or delegate to subagents, worker agents, or parallel agents.
- Use direct tool calls, Graphify queries, and local commands from the current agent.
- If another skill requires subagents, use its single-agent fallback. If none exists, report the limitation instead of enabling or requesting multi-agent execution.

## 1. Start with a map and a bounded plan

1. Read the repository `AGENTS.md`, `docs/hueday-product-blueprint.md`, the current phase/next action in `docs/hueday-development-roadmap.md`, and the relevant Obsidian notes in `docs/ai-memory/`.
2. Use `docs/development-reference-guide.md` to select the feature-specific source documents. Living Hue Deck work must include `docs/living-hue-deck-product-spec.md` and `docs/launch-scope-and-update-safety-contract.md`; Hue Drop work is post-launch only and must include `docs/hue-drop-post-launch-spec.md`. Hue Canvas is deferred and its historical spec is read only after explicit user re-approval. Storage work must include `docs/data-storage-sync-and-cost-strategy.md`, and design work must include `docs/design-reference-index.md`. For explicitly reopened Hue Room work, include its historical spec and roadmap and first verify new user approval.
3. If `graphify-out/graph.json` exists, query Graphify before opening broad source files. Use `query` for a subsystem question, `path` for a relationship, and `explain` for one concept. Prefer the D-drive executable at `D:/JongUk/Documents/ColorWalk/.graphify-venv/Scripts/graphify.exe` when the `graphify` command is not on PATH.
4. State four things before editing: scope, likely files, success conditions, and the smallest safe implementation.
5. Apply the four principles: think before coding, choose the simplest viable approach, change only what is needed, and define/verify success conditions.
6. For a repeatable start checklist, run:

```powershell
.codex/skills/hueday-development-workflow/scripts/ai-workflow.ps1 -Mode start -Question "<the focused codebase question>"
```

## 2. Apply Ponytail's minimum-change ladder

After understanding the relevant flow, stop at the first rung that works:

1. Does this need to exist?
2. Can an existing helper, type, component, or pattern be reused?
3. Can the standard library do it?
4. Can a native browser, Android, or platform feature do it?
5. Can an already-installed dependency do it?
6. Can the smallest correct implementation solve it?

Do not remove validation, error handling, security, accessibility, or data-loss protection. Fix bugs at the shared root cause when callers converge there. Do not add abstractions, dependencies, scaffolding, or unrelated cleanup without a demonstrated need.

## 3. Implement and verify

- Keep the diff focused and preserve Hueday's everyday mission color → real-world similar-color finding → center-color 3x3 → Living Hue Deck/Color Volume → Hueprint/story sharing loop. Hue Drop is a later invite-only extension, not a first-release dependency.
- Update reward documentation and mapping helpers together when capture, mission packs, Living Hue Deck, story, profile, or monetization behavior changes.
- Treat product statements as approved, candidate, deferred, historical, or implementation fact. Never change an approved core loop, Living Hue Deck contract, visual direction, reward economy, free/paid boundary, storage model, package identity, Hue Drop release timing, or release scope without presenting the conflict and obtaining explicit user approval.
- Scope QA by reachability, likelihood, and user impact. Always keep security/trust-boundary and data-loss checks, but defer impossible UI inputs, unsupported environments, arbitrary values outside the product catalog, exhaustive timing races, and Cartesian state combinations until a real report or requirement exists.
- For a normal feature checkpoint, start with one changed happy path and one likely failure/recovery path. Run the narrowest relevant checks first, then broader existing suites only when the shared root, merge gate, or release gate requires them. Do not add a test harness, dependency, abstraction, or large fixture matrix only for a hypothetical edge case.
- Use D-drive npm/temporary paths from `AGENTS.md`.
- After code changes, keep Graphify current with `graphify update .` or the workflow finish script. Code-only updates are local and do not need an API key.

## 4. Record the result in Obsidian

For every meaningful change, update the Obsidian-compatible vault at `docs/ai-memory/`:

- `00-current-state.md`: durable current state and important status changes
- `01-decisions.md`: decisions, reasons, and rejected alternatives
- `02-next-tasks.md`: concrete follow-up work
- `sessions/YYYY-MM-DD-HHmm-<short-name>.md`: the task record

Then perform a documentation impact check against the actual diff:

- product reality or priority: `docs/hueday-breakout-strategy.md`, `docs/product-growth-strategy.md`, `plan.md`
- overall direction or execution order: `docs/hueday-product-blueprint.md`, `docs/hueday-development-roadmap.md`
- Living Hue Deck product/design/implementation: `docs/living-hue-deck-product-spec.md`, `docs/launch-scope-and-update-safety-contract.md`, `docs/discovered-color-content-strategy.md`, `docs/design-reference-index.md`, `docs/design-qa-log.md`
- deferred Hue Canvas or post-launch Hue Drop: `docs/hue-canvas-product-spec.md` or `docs/hue-drop-post-launch-spec.md`, plus the source documents above; do not promote either without approval
- local storage, sync, image quality, device transfer, or cost: `docs/data-storage-sync-and-cost-strategy.md`, release/security docs
- explicitly reopened Hue Room: `docs/hue-room-product-spec.md`, `docs/hue-room-development-roadmap.md`
- capture/story/profile/reward/monetization: `docs/colorwalk-reward-system.md` and the reward helper
- deploy, QA, environment, schema, or security: `docs/release-readiness.md`, `docs/security-audit.md`, `AGENTS.md`
- meaningful problem, constraint, tradeoff, or failed approach: `docs/career-problem-solving-log.md`

Update only affected documents. If a document has no impact, state that explicitly in the session note. Never replace a historical verification date with a newer date unless the corresponding check actually ran.

Record the goal, scope, Graphify findings, changed files, verification commands/results, failed or deferred approaches, quantitative evidence, and next tasks. Quantitative evidence must include before/after values, units, environment, date, command/evidence path, and sample size when available; otherwise write `아직 측정하지 않음` and the next measurement. Never record secrets, credentials, or private beta-account data. Start from `03-session-template.md` or use:

```powershell
.codex/skills/hueday-development-workflow/scripts/ai-workflow.ps1 -Mode finish -Title "<작업명>" -Scope "<범위와 성공 조건>" -GraphifyFinding "<관련 구조>" -Changes "<실제 변경>" -Verification "<검증 명령과 결과>" -QuantitativeEvidence "<전후 수치·환경·표본·근거 또는 미측정과 다음 측정>" -Decision "<결정>" -Failure "<실패/보류 접근>" -Next "<다음 할 일>" -Documentation "<갱신 문서 또는 영향 없음과 이유>" -Career "<취업 사례 갱신 또는 영향 없음과 이유>"
```

Use `-Mode check` before commit to verify required source documents and roadmap markers and to surface likely documentation omissions from the current diff.

## 5. Git checkpoint

- Develop large features on `feature/<feature-name>` from the latest `main`; do not develop them directly on `main`.
- Make focused Korean commits at meaningful verified checkpoints, then push the feature branch.
- Before merging, review the complete diff and ensure the Obsidian note, tests, security constraints, and product loop are included where relevant.

## 6. Continue until the requested outcome

- An intermediate commit and push are recovery checkpoints, not completion conditions. Continue until the stated success conditions are met.
- If context compaction occurs, reread the relevant AI memory and Git state, then continue toward the current completion conditions. This is a rule while execution remains available, not a claim that work automatically resumes after a system-enforced termination.
- Do not stop because WIP is unverified: run the narrow reachable verification, commit and push the next safe checkpoint, then continue.
- A failed check is not an automatic stop. Narrow and fix the cause in the real user-flow scope; when it is environmental, record evidence and continue with the next feasible work.
- Do not send an in-progress lint, build, Gradle, Capacitor, or similar process state as a final answer. Wait for the execution result first.
- Do not stop merely because the work is long unless the user explicitly raises usage concerns. If an actual system usage or time limit ends execution, leave a Git checkpoint and AI memory handoff.
- Stop only for a required product-direction choice, destructive DB/data/access-expansion approval, user-only login or physical-device control, an actual system limit, or a repeated environmental block after safe alternatives are exhausted.

## Failure handling

- If Graphify is stale, update it before relying on structural answers.
- If a check fails, record the failure and do not claim success.
- If Obsidian is unavailable, still write the Markdown note to `docs/ai-memory/`; Obsidian can open it later because the vault is file-based.
