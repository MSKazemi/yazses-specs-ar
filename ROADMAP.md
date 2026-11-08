# YazSes Spatial Review — SPECS Hackathon Technical Roadmap

**Status:** PREPARATION / UNVERIFIED. Public technical experiment only; **not** an integrated or released YazSes feature.  
**Prepared:** 2026-11-08. **Deadline:** 2026-11-09 **23:00 CET (Italy)** / 17:00 EST.  
**Repository:** https://github.com/MSKazemi/yazses-specs-ar  
**Live to-do / exact Git push handoff:** [TASKS.md](TASKS.md) · [GitHub EPIC #1](https://github.com/MSKazemi/yazses-specs-ar/issues/1) and [issues #2–#7](https://github.com/MSKazemi/yazses-specs-ar/issues). 
**Official rules:** https://learn-specs.devpost.com/rules | **Devpost Learn:** https://github.com/challengepost/learn-specs | **Lens Studio:** https://ar.snap.com/download.

## Goal and pitch

**Project title:** YazSes Spatial Review  
**One-liner:** Review a simulated transcription beside the task in augmented reality, then explicitly confirm or cancel.

Build **one new SPECS Lens**, for a small simulated tabletop task. A scene-relative note card displays one of two controls visibly labelled **Simulated transcription A** or **Simulated transcription B**. Selecting a preset starts a draft; changing it does not confirm. The user explicitly confirms/cancels or resets. The note remains beside the workbench as the Preview camera moves. On-screen copy always states **"Simulated transcription — not live speech."**

This is a downstream spatial review *concept* relevant to privacy-first dictation. There is **no microphone, no live speech recognition, no YazSes import/bridge, no cloud API, no external action, no persistent physical anchoring and no headset-hardware compatibility claim**. A plain web app is **not** a valid entry; the finished deliverable must be a genuine SPECS Lens Studio project.

Official competition requirements: new Lens created during the eligible submission period; organizer's **Devpost Learn plan-lens skill**, **Snap CLAD**, **Lens Studio**, **Lens Studio MCP**; actual functioning **Lens Studio Preview**; public source with Lens project files; English text; **public YouTube Preview screen recording shorter than 3 minutes**; confirmed Devpost submission. Personal account/terms acceptance and final submission are the entrant's decisions.

## Source locations and no-crossing rule

- **This standalone public repository:** competition-specific source, portable pure logic, tests, actual Lens Studio project and technical documentation.
- **Existing public YazSes app:** no runtime changes. XR research and any future optional adapter remain gated by its existing ADR-030, consent/egress decisions and user-evidence requirements.
- **Private planning elsewhere:** not copied, linked or discussed here.

This repository was **empty when the roadmap was first prepared**; all proposed code/layout entries below are **to be created and verified**, not claims about current files. Do not create fake or manually fabricated .esproj files.

## Fast critical path — Ubuntu tonight / Windows tomorrow

**Clock:** Sunday Nov 8 is coding preparation; **Monday Nov 9 is the only remaining supported-editor day** before 23:00 CET. Target a complete entry **by 20:00 CET** to leave upload/registration buffer. If a hard requirement is not met, record BLOCKED/NO-GO instead of presenting a web mock as a Lens.

| Gate | When / OS | Work and parallelism | Evidence to pass |
|---|---|---|---|
| U0 — Repo safety | Ubuntu **tonight**, first | Clone this standalone public repo; check remotes, files, git history. Create a scoped feature branch and own separate folders. | Correct repo and branch; no private history/secrets. |
| U1 — Pure domain state | Ubuntu tonight | **Domain agent** implements portable TypeScript state machine with ZERO platform/Node/DOM dependencies at runtime. | Actual source, states/actions, deterministic outputs. |
| U2 — Tests | Ubuntu tonight, parallel | **QA agent** designs/writes tests in independent `tests/`; run the chosen fast TS test runner. | Test output with explicit PASS/FAIL and test command, no invented success. |
| U3 — Lens adapter design | Ubuntu tonight, parallel | **Lens research agent** reads official current Snap API docs, writes interaction/scene contract **without inventing editor APIs**. | Concrete planned scene objects, supported touch/pinch/Preview behavior, open questions flagged. |
| U4 — Docs/pitch | Ubuntu tonight, parallel | **Docs agent** drafts public README, limitations, license/asset checklist, English Devpost copy, 120–150 s story. | Drafts consistent with simulation; unknown features marked unverified. |
| U5 — Safe handoff | Ubuntu tonight, integration | Lead reviews isolated files, code/tests, source manifest, export approach. Commit locally if approved; public push **only after owner reviews actual files and grants approval**. | Commit SHA/branch, test output, Windows handoff report; public branch if explicitly approved. |
| W0 — Native project | Windows 11 **tomorrow** | Owner installs/opens Lens Studio, creates **SPECS → Base Template → File → Save As**; starts real Preview. | Real project `.esproj`, installed version, Preview observation. |
| W1 — Required tools | Windows tomorrow | **Builder** starts Claude Code from the folder with the actual `.esproj` while editor is open; verifies CLAD+MCP. | One successful real MCP active-scene inspection; versions logged. |
| W2 — Genuine design skill | Windows tomorrow | Install Devpost Learn pack in the **Lens Studio project folder** after inspection/approval; owner answers `plan-lens` interview; writes actual `devpost/design-brief.md`. | Owner-approved brief written by actual skill, not a fabricated file. |
| W3 — Integrate portable logic | Windows tomorrow | Builder maps U1's pure state machine to supported actual Lens Studio input and scene components, preserving semantics. | Compiles in real Lens Studio, real Preview behavior; no unsupported imports. |
| W4 — Lens experience | Windows tomorrow | Builder sequentially completes scene placement → labelled simulated drafts → explicit Confirm/Cancel → Reset. QA/Docs read-only in parallel. | Actual Preview steps and Logger for each slice, one writer. |
| W5 — QA gate | Windows tomorrow | Builder yields exclusive editor/MCP control to QA; run `verify-preview`, applicable LEAF tests and manual checks, fix first reproducible failure and retest. | Observed PASS/FAIL/NOT RUN, logs and clean reopen. |
| W6 — Publish/submit | Windows/browser tomorrow | Owner approves actual public source/asset rights, real Preview video, public YouTube upload, English Devpost form and presses final Submit. | Public repo with `.esproj` + all required assets, public video <3m, final event-specific receipt. |

**Parallelism rule:** one agent/worker owns each fileset; no shared mutable Git index operations by multiple agents. On Windows, ONLY the Builder controls the live editor until explicitly handing control to QA. Rules/Docs/SEO browser work may proceed independently.

## Suggested layout, not yet created

The **Lens Studio editor** owns and generates the Lens project files. The editor may require them in their own folder; do not pretend an empty Git repo is already a valid project.

~~~text
yazses-specs-ar/
├── ROADMAP.md                      # this public technical roadmap
├── README.md                       # initial truthful README, then verified build instructions
├── src/
│   └── logic/                      # pure TypeScript state/transition module (Ubuntu)
├── tests/                           # portable unit/state tests (Ubuntu)
├── docs/
│   ├── INTEGRATION-CONTRACT.md      # independent API research, no invented Lens API
│   ├── TESTING.md                   # exact observed results and NOT RUN distinctions
│   └── DEMO.md                      # screen recording script and real links when verified
├── package.json / lockfile          # dev-only tests, no production cloud dependency
├── .gitignore                       # review, exclude local auth
└── lens/                            # actual Lens Studio Save As output, created ON WINDOWS
    ├── <actual project .esproj>
    ├── <actual Lens Studio scripts/scenes/assets>
    └── devpost/design-brief.md      # generated by the official plan-lens skill
~~~

When saving in Lens Studio, **prefer** choosing `lens/` under the cloned repository if the editor permits this safely. Otherwise save in a separate clean folder and copy/reconcile it into `lens/` after verifying all references; don't overwrite the Ubuntu pure logic/tests or copy an unrelated `.git` folder. Start the Windows coding CLI **inside the actual saved Lens Studio project directory**, not necessarily at repository root. In the README, point judges directly to its `.esproj` path. Do not put a private Git history in this repo.

## Tonight — Ubuntu parallel agent execution

**Hard technical boundary:** Ubuntu can build/verify ordinary TS logic, docs and tests only. **It cannot validate the real Lens Studio scene, SIK/UI Kit, live CLAD/MCP/Preview or LEAF against the editor.** Avoid guessed Snap API names. Use only harmless synthetic examples:
- A = "Prepare the blue and yellow blocks."
- B = "Place the blue block beside the yellow block."

**State contract (subject to owner design-brief approval tomorrow):**
- States: `IDLE`, `PLACED`, `DRAFT`, `CONFIRMED` (with a separate cancelled/reset result, if helpful).
- Actions: `PLACE`, `SELECT_SAMPLE_A/B`, `CONFIRM`, `CANCEL`, `RESET`, `INTERRUPT`.
- Invariants: no draft without placement; selecting a sample never commits; confirm requires an explicit action; repeated confirm has no second effect; cancel never commits; reset clears; interruption cannot auto-confirm; no network or mutation outside state.
- Pure input/output: `transition(state, action) -> state`, plus a derived view model; no dependency on Lens Studio, GitHub, browser, microphone, Node fs, DOM or backend. Keep API simple enough to copy into Lens Studio if its module system cannot consume npm packages.
- Tests include first action before placement, switching A/B, explicit confirm, duplicate confirm, cancel and fresh draft, reset, interrupt, unknown/untrusted action, stable note position token. Assertions must match state contract; no fake hardware test.

**Multi-agent allocation (suggested one Lead + FOUR teammates):**
- **Domain** writes `src/logic/` only.
- **QA** writes `tests/` only and may review domain code read-only; QA can edit tests as interfaces stabilize, never source concurrently.
- **Lens API researcher** writes `docs/INTEGRATION-CONTRACT.md` only; official sources with URLs; do not copy unverified import signatures into production.
- **Docs/Devpost** writes `README.md`, `docs/DEMO.md` and draft English text. Do not claim real Preview success.
- **Lead** owns package/tool config, lockfiles, Git operations, cross-agent integration and progress. Only Lead commits/stages/pushes; all other agents avoid Git mutations. If agent teams unsupported, use 2–3 scoped subagents and one lead without slowing the actual build.

### Copy-paste: Ubuntu Claude Code Team Lead prompt

Launch interactive Claude Code from a clone of **this repository** on Ubuntu, on a scoped feature branch. You may enable Claude Code's experimental agent teams where available. **Do not run inside the private business checkout.**

~~~text
You are the LEAD of a time-critical Claude Code team for the new standalone
public technical repository MSKazemi/yazses-specs-ar. Inspect current
working directory, repository name, remotes, Git status, history and this
ROADMAP.md first. If the clone is empty or a different repo, STOP before
writing. Preserve existing work; no reset/clean/force-push.

We have Ubuntu now and Windows 11 tomorrow. Our hackathon requires a real
SPECS Lens Studio Preview on WINDOWS tomorrow. Do not pretend Ubuntu has
Lens Studio, CLAD/MCP scene access or a working Lens. Tonight maximize
portable TypeScript logic, unit tests, technical specification and docs
without fake editor files or unsupported Snap APIs.

Create shared task list with explicit independent ownership. Spawn up
to FOUR teammate agents if supported:
- DOMAIN: write ONLY src/logic/ with pure TS review state machine,
  actions PLACE, SELECT_SAMPLE_A/B, CONFIRM, CANCEL, RESET, INTERRUPT,
  and a view model. No runtime Node/DOM/Lens deps, no network.
- QA: write ONLY tests/, independent cases for all transitions,
  duplicate confirm, invalid actions, missing placement, resets,
  interruption, no side effects. Run tests after lead installs an
  appropriate fast dev-only test runner. Report actual results.
- LENS-RESEARCH: read only current official Snap docs, then write ONLY
  docs/INTEGRATION-CONTRACT.md for tomorrow's Lens scene/interface
  mapping, Preview control behavior and unknown API issues. Never
  guess a Lens API, create .esproj files or claim a Preview pass.
- DOCS: write ONLY README.md and docs/DEMO.md with accurate project
  pitch, simulated input labels, explicit not-live-speech disclaimer,
  repo/Preview instructions and conditional English video/Devpost copy.

Lead owns package.json, lockfile, tsconfig, .gitignore, Git index,
commits and integration. Coordinate interfaces early, keep tests fast
and show meaningful progress. Multiple teammates must never mutate
the same file, Git index or commit. Assign Lens Studio work only for
tomorrow's supported Windows host.

Public feature scope:
YazSes Spatial Review: spatial card near simulated tabletop workbench;
presets A/B, visibly labelled Simulated transcription A/B and
"Simulated transcription — not live speech", draft/review, separate
confirm/cancel and reset. Two example strings in ROADMAP.md.
No microphone, YazSes engine/desktop bridge, cloud services, external
send, physical SPECS verification or offline recognition claim.

Use only owned synthetic strings; no actual user audio, private files,
account secrets, raw browser profile or private business history.
Do not copy any private repository or .git history into this repo.
Any dev dependencies are allowed only through an approved free install;
no paid overage/cloud or blanket unsafe permissions.

Before coding: propose simple types/action semantics to DOMAIN and QA.
Then implement, run real portable tests and type-check, review diffs,
perform a source/secret/license audit and produce a Windows handoff.

Do not create a fake Lens Studio project, announce a valid submission,
or push any code publicly without the owner's review and explicit
approval of the exact staged files/branch. Report:
1. ACTUAL completed paths and commit SHA (if committed).
2. exact test commands/result counts (or NOT RUN).
3. owner decision needed before public push.
4. what to import and validate tomorrow in actual Lens Studio.
5. first known blocker and next concrete action.
Keep work ready for Windows migration before the deadline.
~~~

### Optional direct Ubuntu teammate briefs

**DOMAIN** (only `src/logic/`): pure typed transitions; deterministic `transition(state, action)`, not JSON serialization of functions; strict explicit actions; idempotence; no side effects.  
**QA** (only `tests/`): write tests from contract, no source edits; include invalid sequences and replay tests; record real results.  
**LENS-RESEARCH** (only `docs/INTEGRATION-CONTRACT.md`): actual official Lens Studio scene/API docs and constraints, adapter boundary, world placement vs face-fixed UI, simulation input path; report unsupported imports.  
**DOCS** (only README and `docs/DEMO.md`): public-facing truthful copy; drafts, not footage or real Lens assertions.

## Tomorrow — Windows migration, genuine Lens, and submission

1. Open the cloned *same standalone repo* on Windows. Verify correct branch/commit, run Ubuntu test suite locally; distinguish Ubuntu-passed vs Windows-passed.
2. In **native Lens Studio on Windows 11**, choose SPECS → Base Template → File → Save As. Save the actual project in a suitable clean folder (prefer `lens/` inside repo when supported) and verify **Preview** first. Note exact version/target. Do not move/rebuild generated assets without verifying they resolve.
3. In the folder containing actual `.esproj` and `.mcp.json`, launch **interactive Claude Code** with Lens Studio OPEN. Connect **Snap CLAD and Lens Studio MCP**; perform actual read-only scene inspection.
4. Install organizer skill pack from the Lens project folder after reviewing it: `npx skills add challengepost/learn-specs --all -y`. Run **the real `plan-lens` interview**; owner must answer design questions, approve `devpost/design-brief.md`. The Ubuntu plan is a draft seed, not a substitute.
5. In a NEW CHAT (same Lens folder) ask the agent to read the approved brief, **map the tested pure state logic** into Lens Studio's actual supported TypeScript/scenes, build first verifiable slice, then add interaction controls. Reuse state semantics; adapt module syntax only after real compiler evidence.
6. Test with actual Lens Studio Preview and Logger after each slice, then QA/LEAF when Builder yields editor control. Record exact observed behavior, first error and evidence, not a fabricated PASS.
7. Complete review, licensing, public code/asset scan, actual 120–150 s screen recording, public YouTube under 3 minutes and final Devpost owner-controlled Submit before **23:00 CET** (internal **20:00 CET** target).

### Copy-paste: Windows Lens Builder Lead prompt

**Run in the folder containing the real saved SPECS `.esproj`, not the Ubuntu `src/logic` root, and NEVER in private business repo.**

~~~text
You are LEAD of the actual SPECS Lens Studio build on Windows 11.
The public repo is MSKazemi/yazses-specs-ar. Inspect the exact
working directory, saved .esproj, Lens Studio version and open Preview.
DO NOT claim an editor or working Lens merely because Ubuntu tests
passed. Inspect the portable core at the same repo's src/logic/
and portable tests under tests/; use docs/INTEGRATION-CONTRACT.md as
a researched HYPOTHESIS, not guaranteed editor API compatibility.

I want the OFFICIAL Devpost Learn and Snap CLAD/MCP workflow:
1. Verify real SPECS Base Template Preview.
2. Connect CLAD and Lens Studio MCP and inspect active scene read-only.
3. Install organizer skill in this EXACT Lens project folder with
   my approval: npx skills add challengepost/learn-specs --all -y.
4. Run the genuine learner-led plan-lens skill. Ask ME the questions.
   Create/approve actual devpost/design-brief.md. No fake skill run.
5. Start a NEW CHAT in SAME Lens project folder for actual building.
6. Build one working vertical slice with Lens Studio MCP/CLAD:
   a small scene-relative note card beside simulated desk workbench.
7. Wire the Ubuntu pure reducer to supported Lens Studio event/scene
   components and visible "Simulated transcription A/B" presets.
   Display persistent "Simulated transcription — not live speech".
   Add explicit Confirm/Cancel and safe Clear/Reset, with idempotent
   repeated input. No network, actual mic, YazSes runtime or fake
   dictation indicator.
8. Check real Preview and Logger after each small step; fix the FIRST
   observed defect. Do not add optional visual polish until core
   interaction passes.
9. Use ONE exclusive writer to Lens scenes/scripts and MCP. Parallel
   QA researches tests and Docs updates separate files read-only.
   QA takes the live editor lease ONLY after Builder explicitly pauses.
10. Run real manual Preview and applicable LEAF checks. If unavailable
    mark NOT RUN. Record versions, command/steps, expected and observed.

After verification, prepare a precise source/asset allowlist and
secret/license/history audit. STOP before any unauthorized public push,
video upload, account terms or final Devpost Submit. Give owner the
minimum next action to meet 2026-11-09 23:00 CET deadline.
~~~

## Minimum measurable acceptance matrix

| ID | Requirement | Test type / status before running |
|---|---|---|
| T01 | Two labelled simulated preset inputs, no real speech claim | Unit/Preview — NOT RUN |
| T02 | No draft without chosen placement | Unit/Preview — NOT RUN |
| T03 | Switching A↔B never confirms | Unit/Preview — NOT RUN |
| T04 | Confirm requires a deliberate event and is idempotent | Unit/Preview — NOT RUN |
| T05 | Cancel has no external action | Unit/Preview — NOT RUN |
| T06 | Clear/Reset restarts a clean flow | Unit/Preview — NOT RUN |
| T07 | Interruption does not automatically confirm | Unit/Preview — NOT RUN |
| T08 | Card stays scene-relative when camera moves | **Lens Studio Preview required** — NOT RUN |
| T09 | Actual Lens project opens without blocking errors | **Lens Studio Preview required** — NOT RUN |
| T10 | Correct CLAD/MCP active-scene use + actual design brief | **Lens Studio/CLAD required** — NOT RUN |
| T11 | LEAF tests (if available) + real Logger record | **Lens Studio required** — NOT RUN |
| T12 | Public repo/video, English form and confirmed entry receipt | **Owner/publication required** — NOT DONE |

## Owner / release gates and truthful status

- **Account:** owner reviews Devpost eligibility/terms and personally joins event; browser assistant can help prepare fields.
- **Source:** owner reviews full public diff + Git history/secret scan and approves any public branch push/merge. Any third-party Snap template/assets require correct attribution/licensing.
- **Video:** record actual Lens Studio Preview only; public YouTube upload after owner review; English captions/story, no copyrighted music or real private media.
- **Submission:** owner completes official Devpost **Enter a Submission** and retains the event-specific receipt URL. `Save Draft` is not confirmation.
- **Deadline:** Monday 2026-11-09 23:00 CET, Italy. Stop bonus work for source+video+entry.
- **Never promise:** working glasses compatibility, actual YazSes offline ASR on SPECS, any unmeasured performance, prize, submitted entry or live voice capture.

**Latest plan status at creation:** roadmap-only technical preparation, no known saved Lens Studio project, no actual portable state-machine test result, no real editor Preview, and no Devpost entry confirmation. Update status with actual commit/test/receipt evidence as work progresses.
