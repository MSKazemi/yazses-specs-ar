# Windows handoff — YazSes Spatial Review

Written on Ubuntu, 2026-11-08, by the repository Lead. Nothing here was run in Lens Studio. Portable test success is **not** Lens Studio validation.

## What exists

| Item | Value |
|---|---|
| Repository | https://github.com/MSKazemi/yazses-specs-ar (public) |
| Work branch | `feat/ubuntu-portable-core-2026-11-08` — pushed to the public repo; `main` still holds only the planning documents |
| Source revision | the commit at the tip of that branch; record it with `git rev-parse HEAD` after the fetch below |
| Portable core | `src/logic/{index,types,samples,reducer,view}.ts` — pure ES2020 TypeScript, no imports from outside the folder |
| Contract | `docs/STATE-CONTRACT.md` (transition table + clarifications) |
| Tests | `tests/*.test.ts` — vitest 5.1.0 |
| Adapter research | `docs/INTEGRATION-CONTRACT.md` (UNVERIFIED API mapping; every uncertain item is flagged) |
| Rights and Devpost | `docs/LICENSING-AND-RIGHTS.md`, `docs/DEVPOST-ENTRY-CHECKLIST.md` |

## Results on Ubuntu (Node 24.21.0, TypeScript 7.0.2, vitest 5.1.0, 2026-11-08)

| Command | Result |
|---|---|
| `npm test` | PASS — 6 files, 168 tests, exit 0 (about 9 s) |
| `npm run typecheck` | PASS — exit 0 (source and tests) |
| Mutation check by the test agent (4 deliberate reducer breaks in a scratch copy) | each broke 3–12 tests |
| Lens Studio, Preview, CLAD, MCP, LEAF, hardware | **NOT RUN** |

Dependency versions are pinned in `package.json` (TypeScript 7.0.2, vitest 5.1.0). Node must satisfy `^22.12.0 || ^24.0.0 || >=26.0.0`. Lens Studio's default TypeScript target is ES2019 (per the integration research); the core was also type-checked with `--target ES2019 --lib ES2019 --strict` on Ubuntu and passes (exit 0). That is not a Lens Studio compile.

## Portable interface the Lens adapter calls

```ts
import { createInitialState, reduce, describe, SAMPLE_LABEL, SAMPLE_TEXT, DISCLOSURE } from "./logic";
let state = createInitialState();
const r = reduce(state, { type: "SELECT_SAMPLE", sample: "A" }); // r.outcome "applied" | "ignored"
state = r.state;
const view = describe(state); // view.cardText, view.statusText, view.canConfirm, view.canSelect.A ...
```

Issue #2's `transition(state, action) -> state` (actions `SELECT_SAMPLE_A` / `SELECT_SAMPLE_B` instead of a payload) is a thin wrapper over `reduce`; both are exported from `src/logic`.

Events: `PLACE`, `SELECT_SAMPLE{A|B}`, `CONFIRM`, `CANCEL`, `RESET`, `INTERRUPT`. A draft is never confirmed without `CONFIRM` in `DRAFT`; a repeated `CONFIRM` is ignored by phase. Pinch debouncing belongs in the adapter.

## Remaining work (all of it needs Lens Studio on Windows)

1. Create the real SPECS project and prove Preview (gate W0).
2. Verify CLAD and the Lens Studio MCP with one read-only scene inspection (W1).
3. Run the real `plan-lens` interview with the owner; keep the genuine `devpost/design-brief.md` (W2). The official rules say the `devpost/` folder is welcome but not required; an organizer update says they look for it. Treat `devpost/` as recommended/optional, but the real `plan-lens` workflow itself is required and must not be skipped or faked.
4. Bring `src/logic/` into the project and settle the open questions in `docs/INTEGRATION-CONTRACT.md`, first of all whether a plain TS module can be imported from a Lens script (W3).
5. Build placement, simulated A/B card, Confirm/Cancel, Reset; test in Preview; write LEAF scenarios; fix the first failure and retest (W4, W5).
6. Record the Preview video; prepare the public push and Devpost entry (W6). Owner presses Submit.

## Exact steps for tomorrow

1. Owner: get to the Windows 11 machine. Install Lens Studio from https://ar.snap.com/download (current build was 5.24.1; record the installed version). If CLAD sign-in fails on 5.24, use 5.23.2 per the organizers' FAQ.
2. Owner: Lens Studio → SPECS → Base Template → File > Save As into an empty folder (suggested `lens/` inside a fresh clone of this repo). Open Preview; record PASS or FAIL.
3. Fetch the work (the branch is on GitHub): `git clone https://github.com/MSKazemi/yazses-specs-ar.git && cd yazses-specs-ar && git fetch origin && git switch feat/ubuntu-portable-core-2026-11-08 && git rev-parse HEAD`. Run `npm install && npm test` to reconfirm on Windows (Node 22.12+ or 24).
4. Builder: start `claude` in the project folder with the editor open; approve the Lens Studio MCP server; install the CLAD plugin per https://developers.specs.com/docs/clad/setup/setup-ai/claude-code-setup; `/mcp` must show it connected.
5. Review what `npx skills add challengepost/learn-specs --all -y` installs, ask the owner, then run it (drop `-y` if you prefer a prompt).
6. Owner answers `plan-lens`; approve the brief; clear the chat; use the organizers' seed prompt from `docs/DEVPOST-ENTRY-CHECKLIST.md` or the clean handoff.
7. Before any commit: inspect `.mcp.json` for tokens (it is git-ignored here; keep it that way), run `git add -n`, show the file list to the owner.
8. Hand the editor to QA only when the Builder says so.

## Known blockers and risks

- No supported editor on Ubuntu: every Lens claim stays NOT RUN until tomorrow.
- Rights to Snap's Interaction Kit, UI Kit and other `.lspkg` packages are UNKNOWN (leaning allowed; a support question is drafted in `docs/LICENSING-AND-RIGHTS.md`, not sent). No LICENSE file has been added.
- Whether `import` from a plain TS module works inside a Lens project is unverified; the fallback is to paste `src/logic/*.ts` into one script asset.
- The `plan-lens` interview needs the owner's answers; budget about 20 minutes.
- Scene-relative placement and real hand/pinch input are only simulated in Preview.
- Time: feature freeze 18:00 CET, owner review 19:00, submit by 20:00 CET, hard deadline 23:00 CET.
