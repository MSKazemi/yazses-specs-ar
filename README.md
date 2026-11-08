# YazSes Spatial Review — SPECS AR experiment

> **The input in this project is simulated.** Nothing captures speech: there is no microphone access, no speech recognition, no YazSes dictation engine and no YazSes desktop bridge. The only "transcriptions" are two preset strings, always labelled as simulated. No headset or physical SPECS validation has been done. At the time of writing there is **no working Lens Studio project in this repository**; only a portable TypeScript state core and its tests are being built.

YazSes Spatial Review is a standalone research prototype for **SPECS / Lens Studio**. It explores how a person could review a short, scene-positioned text draft next to a tabletop task, and then deliberately confirm or cancel it. The on-screen notice is always: **"Simulated transcription — not live speech"**.

## Status

Legend: **IMPLEMENTED** = source exists in this repo. **TESTED** = an automated test was run and its output recorded. **PROPOSED** = designed on paper only. **NOT RUN** = needs a tool or device that has not been used yet.

Status is recorded from real command output (Ubuntu, Node 24.21.0, TypeScript 7.0.2, vitest 5.1.0, 2026-11-08). Portable unit tests are **not** Lens Studio validation.

Task board: [TASKS.md](TASKS.md) ([epic #1](https://github.com/MSKazemi/yazses-specs-ar/issues/1)). Roadmap and gates: [ROADMAP.md](ROADMAP.md). Windows steps: [docs/WINDOWS-HANDOFF.md](docs/WINDOWS-HANDOFF.md).

| Capability | Implemented | Tested | Where |
|---|---|---|---|
| Portable state core: phases `IDLE`, `PLACED`, `DRAFT`, `CONFIRMED`, `CANCELLED`; events `PLACE`, `SELECT_SAMPLE`, `CONFIRM`, `CANCEL`, `RESET`, `INTERRUPT` | Yes (portable TypeScript, no Lens Studio dependency) | PASS: 118 tests in 5 files, `npm test` exit 0 (includes a seeded 100,000-transition property test) | `src/logic/`, [contract](docs/STATE-CONTRACT.md) |
| View model (`describe`): status text, which controls are enabled, disclosure in every phase | Yes | PASS: covered by the same 118 tests | `src/logic/` |
| Type check of source and tests | n/a | PASS: `npm run typecheck` exit 0 | `tsconfig*.json` |
| Lens Studio API mapping and open questions | Written from public documentation by a research agent | NOT RUN (no editor available on Ubuntu) | [INTEGRATION-CONTRACT](docs/INTEGRATION-CONTRACT.md) |
| Lens Studio project (`.esproj`, scene, scripts) | **No** — PROPOSED, to be created on Windows | NOT RUN | `lens/` (does not exist yet) |
| Lens Studio Preview behaviour (scene-relative card, controls) | **No** | NOT RUN | — |
| Official `plan-lens` design brief (`devpost/design-brief.md`) | **No** — PROPOSED | NOT RUN | — |
| Snap CLAD and Lens Studio MCP scene inspection | **No** — PROPOSED | NOT RUN | — |
| LEAF tests (if available in the editor) | **No** — PROPOSED | NOT RUN | — |
| Demo video (real Preview screen recording) | **No** — storyboard only | NOT RUN | [DEMO](docs/DEMO.md) |
| Devpost entry | **No** — draft text only | NOT RUN | [description draft](docs/DEVPOST-DESCRIPTION.md), [checklist](docs/DEVPOST-ENTRY-CHECKLIST.md) |
| Physical SPECS / headset | **No** | NOT RUN, and no compatibility is claimed | — |
| Speech capture, transcription, YazSes integration | **No**, and out of scope | not applicable | — |

Passing unit tests on Ubuntu do **not** show that a Lens works. The state core is plain logic; whether it compiles and behaves inside Lens Studio is a separate question that only the Windows stage can answer.

## What the prototype is meant to do

A planned user flow, none of which has been shown in Lens Studio yet:

1. Position a note beside a simulated workbench (`PLACE`).
2. Choose **Simulated transcription A** or **B** (`SELECT_SAMPLE`). The sample text appears as an unconfirmed draft.
   - A: "Prepare the blue and yellow blocks."
   - B: "Place the blue block beside the yellow block."
3. Switch between A and B if wanted. Switching never confirms.
4. Deliberately **Confirm** or **Cancel** (`CONFIRM` / `CANCEL`). A second Confirm has no further effect. Cancel commits nothing.
5. **Reset** (`RESET`) returns to the placed note with no draft. `INTERRUPT` discards an open draft and can never confirm it.

The rules the core enforces (no draft before placement, no confirmation without an explicit `CONFIRM` in the draft phase, repeated `CONFIRM` is harmless, malformed events are ignored rather than thrown) are specified in [docs/STATE-CONTRACT.md](docs/STATE-CONTRACT.md).

## Setup and reproduction

### Portable core (Ubuntu, or any OS with Node)

Requirements: Node.js `^22.12.0 || ^24.0.0 || >=26.0.0` (the `engines` field in `package.json`, set because `vitest 5.1.0` needs it) and npm. The lockfile pins `typescript 7.0.2` and `vitest 5.1.0`.

```sh
npm install
npm test            # vitest run
npm run typecheck   # tsc --noEmit for source and tests
```

Record the printed test counts and exit code from your own run; this README does not contain a pass count because none has been recorded yet.

### Lens Studio project (pending, Windows)

Not done. The planned steps, from the [roadmap](ROADMAP.md) and [Windows handoff](docs/WINDOWS-HANDOFF.md):

1. In Lens Studio on Windows 11: **SPECS, Base Template, File, Save As**, then confirm Preview runs.
2. Connect Snap CLAD and Lens Studio MCP and inspect the active scene.
3. Run the organizer's `plan-lens` interview to produce `devpost/design-brief.md`.
4. Map the tested state core into Lens Studio's supported scripting, then test in Preview.

When a real `.esproj` exists, this README will point to its exact path. Until then, treat any claim of a working Lens as false.

## Relationship to YazSes

[YazSes](https://github.com/MSKazemi/yazses) is an open-source, offline desktop voice dictation project. This repository is a separate experiment about a possible future review surface for text. It is **not integrated** with YazSes: it imports nothing from it, talks to no YazSes process, and is not a YazSes feature or release. Any real integration would need YazSes' own technical decision and validation gates first.

## Known limitations

- Input is two hard-coded strings. There is no speech, no audio and no live transcription.
- No Lens Studio project exists yet; nothing has been run in Preview.
- No physical SPECS or other headset has been used; no hardware compatibility is claimed.
- Placement is a state flag in the core. Whether and how a card stays fixed in the scene is unverified until Preview testing.
- The prototype does not recognise real objects; the "blue and yellow blocks" are text in a sample sentence.
- No evidence yet that this review step helps any user or improves accessibility.
- Debouncing and pinch or tap timing belong to the future Lens adapter; the core only makes a repeated `CONFIRM` harmless by phase.
- Test coverage is whatever `npm test` reports; it covers the pure core only.

## Attribution and licensing

No licence file has been added yet, because rights to Snap-owned template files are unverified. The Lens Studio SPECS Base Template and any bundled assets carry their own terms, and the project must not be relicensed in a way those terms do not allow. See [docs/LICENSING-AND-RIGHTS.md](docs/LICENSING-AND-RIGHTS.md) for what is known and what is open. Until that is resolved, no one should assume any particular open-source licence applies to this repository.

## More documents

- [ROADMAP.md](ROADMAP.md): Ubuntu to Windows plan, gates, acceptance matrix (every Lens-dependent check is NOT RUN).
- [docs/STATE-CONTRACT.md](docs/STATE-CONTRACT.md): the exact state machine.
- [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md): Lens Studio mapping, with unknowns flagged.
- [docs/DEMO.md](docs/DEMO.md): storyboard for the Preview recording (not yet recorded).
- [docs/DEVPOST-DESCRIPTION.md](docs/DEVPOST-DESCRIPTION.md): draft submission text.
- [docs/DEVPOST-ENTRY-CHECKLIST.md](docs/DEVPOST-ENTRY-CHECKLIST.md): entry checklist.
- [docs/WINDOWS-HANDOFF.md](docs/WINDOWS-HANDOFF.md): Windows stage instructions.
- [docs/LICENSING-AND-RIGHTS.md](docs/LICENSING-AND-RIGHTS.md): rights and attribution.

## Official references

- [Learn AR with SPECS: event and rules](https://learn-specs.devpost.com/rules)
- [Organizer Devpost Learn skill pack](https://github.com/challengepost/learn-specs)
- [Snap Lens Studio](https://ar.snap.com/download)
- [Snap CLAD](https://developers.specs.com/docs/clad)

**Competition submission deadline:** November 9, 2026, 17:00 EST / 23:00 CET (Italy).
