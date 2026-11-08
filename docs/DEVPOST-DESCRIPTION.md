# Devpost description — YazSes Spatial Review (DRAFT)

**Draft only.** Anything in `[FILL AFTER BUILD]` is not yet true and must be replaced with an observed fact or deleted before submission. The owner submits; nothing here has been posted.

---

## Project name

YazSes Spatial Review

## Tagline

Review a simulated transcription beside the task in AR, then explicitly confirm or cancel.

## Important disclosure

The input is simulated. The Lens shows the notice **"Simulated transcription — not live speech"**. It does not capture speech, does not run speech recognition, does not connect to the YazSes dictation software, and has not been tested on physical glasses.

## Inspiration and problem

Dictation tools write text somewhere the user is not looking: a window on another screen or a field in another app. When your hands and eyes are busy with a physical task, checking what was heard means looking away, and a wrong sentence can be accepted by accident.

We wanted to explore one small question: what would a review step look like if the draft sat in the scene next to the task, and nothing counted until you deliberately confirmed it?

This is a research prototype of the review step only. The author also maintains [YazSes](https://github.com/MSKazemi/yazses), an offline desktop dictation project; this Lens is **not integrated** with it.

## Who it is for

This is an exploration for people designing hands-busy, eyes-busy tools, such as a bench task where text must be checked without leaving the work. We have no user study and no evidence yet that it helps any group, including people who rely on accessibility features. Claims about benefit would be hypotheses to test.

## What it does

A small simulated tabletop scene has a note card beside a workbench. The user:

1. Places the note beside the workbench.
2. Chooses **Simulated transcription A** ("Prepare the blue and yellow blocks.") or **B** ("Place the blue block beside the yellow block."). Both are fixed preset strings, labelled as simulated.
3. Sees the choice as an unconfirmed draft. Switching between A and B never confirms.
4. Deliberately confirms or cancels. A repeated Confirm has no extra effect; Cancel commits nothing.
5. Resets to a clean placed note. An interruption discards the draft and cannot confirm it.

Status text names the current phase in words, so it is never colour-only. `[FILL AFTER BUILD: describe what the Lens in Preview actually does, including whether the card stays fixed in the scene as the viewpoint moves]`

## How we built it

The plan uses the organizer's official toolchain:

- **Devpost Learn `plan-lens`** to run the design interview and produce `devpost/design-brief.md`. `[FILL AFTER BUILD: state that this ran, with the brief's path, or remove this line]`
- **Snap CLAD** and **Lens Studio MCP**, driven from Claude Code with Lens Studio open, to inspect and build the scene. `[FILL AFTER BUILD: state what was actually done through MCP, with versions]`
- **Lens Studio (SPECS Base Template)** and its **Preview** to run and verify the Lens. `[FILL AFTER BUILD: Lens Studio version]`

Before the editor stage, the review logic was written as a small, pure TypeScript state machine with no dependency on Lens Studio, a browser or Node at runtime. Its phases are IDLE, PLACED, DRAFT, CONFIRMED and CANCELLED; its events are place, select sample, confirm, cancel, reset and interrupt. It has unit tests run with Vitest. `[FILL AFTER BUILD: test count and result from the recorded run]` The plan is to map this logic into Lens Studio's supported scripting and check it compiles and behaves in Preview. `[FILL AFTER BUILD: whether this worked, and what had to change]`

Parts of the code were written with an AI coding assistant; the human author reviewed what was submitted. `[OWNER TO CONFIRM wording]`

## Challenges

- Keeping the review step safe: no transition may confirm without an explicit Confirm received while a draft is open, including after a switch, reset or interruption.
- Separating what can be verified without the editor (state logic) from what cannot (scene, Preview behaviour). The editor was only available for part of the event period. `[FILL AFTER BUILD: real challenges encountered in Lens Studio]`
- Being clear that the input is simulated, so the Lens cannot be mistaken for working dictation.

## Honest limitations

- Simulated input only: two preset strings. No microphone, no speech recognition, no live transcription.
- Not integrated with YazSes; no YazSes code or bridge is used.
- No testing on physical SPECS or any headset; no hardware compatibility is claimed.
- Verified only in Lens Studio Preview `[FILL AFTER BUILD: confirm or correct]`.
- No object recognition; the blocks are part of the scene or sentence, not detected.
- No user testing and no evidence of accessibility benefit.
- `[FILL AFTER BUILD: any LEAF result, or "LEAF tests were not run"]`

## What's next (research directions, not commitments)

- Study whether a spatial review step reduces accidental acceptance of wrong text, compared with a flat window.
- If the interaction proves useful in Preview, test on real hardware.
- Only then consider how a real transcription source could feed it, which would be a separate design with its own privacy and consent review.

## Built with

- Lens Studio (SPECS Base Template) and Lens Studio Preview `[FILL AFTER BUILD: version]`
- Snap CLAD and Lens Studio MCP
- Devpost Learn `plan-lens` skill
- TypeScript
- Vitest (unit tests for the portable state logic)
- Claude Code (AI coding assistant) `[FILL AFTER BUILD: confirm final list]`

## Links

- Source: https://github.com/MSKazemi/yazses-specs-ar `[FILL AFTER BUILD: confirm the repository is public and contains the Lens project files]`
- Demo video: `[FILL AFTER BUILD: public YouTube URL, under 3 minutes]`
- Related project (not integrated): https://github.com/MSKazemi/yazses
