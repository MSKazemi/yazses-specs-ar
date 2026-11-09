# Testing record — YazSes Spatial Review

Recorded 2026-11-09 on Windows 11, Lens Studio 5.24.1 (build 26100516), SPECS Base Template, Preview device **SPECS 27**, input **Interactive** (Plane scene), Spectacles Interaction Kit 0.18.0, LEAF 2.0.2. Lens Studio was **not signed in** to an account; nothing here needed it. No physical glasses were used.

Statuses: PASS / FAIL / NOT RUN / BLOCKED. Only observed results are listed.

## Lens Studio Preview — acceptance criteria (LEAF, Preview target)

Scenarios live in `lens/YazSesSpatialReview/Assets/Tests/`. Button presses go through LEAF's `DefaultLeafInteractor` on the real UI Kit buttons. Each result was confirmed from the Lens log (`PASSED: <id>` plus the `[SpatialReview] <ACTION>: applied|ignored ...` lines), not only from the tool status.

| # | Criterion (design brief) | Scenario id | Result | Notes |
|---|---|---|---|---|
| 1 | Workbench and blocks shown, note hidden; Place note shows the note beside the blocks without covering them | `c1-place-note` | PASS | Geometry checked: note right of and above both blocks, within 35 cm of the workbench |
| 2 | A and B show the exact sentences; status stays "Draft — not confirmed"; selected option inactive; disclosure visible; Confirm/Cancel/Reset available | `c2-draft-selection` | PASS | |
| 3 | Confirm gives "Confirmed", keeps the sentence, other controls hidden; repeated Confirm has no effect | `c3-confirm` | PASS | The Confirm button is hidden after confirming, so the repeat is made by calling the controller's private handler twice; log shows both ignored, `confirmCount` stays 1. Re-run independently by the lead: PASS |
| 4 | Cancel clears the draft and confirms nothing; Reset after Cancel and after Confirm returns to the placed state | `c4-cancel-reset` | PASS | |
| 5 | Note keeps its world position when the viewpoint moves; parented to the workbench, not head-locked | `c5-spatial-stability` | PASS (third run) | Run 1 FAIL: camera did not move (device tracking overwrote the pose; test problem). Run 2 timed out (scenario dispatched during a reset; no verdict). Run 3 PASS after the test suspended device tracking to move the camera |

Orientation variant built: **note turns about its vertical axis to face the viewer** (yaw-only SIK Billboard); position never changes. Tests only assert the note stays upright and in place, **not** that it rotates toward the viewer.

## Manual Preview observations (screenshots, 2026-11-09 ~20:05)

- IDLE, DRAFT (A), CONFIRMED (with a duplicate Confirm and a later select ignored), CANCELLED and Reset were each rendered and captured by replaying the same events through the controller's debug `demoScript` input (since cleared; it is empty in the saved project). This verifies state and rendering, **not** clicking.
- Viewpoint moved 50 cm sideways and angled about 27 degrees toward the table: the note and buttons stayed beside the table and faced the camera. Observed visually; world positions were not read numerically.

## Not covered / NOT RUN

- **Real mouse clicks by a person in Interactive Preview:** NOT RUN by the agent (injected taps do not reach the SIK mouse interactor). Covered by LEAF's interactor only.
- **INTERRUPT:** no UI control; covered only by the portable unit tests.
- **Comfort, readability on real glasses, real hand tracking, reachability (IK interactor):** NOT RUN. Feel unproven.
- **Any run on a device (`onDevice=true`):** NOT RUN.
- **Portable unit tests (`npm test`) on Windows:** NOT RUN in this session (shell tools were unavailable). The Ubuntu result is recorded in the earlier commit history, not re-verified here.

## Package notes

- LEAF 4.0.0 (and Bitmoji 3D) were installed and removed: they import the newer `InteractionKit.lspkg` name and broke compilation (about 90 TS2307 errors). LEAF 2.0.2 is kept.
- An auto-added `AiPreviewAgentInspect` package was removed for the same reason; its leftover scene object was deleted.
- Final state: `RecompileTypeScriptTool` succeeded; Preview logs showed no Lens errors (only benign material-batching and LEAF plugin warnings).
