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

Status text names the current phase in words, so it is never colour-only. In Lens Studio Preview (SPECS 27, Interactive) the Lens shows a virtual 60 x 40 cm workbench about 110 cm ahead with a blue and a yellow 8 cm block. The note card floats at a fixed position beside the workbench with its buttons directly beneath it. It stays at that position when the viewpoint moves and turns about its vertical axis to face the viewer (a yaw-only Spectacles Interaction Kit Billboard); controls that are not valid in a state are hidden, and the currently selected sample button stays visible but inactive.

## How we built it

The plan uses the organizer's official toolchain:

- **Devpost Learn `plan-lens`** design brief: the approved brief is in `lens/YazSesSpatialReview/devpost/design-brief.md`. `[OWNER TO CONFIRM: that you answered the plan-lens interview yourself]`
- **Snap CLAD** and **Lens Studio MCP**, driven from Claude Code with Lens Studio open: the scene (workbench, blocks, note anchor, script wiring) was created and wired through the MCP scene tools, TypeScript was compiled and run through the MCP, Preview was configured and captured through it, and the acceptance tests were run through the LEAF panel via the MCP.
- **Lens Studio 5.24.1 (SPECS Base Template)** and its **Preview** (SPECS 27, Interactive) to run and verify the Lens, with Spectacles Interaction Kit 0.18.0, Spectacles UI Kit and LEAF 2.0.2.

Before the editor stage, the review logic was written as a small, pure TypeScript state machine with no dependency on Lens Studio, a browser or Node at runtime. Its phases are IDLE, PLACED, DRAFT, CONFIRMED and CANCELLED; its events are place, select sample, confirm, cancel, reset and interrupt. It has unit tests run with Vitest (recorded on Ubuntu in an earlier commit; see `docs/TESTING.md`). The same source files are copied unchanged into the Lens project (`Assets/Scripts/Logic/`), compile in Lens Studio without adaptation, and drive the Lens through a small controller script; the UI script only renders the logic's view model.

Parts of the code were written with an AI coding assistant; the human author reviewed what was submitted. `[OWNER TO CONFIRM wording]`

## Challenges

- Keeping the review step safe: no transition may confirm without an explicit Confirm received while a draft is open, including after a switch, reset or interruption.
- Separating what can be verified without the editor (state logic) from what cannot (scene, Preview behaviour). The editor was only available for part of the event period.
- Package versions: the Asset Library's newer UI Kit, LEAF 4.0.0 and preview-agent packages import a newer SIK package name than the one in the 5.24.1 SPECS Base Template, which broke compilation. We kept the template's packages, used LEAF 2.0.2 (compatible), and removed the incompatible add-ons.
- Preview mouse clicks are not driven by the generic injected-tap tool, so button presses are tested through LEAF's SIK interactor instead.
- Being clear that the input is simulated, so the Lens cannot be mistaken for working dictation.

## Honest limitations

- Simulated input only: two preset strings. No microphone, no speech recognition, no live transcription.
- Not integrated with YazSes; no YazSes code or bridge is used.
- No testing on physical SPECS or any headset; no hardware compatibility is claimed.
- Verified only in Lens Studio Preview (SPECS 27, Interactive); readability, comfort and hand tracking on real glasses are unproven.
- No object recognition; the blocks are part of the scene or sentence, not detected.
- No user testing and no evidence of accessibility benefit.
- LEAF (Preview target): five scenarios, one per acceptance criterion, all passed on the final runs; criterion 5 moves the camera by script with device tracking suspended, so it is not a real walk-around, and rotation toward the viewer is not asserted. No test ran on a device. See `docs/TESTING.md`.

## What's next (research directions, not commitments)

- Study whether a spatial review step reduces accidental acceptance of wrong text, compared with a flat window.
- If the interaction proves useful in Preview, test on real hardware.
- Only then consider how a real transcription source could feed it, which would be a separate design with its own privacy and consent review.

## Built with

- Lens Studio 5.24.1 (SPECS Base Template), Lens Studio Preview, Spectacles Interaction Kit, Spectacles UI Kit, LEAF
- Snap CLAD and Lens Studio MCP
- Devpost Learn `plan-lens` skill
- TypeScript
- Vitest (unit tests for the portable state logic)
- Claude Code (AI coding assistant) `[FILL AFTER BUILD: confirm final list]`

## Links

- Source: https://github.com/MSKazemi/yazses-specs-ar (Lens project in `lens/YazSesSpatialReview/`) `[OWNER: confirm the push landed and the repo is public]`
- Demo video: `[FILL AFTER BUILD: public YouTube URL, under 3 minutes]`
- Related project (not integrated): https://github.com/MSKazemi/yazses
