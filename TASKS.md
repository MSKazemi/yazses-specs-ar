# SPECS execution board — Ubuntu → Windows → verified entry

**Technical task source of truth:** [Epic #1](https://github.com/MSKazemi/yazses-specs-ar/issues/1) and its six linked issues.  
**Status:** The issues and documentation exist. **No portable application code, native Lens Preview test or final submission is verified yet.**  
**Deadline:** 2026-11-09 **23:00 CET (Italy)**; **internal submission goal 20:00 CET**.  
**Project:** YazSes Spatial Review — two **labelled simulated transcription** presets, draft review, deliberate Confirm/Cancel and Reset. No real speech recognition or live YazSes bridge.  
**Existing code/technical rules:** [ROADMAP.md](ROADMAP.md) · [AGENTS.md](AGENTS.md). Do not start duplicate tasks or edit core YazSes.

## 1. Task board with dependencies and actual completion

| Priority | Task | Agent | OS | Dependency | Verified status |
|---|---|---|---|---|---|
| P0 | [#2 U1: TypeScript state machine](https://github.com/MSKazemi/yazses-specs-ar/issues/2) | DOMAIN | Ubuntu now | Clean checkout/branch | **OPEN / NOT TESTED** |
| P0 | [#3 U2: independent unit tests](https://github.com/MSKazemi/yazses-specs-ar/issues/3) | QA | Ubuntu now | Agree types with Domain; test run after source exists | **OPEN / NOT TESTED** |
| P0 | [#4 U3: official Lens API/adapter research](https://github.com/MSKazemi/yazses-specs-ar/issues/4) | LENS-RESEARCH | Ubuntu now | None | **OPEN** |
| P1 | [#5 U4: README + Preview storyboard](https://github.com/MSKazemi/yazses-specs-ar/issues/5) | DOCS | Ubuntu now | None; factual update after tests | **OPEN** |
| P0 tomorrow | [#6 W1: native Lens Studio build](https://github.com/MSKazemi/yazses-specs-ar/issues/6) | Single BUILDER | Windows 11 | **Actually working SPECS Preview**, real `plan-lens`, CLAD+MCP; import U1/U3 | **BLOCKED until Windows Preview** |
| P0 tomorrow | [#7 W2: real Preview/LEAF and source audit](https://github.com/MSKazemi/yazses-specs-ar/issues/7) | QA, after Builder editor handoff | Windows 11 | W1 real Lens + editor lease release | **BLOCKED until W1** |

**Owner-only actions:** confirm event eligibility and registration; answer genuine Devpost Learn `plan-lens` interview; inspect/approve license/ownership/public assets; approve exactly which public source revision to push; approve public YouTube video; personally complete the final Devpost submission and save receipt. These are not "done" because an agent prepared a form.

## 2. Ubuntu: task assignment / file ownership

Use **one Claude Code Lead + four independent agents**. Their work must run concurrently where possible:

- **DOMAIN:** ONLY `src/logic/`. Pure TypeScript `transition(state, action)` and view model. No Node/DOM, Snap SDK runtime import, network or actual speech.
- **QA:** ONLY `tests/`. Runnable unit tests for draft safety, duplicate confirmation, reset/interruption, invalid orders; no concurrent edits to `src/logic/`.
- **LENS-RESEARCH:** ONLY `docs/INTEGRATION-CONTRACT.md`. Official current Snap scene/interaction/CLAD/MCP/LEAF sources and uncertain API notes, **not** a fabricated `.esproj`.
- **DOCS:** ONLY `README.md`, `docs/DEMO.md`. Accuracy, setup, limitations, licensing/asset inventory, 120–150s **real Preview** storyboard.
- **LEAD:** Tooling files (`package.json`, actual lockfile, `tsconfig*`, `.gitignore`), Git index, combined test/typecheck, security review, commit/push/branch handoff. One Git writer.

Do not allow multiple workers to operate the same Git index, browser tabs, or native Lens Studio editor. The **Windows Builder** gets sole native editor control; QA takes it only by explicit handoff.

## 3. Ubuntu: lead's Git staging/commit/push checklist

**The repository already exists publicly.** First inspect current work and preserve it. Do not reinitialize, reclone into an occupied directory, reset, `git clean`, force push, or rewrite history.

~~~bash
# In an EMPTY parent folder only, if not already cloned:
git clone https://github.com/MSKazemi/yazses-specs-ar.git
cd yazses-specs-ar

# If already cloned, simply cd into it and inspect:
git remote -v
git status --short --branch
git log -5 --oneline
git branch --show-current

# If an appropriate feature branch does NOT yet exist:
git switch -c feat/ubuntu-portable-core-2026-11-08
~~~

After the agents finish independent files, **the Lead** runs actual tests/typecheck according to the **real package scripts that were written**, e.g. `npm test` / `npm run typecheck` if scripts exist. Record observed results/versions, don't invent counts. Have QA and Lens Research inspect changes/asset rights read-only.

**Stage explicitly (only paths which exist, after examining them)**. Example, *not* a command to copy blindly for missing paths:

~~~bash
git status --short
git add -- src/logic tests docs/INTEGRATION-CONTRACT.md docs/DEMO.md README.md package.json
# Explicitly add the ACTUAL lockfile and tsconfig only after checking filenames:
# git add -- package-lock.json tsconfig.json
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
~~~

**Before commit/push:**
- [ ] Every staged file and its diff manually reviewed; compare to issue acceptance criteria.
- [ ] No `.env`, secrets, auth-bearing `.mcp.json`, local Claude session configs, real audio, private history/paths or licensed Snap binaries/assets without rights.
- [ ] `git diff --cached --check` clean, unit tests and typecheck actually recorded.
- [ ] No work staged by a second agent, no unrelated modifications or unreviewed ownership claims.
- [ ] Report the **exact staged filenames**, test results and the proposed public branch to the owner. **Request the owner's explicit approval once**, not at every file.

**Only after approval for the reviewed technical branch**, the Lead runs:

~~~bash
git commit -m "feat(specs): add portable simulated-draft review core and tests"
git rev-parse HEAD
git status --short --branch
git push -u origin HEAD:refs/heads/feat/ubuntu-portable-core-2026-11-08
~~~

This pushes **only the feature branch**, **never `main`**. If Git reports non-fast-forward/conflicting remote changes, stop to inspect and report; **never use `--force`**. If owner declines public push, retain local commit and provide a safely reviewed transfer method to Windows; do not invent a branch that GitHub cannot see.

**Mandatory handoff back to owner and ChatGPT for remote verification:**

~~~text
SPECS UBUNTU PUSH HANDOFF
Repository: https://github.com/MSKazemi/yazses-specs-ar
Branch: feat/ubuntu-portable-core-2026-11-08
Commit SHA: <actual git rev-parse HEAD>
Pushed: yes/no (with exact command/result)
Files (relative paths): <actual git diff --name-only MAIN...HEAD>
Unit test command + observed results:
Typecheck command + observed results:
Rights/secret review: PASS / unresolved
Windows-only: Lens Studio .esproj, CLAD/MCP, plan-lens, Preview, LEAF all NOT RUN
First blocker:
GitHub branch URL: <actual link, only after push>
~~~

**Why this verification matters:** a local commit or Claudе summary is not evidence that the work exists on GitHub. After a successful push, use GitHub's branch/commit page to check exact SHA and files. Do not mark issues DONE until their acceptance criteria and evidence are met.

## 4. Windows: exact next actions after safe push

- [ ] Fetch/review the Ubuntu technical feature branch at the actual pushed SHA.
- [ ] Open **native Windows 11** Lens Studio; choose **SPECS → Base Template** and save a real `.esproj`, ideally under `lens/` in this repo if supported.
- [ ] Verify real SPECS **Preview** first (project open, scene visible).
- [ ] Connect official CLAD + Lens Studio MCP, perform one real active-scene inspection.
- [ ] Review/install the Devpost Learn pack; **run the genuine `plan-lens` interview** with the human owner answering; get approval of generated design brief.
- [ ] Wire tested portable logic to real supported Lens Studio components and perform complete task flow.
- [ ] Builder yields editor control to QA; run actual Preview/Logger/LEAF and record PASS/FAIL/NOT RUN.
- [ ] Reconcile native project into the reviewed standalone public repo; audit staged source and third-party rights before a separate, approved publication.
- [ ] Record actual Preview only; create **public YouTube video under three minutes**; owner completes final Devpost Submit, retaining entry URL.

## 5. ChatGPT verification after the Ubuntu push

Once you send **the feature-branch name or commit SHA** in this conversation, ChatGPT can read GitHub and check:

1. Does the branch exist on `MSKazemi/yazses-specs-ar` and point to the claimed SHA?
2. Are `src/logic/`, `tests/`, `docs/INTEGRATION-CONTRACT.md`, docs and package/tooling files actually present?
3. Does the code match explicit state-transition invariants, or are there obvious defects?
4. Are test scripts present? Actual test execution cannot be inferred from the commit alone; need Claude's command/output and ideally CI evidence.
5. Is the Windows handoff specific enough to carry the work into native Lens Studio?

**Scope note:** the source repository is for public technical work. Business strategy, account details and individual outreach must not be moved into it. Core YazSes source remains unchanged. Do not mark a Devpost entry submitted without the actual owner receipt.
