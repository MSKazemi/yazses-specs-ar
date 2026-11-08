# YazSes Spatial Review — SPECS AR experiment

**Status: preparation; not yet a working Lens Studio project.**

YazSes Spatial Review is a standalone research prototype for **SPECS / Lens Studio**. It explores how a person could review a small, scene-positioned text draft next to a tabletop task and explicitly confirm or cancel it.

The demonstration is designed around two **preset, clearly labelled simulated transcriptions**. It **does not** capture speech, run the YazSes dictation engine, connect a desktop to SPECS, or claim tested compatibility with physical glasses.

## Start here

Read the **[Ubuntu-first → Windows implementation roadmap](ROADMAP.md)** for the exact development stages, parallel Claude Code agent prompts, file ownership, acceptance tests, Windows Lens Studio handoff and competition submission gates.

### Platform split

| Stage | Platform | What can be done |
|---|---|---|
| Portable core and tests | Ubuntu Linux | TypeScript state transitions, unit tests, written interface contract and documentation |
| Native AR project and verification | Windows 11 64-bit / supported macOS | SPECS Base Template, CLAD/MCP, official `plan-lens`, scene scripts, actual Preview and LEAF tests |

This repository is **not** a substitute for a real Lens Studio `.esproj`. The official Devpost workflow requires a new SPECS Lens built through the official toolchain and working in Lens Studio Preview. A validated project will be documented here only after it exists.

## Planned user flow

1. Position a note beside a simulated workbench.
2. Choose **Simulated transcription A** or **B** (synthetic preset text).
3. Review the unconfirmed draft.
4. Deliberately **Confirm** or **Cancel**.
5. **Clear/Reset** without accidental confirmation.

A persistent notice will say **“Simulated transcription — not live speech.”** The text must remain scene-positioned as the Preview viewpoint moves. Current implementation/testing status is in the [roadmap](ROADMAP.md).

## Relationship to YazSes

[YazSes](https://github.com/MSKazemi/yazses) is an open-source, offline desktop voice dictation project. This separate AR experiment explores a possible **future review surface** for text; it is **not an included YazSes feature** or an operating voice bridge. Any integration into YazSes would need its existing technical decision and validation gates.

## Official references

- [Learn AR with SPECS — event and rules](https://learn-specs.devpost.com/rules)
- [Organizer Devpost Learn skill pack](https://github.com/challengepost/learn-specs)
- [Snap Lens Studio](https://ar.snap.com/download)
- [Snap CLAD](https://developers.specs.com/docs/clad)

**Competition submission deadline:** November 9, 2026, at 17:00 EST / 23:00 CET (Italy). Registration, real Lens Preview, a public under-three-minute YouTube demonstration and final Devpost submission are distinct actions.
