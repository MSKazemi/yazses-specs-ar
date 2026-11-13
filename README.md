# YazSes Spatial Review — SPECS AR experiment

> **The input in this project is simulated.** Nothing captures speech: there is no microphone access, no speech recognition, no YazSes dictation engine and no YazSes desktop bridge. The only "transcriptions" are two preset strings, always labelled as simulated. No headset or physical SPECS validation has been done. The repository holds a portable TypeScript state core with its unit tests and, since 2026-11-09, a Lens Studio project (`lens/YazSesSpatialReview/`) that has been run **in Lens Studio Preview only**. The entry is on Devpost as the [YazSes Spatial Review project page](https://devpost.com/software/yazses-spatial-review), shown there as submitted to Learn AR with SPECS (checked 2026-11-13).

YazSes Spatial Review is a standalone research prototype for **SPECS / Lens Studio**. It explores how a person could review a short, scene-positioned text draft next to a tabletop task, and then deliberately confirm or cancel it. The on-screen notice is always: **"Simulated transcription — not live speech"**.

## Status

Legend: **IMPLEMENTED** = source exists in this repo. **TESTED** = an automated test was run and its output recorded. **PROPOSED** = designed on paper only. **NOT RUN** = needs a tool or device that has not been used yet.

Unit-test status is recorded from real command output (Ubuntu, Node 24.21.0, TypeScript 7.0.2, vitest 5.1.0, 2026-11-08). Lens Studio Preview results are recorded in [docs/TESTING.md](docs/TESTING.md) (Windows 11, Lens Studio 5.24.1, 2026-11-09). Portable unit tests are **not** Lens Studio validation.

Task board: [TASKS.md](TASKS.md) ([epic #1](https://github.com/MSKazemi/yazses-specs-ar/issues/1)). Roadmap and gates: [ROADMAP.md](ROADMAP.md). Windows steps: [docs/WINDOWS-HANDOFF.md](docs/WINDOWS-HANDOFF.md).

| Capability | Implemented | Tested | Where |
|---|---|---|---|
| Portable state core: phases `IDLE`, `PLACED`, `DRAFT`, `CONFIRMED`, `CANCELLED`; events `PLACE`, `SELECT_SAMPLE`, `CONFIRM`, `CANCEL`, `RESET`, `INTERRUPT` | Yes (portable TypeScript, no Lens Studio dependency) | PASS: 168 tests in 6 files, `npm test` exit 0 (includes a seeded 100,000-transition property test) | `src/logic/`, [contract](docs/STATE-CONTRACT.md) |
| View model (`describe`): status text, which controls are enabled, disclosure in every phase | Yes | PASS: covered by the same 168 tests | `src/logic/` |
| Type check of source and tests | n/a | PASS: `npm run typecheck` exit 0 | `tsconfig*.json` |
| Lens Studio API mapping and open questions | Written from public documentation by a research agent | Used to build the Lens project; the mapping itself is not a test | [INTEGRATION-CONTRACT](docs/INTEGRATION-CONTRACT.md) |
| Lens Studio project (`.esproj`, scene, scripts) | Yes, committed 2026-11-09 | Compiled and run in Preview; see the row below | `lens/YazSesSpatialReview/` |
| Lens Studio Preview behaviour (scene-relative card, controls) | Yes | Five LEAF scenarios, one per done criterion, recorded as PASS in Preview (SPECS 27, Interactive input); one of them passed only on its third run. Real mouse clicks by a person: NOT RUN. Comfort, readability and hand tracking: NOT RUN | [TESTING](docs/TESTING.md) |
| Official `plan-lens` design brief (`devpost/design-brief.md`) | Yes | Not a test | `lens/YazSesSpatialReview/devpost/design-brief.md` |
| Snap CLAD and Lens Studio MCP scene inspection | Used to build and run the project, per [TESTING](docs/TESTING.md) | Not a test | — |
| LEAF tests | Yes, five scenarios | See the Preview row above | `lens/YazSesSpatialReview/Assets/Tests/` |
| Demo video (real Preview screen recording) | No recording is committed to this repository | Not tracked here | storyboard: [DEMO](docs/DEMO.md) |
| Devpost entry | Public project page, shown as submitted to Learn AR with SPECS | Not applicable | [project page](https://devpost.com/software/yazses-spatial-review); earlier [draft text](docs/DEVPOST-DESCRIPTION.md) |
| Physical SPECS / headset | **No** | NOT RUN, and no compatibility is claimed | — |
| Speech capture, transcription, YazSes integration | **No**, and out of scope | not applicable | — |

Passing unit tests on Ubuntu do **not** show that a Lens works on glasses. They cover plain logic. What was observed inside Lens Studio Preview, and what was not, is listed in [docs/TESTING.md](docs/TESTING.md); no device run was made.

## What the prototype does

The user flow below is what the Lens Studio project implements. Steps 1 to 5 were exercised in Preview by the LEAF scenarios or the replayed events described in [docs/TESTING.md](docs/TESTING.md), except `INTERRUPT`, which has no UI control and is covered only by the unit tests. None of it has been run on glasses:

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

The status table above records the Ubuntu run (168 tests in 6 files, exit 0). Re-run the commands on your machine and record your own printed counts and exit codes; a different count means the tests or code changed.

### Lens Studio project

The project is at `lens/YazSesSpatialReview/YazSesSpatialReview.esproj`. Open it in Lens Studio 5.24.1 on Windows 11 (the version used in [docs/TESTING.md](docs/TESTING.md)) and choose the SPECS 27 Preview device. The LEAF scenarios are in `lens/YazSesSpatialReview/Assets/Tests/`. The project keeps LEAF 2.0.2 and the template's own packages; [docs/TESTING.md](docs/TESTING.md) explains why newer ones were removed. The original Windows plan is kept in [docs/WINDOWS-HANDOFF.md](docs/WINDOWS-HANDOFF.md) and the [roadmap](ROADMAP.md) for reference.

A claim of a working Lens means "works in Lens Studio Preview" and nothing more.

## Relationship to YazSes

[YazSes](https://github.com/MSKazemi/yazses) is an open-source, offline desktop voice dictation project. This repository is a separate experiment about a possible future review surface for text. It is **not integrated** with YazSes: it imports nothing from it, talks to no YazSes process, and is not a YazSes feature or release. Any real integration would need YazSes' own technical decision and validation gates first.

## Known limitations

- Input is two hard-coded strings. There is no speech, no audio and no live transcription.
- The Lens was run in Lens Studio Preview only (SPECS 27, Interactive input). No `onDevice` run was made.
- No physical SPECS or other headset has been used; no hardware compatibility is claimed. Comfort, readability and hand tracking on real glasses are unproven.
- The note keeps its world position while the viewpoint moves, as asserted by a LEAF scenario that moves the camera by script with device tracking suspended. That it turns to face the viewer was checked by eye, not asserted.
- Real mouse clicks by a person in Interactive Preview were not run; button presses are tested through LEAF's interactor.
- The prototype does not recognise real objects; the "blue and yellow blocks" are text in a sample sentence.
- No evidence yet that this review step helps any user or improves accessibility.
- Debouncing and pinch or tap timing are not part of the core; it only makes a repeated `CONFIRM` harmless by phase.
- `npm test` covers the pure core only; the Lens-side checks are the five LEAF scenarios.

## Attribution and licensing

No licence file has been added yet, because rights to Snap-owned template files are unverified. The Lens Studio SPECS Base Template and any bundled assets carry their own terms, and the project must not be relicensed in a way those terms do not allow. See [docs/LICENSING-AND-RIGHTS.md](docs/LICENSING-AND-RIGHTS.md) for what is known and what is open. Until that is resolved, no one should assume any particular open-source licence applies to this repository.

## More documents

- [docs/TESTING.md](docs/TESTING.md): the observed Lens Studio Preview results, including what was not run.
- [ROADMAP.md](ROADMAP.md): the original Ubuntu to Windows plan and gates. Written before the Lens project existed, so its acceptance matrix may be behind [docs/TESTING.md](docs/TESTING.md).
- [docs/STATE-CONTRACT.md](docs/STATE-CONTRACT.md): the exact state machine.
- [docs/INTEGRATION-CONTRACT.md](docs/INTEGRATION-CONTRACT.md): Lens Studio mapping, with unknowns flagged.
- [docs/DEMO.md](docs/DEMO.md): storyboard for a Preview recording (script only).
- [docs/DEVPOST-DESCRIPTION.md](docs/DEVPOST-DESCRIPTION.md): earlier draft of the submission text; the public page is the reference.
- [docs/DEVPOST-ENTRY-CHECKLIST.md](docs/DEVPOST-ENTRY-CHECKLIST.md): entry checklist, written before the submission.
- [docs/WINDOWS-HANDOFF.md](docs/WINDOWS-HANDOFF.md): the original Windows stage instructions.
- [docs/LICENSING-AND-RIGHTS.md](docs/LICENSING-AND-RIGHTS.md): rights and attribution.

## Official references

- [Learn AR with SPECS: event and rules](https://learn-specs.devpost.com/rules)
- [Organizer Devpost Learn skill pack](https://github.com/challengepost/learn-specs)
- [Snap Lens Studio](https://ar.snap.com/download)
- [Snap CLAD](https://developers.specs.com/docs/clad)

**Competition submission deadline:** November 9, 2026, 17:00 EST / 23:00 CET (Italy).
