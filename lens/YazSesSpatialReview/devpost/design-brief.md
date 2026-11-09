---
status: approved
---

# Design brief: YazSes Spatial Review

<!-- Filled in by plan-lens from the learner's interview. Use the learner's words. Mark any value they didn't choose as (default). -->

## The one spatial moment
I'm standing at a tabletop workbench, arranging two colored blocks while keeping my attention on the task. A small, readable note sits in the world beside the workbench, slightly below eye level. I pick one of two simulated transcriptions, see it as a clearly marked **unconfirmed draft** on the note, read it without leaving the task, and then deliberately press **Confirm** (the note changes to **Confirmed**) or **Cancel** (the draft is discarded). The most important moment is seeing an unconfirmed sentence beside the task and consciously approving it with one clear interaction.

The on-note text "Simulated transcription — not live speech" is visible whenever the note is displayed (every state except IDLE, where the note is hidden). Nothing is sent, saved externally or executed. Confirmation only changes the local demonstration state.

## Why it belongs on glasses
- Uses: draws in the world (the note belongs to the workbench) and leaves your body free (hands and eyes stay on the physical task while you review dictated text).
- Why it's better than the phone or laptop version: the dictated text is reviewed *beside the task* instead of on a separate screen that pulls your eyes and hands away. A phone would need you to put the work down.

## Product or overlay
- Type: product. The virtual workbench, blocks and note are the experience.
- What the real version would sense: live dictated speech from YazSes (a possible future research direction; not part of this Lens).
- Stand-in for the preview: two labelled preset controls, **Simulated transcription A** and **Simulated transcription B**, instead of a microphone. No speech recognition, microphone, cloud service or connection to the YazSes application. No real-world surface detection or object recognition; the workbench and note are entirely virtual.
  - A = "Prepare the blue and yellow blocks."
  - B = "Place the blue block beside the yellow block."

## Where things live
- Where the user is looking during the main task: down at the tabletop, with the note just to the right of the blocks. Comfortable viewing area in SPECS Preview.
- Workbench: about 1.1 m in front of the user, slightly below eye level. Compact tabletop, about 60 cm wide and 40 cm deep. Virtual and fixed in the scene.
- Blue block and yellow block: two clearly distinguishable stationary blocks on the tabletop. No physics, grabbing or recognition. Block size: about 8 cm cubes (default).
- Spatial note: appears immediately to the right of the two blocks, near the right edge of the tabletop, at a predefined position (no free dragging). About 28 cm wide and 18 cm tall with large, readable text. It must not cover the blocks. Its position stays fixed relative to the workbench; it never follows the user's head or camera.
- Control panel: a compact group of buttons directly below the note, aligned with it, near the right side of the workbench. Large, clearly labelled targets.
- "Place note" button: near the right side of the workbench, before the note is placed (exact spot: default, just in front of where the note will appear).

## Hands and input
- Place note: press the button. Standard SPECS UI Kit button.
- Choose sample: press "Simulated transcription A" or "Simulated transcription B".
- Confirm: press the Confirm button. Only an explicit press confirms. Confirm sits visually apart from Cancel so it can't be hit by accident.
- Cancel: press the Cancel button.
- Reset: press the Reset button.
- Standard SPECS buttons driven by the mouse in Interactive Preview only. No custom gestures.
- Targets are big and highlight when aimed at.
- Voice: none. Every action is a button.

## When things show
Controls that are not valid are hidden rather than shown as many disabled buttons, to keep the interface clean.
- **Before placement (IDLE):** the workbench and two blocks are visible. Only the "Place note" button is shown. The note is hidden.
- **After placement (PLACED):** the note is shown with "Choose a simulated transcription". The A and B buttons are shown beneath it. Confirm and Cancel are hidden until a draft exists.
- **While reviewing a draft (DRAFT):** the selected sentence is shown prominently with a clear "Draft — not confirmed" status. A and B stay available for switching, and the currently selected one is inactive. Confirm, Cancel and Reset are shown. Confirm is visually separated from Cancel.
- **After confirmation (CONFIRMED):** the confirmed sentence stays visible and the status reads "Confirmed". Confirm, Cancel and the A/B controls are hidden or inactive. Reset is shown. A repeated press has no further effect.
- **After cancellation (CANCELLED):** the draft is cleared and the status reads "Cancelled". A and B are shown so a new draft can start. Reset stays available.
- **Reset:** returns to the placed state with no draft. The note does not disappear.
- **Orientation:** the note keeps one fixed position beside the workbench, but rotates gently around its vertical axis to face the user's viewing direction, so the text stays readable. Only its orientation changes, never its position or distance. The controls below stay aligned with the note. Use standard Lens Studio components; avoid unnecessary animation or complex tracking.
- If something needs attention out of view: none.

## Done criteria
Each one can be checked in Lens Studio's preview.
1. **Workbench and note placement.** When Preview starts, I see a virtual workbench with one blue block and one yellow block about 1.1 m in front of me, and the note is hidden. When I click Place note, a readable note appears to the right of the blocks with its controls below it, without covering the blocks. PASS: the note appears in the intended position only after I explicitly activate Place note.
2. **Simulated transcription selection and draft review.** Clicking Simulated transcription A shows "Prepare the blue and yellow blocks." Clicking B shows "Place the blue block beside the yellow block." The status stays "Draft — not confirmed" when switching, and the selected option becomes inactive. "Simulated transcription — not live speech" stays visible. PASS: both presets display correctly, switching never confirms, and Confirm, Cancel and Reset are available while reviewing.
3. **Explicit confirmation, no accidental confirmation.** Clicking Confirm on a displayed draft changes the status to "Confirmed" and keeps the sentence visible. Confirm, Cancel and sample selection then disappear or become inactive. Clicking again does not create another confirmation or change the text. PASS: only a deliberate Confirm confirms a draft, and repeated confirmation has no extra effect.
4. **Cancellation and reset.** Clicking Cancel during review clears the draft, shows "Cancelled", and confirms nothing; I can pick A or B for a new draft. Clicking Reset after cancellation or confirmation returns the note to the placed state with no draft. PASS: Cancel never confirms, Reset clears the draft or confirmation, and the flow can repeat without restarting Preview.
5. **Spatial stability and readability.** When I move my viewpoint around the workbench in Preview, the note stays in the same place beside the workbench and does not move with my head. It may rotate gently about its vertical axis to face me, but its world position and distance do not change because I move. Its buttons stay aligned beneath it, and the text, status and disclosure stay readable. PASS: the note is visibly tied to the workbench, stays usable as the viewpoint changes, and does not behave like a head-locked interface. **Fallback:** if gentle rotation toward the viewer is not reliable in Preview, the note instead keeps a fixed angle facing the starting viewpoint. In that case the rotation part of this criterion is dropped and the rest (fixed position, aligned buttons, readable text, not head-locked) still has to pass. Say which version was built.

Overall: all five work in the real SPECS Preview with no live audio, speech recognition, external service or YazSes desktop connection, using only the two simulated presets.

## Out of scope
- Live speech recognition, a microphone, or any audio capture.
- Cloud services, network calls, or any connection to the YazSes application.
- Sending, saving or executing the confirmed text anywhere. Confirm only changes local demo state.
- Real-world surface detection, object recognition, or physical/persistent anchoring.
- Moving, grabbing or physics on the blocks; free dragging of the note.
- Custom or two-hand gestures.
- Any claim of SPECS hardware compatibility or proven accessibility benefit.

## Risks and open questions
- "Feel unproven": comfort over time, real hand tracking and readability on actual SPECS glasses cannot be judged in Preview.
- The brief says to hide irrelevant controls, but also to keep the currently selected A/B option inactive in the draft state. Build the selected option as inactive (greyed or highlighted) and keep other irrelevant controls hidden.
- The project's state-machine plan includes an INTERRUPT action. The learner did not describe an interruption in the Lens, so it has no button or other user-facing control in this version. The state-machine logic itself keeps INTERRUPT (it must never auto-confirm).
- Facing the viewer while staying in place depends on a standard Lens Studio mechanism working in Preview. If it does not work reliably, fall back to a fixed angle that faces the starting viewpoint, and say so (see done criterion 5).
- Review decisions (confirmed by the learner via their ChatGPT project chat): 8 cm blocks; Place note button just in front of the note's intended position near the right side of the workbench, not covering the blocks; selected A/B option stays visible but disabled while the other stays active; other irrelevant controls hidden.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
