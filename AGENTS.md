# AGENTS.md — SPECS standalone technical prototype

This file governs coding agents working inside **MSKazemi/yazses-specs-ar**. Read [ROADMAP.md](ROADMAP.md) first for the actual Ubuntu → Windows handoff, prompts, task gates and expected evidence. This repo is **not** the core YazSes application.

## What the prototype is

**YazSes Spatial Review:** a *proposed* new SPECS Lens Studio experience with a note positioned beside a simulated tabletop workbench, two visibly labelled synthetic inputs (**Simulated transcription A/B**), draft review, deliberate Confirm/Cancel, and Clear/Reset. The UI must say **"Simulated transcription — not live speech."**

There is **no** real microphone, live transcription, YazSes engine/desktop bridge, external sending, object recognition, physical-glasses support claim, or proof of accessibility benefit. Never imply those exist. Do not expose real user audio, transcripts, voiceprints, personal identifiers or credentials to coding agents.

## Platform boundaries

- **Ubuntu (November 8):** pure portable TypeScript state logic, unit tests, public technical docs and independently researched Lens API assumptions. **No** fabricated `.esproj`, live Lens Studio Preview, CLAD/MCP or LEAF results.
- **Windows 11 native (November 9):** Lens Studio **SPECS → Base Template → File > Save As**, actual editor Preview, official Snap CLAD and Lens Studio MCP, authentic Devpost Learn `plan-lens` interview generating `devpost/design-brief.md`, implementation and real Preview/LEAF testing. Always report actual versions/observations.
- The official tool workflow is required for the hackathon; portable unit tests do **not** substitute for native Lens project functionality.

## Multi-agent concurrent file ownership (avoid collisions)

| Role | Exclusive write ownership |
|---|---|
| Lead | `package.json`, lockfile, `tsconfig*`, `.gitignore`, shared integration, **Git index/commits/push** |
| Domain | `src/logic/` only; no Node/DOM/Lens SDK import at runtime |
| QA | `tests/` only; no domain source mutations |
| Lens research | `docs/INTEGRATION-CONTRACT.md` only; verified official references, mark unknown API details |
| Docs | `README.md`, `docs/DEMO.md` only; draft claims until evidence |
| Native Windows Builder | Sole live Lens Studio scene/scripts writer and CLAD/MCP controller; other agents cannot call editor concurrently |

Agents may **read** each other's files; they must not independently write shared files or run concurrent Git mutations. On Windows, QA receives temporary exclusive editor control only after Builder explicitly yields it. If agent teams are unsupported, use smaller read-only subagents rather than simultaneous editors.

## Repo and publication safety

- Inspect current path, remote, branch, Git status and history before edits. Preserve existing work: **no reset, clean, force-push or destructive rebases**.
- Never copy files or Git history from any private business repository. Do not reference private paths or issue URLs in public outputs.
- Do not change the existing main YazSes application/release; its ADR-030 technical decision gates still apply to future real XR integration.
- Do not commit `.env`, API tokens, local account credentials, auth-bearing `.mcp.json`, personal recordings, unlicensed assets or unrelated browser-session captures. Inspect staged files and history before any public push.
- No new paid resources, subscription upgrades, cloud API, token overages, hidden telemetry or outbound voice data. Ask the owner for approval of any external install, significant permission or public publication.
- Record test state as **PASS / FAIL / NOT RUN / BLOCKED**, with exact command or Preview steps, observed result, tool version and evidence. Never report a successful Lens/LEAF/device test unless it actually ran.
- Do not click final Devpost Join/terms, YouTube publication or hackathon Submit without owner's specific action/approval. Judges require actual Lens Studio project files, truthful demo and event-specific submitted entry.
- Project code/asset rights remain subject to organizer template and third-party licenses; Apache-2.0 licensing should be evaluated against actual assets before being applied.

## Default workflow

1. Read `ROADMAP.md`, inspect Git state and identify current OS.
2. On Ubuntu run independent Domain/QA/Lens-Research/Docs tasks; Lead alone sets up the TypeScript test tooling, integrates and reports results.
3. Prepare a reviewed feature-branch commit and explicit owner approval before publishing source.
4. On Windows use the genuine Lens Studio project, approved `plan-lens` brief, CLAD/MCP and real Preview evidence. Reuse the portable state contract only after checking editor compilation.
5. Prepare public assets, English description and real under-three-minute Preview video; owner performs final Devpost submit by **2026-11-09 23:00 CET**.

**Current status:** planning documentation; do not infer that application code, Lens project, tests or submission exist merely because an agent prompt is present.
