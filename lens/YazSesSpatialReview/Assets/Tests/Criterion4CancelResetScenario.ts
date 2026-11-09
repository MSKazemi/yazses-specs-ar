// Done criterion 4: cancellation and reset.
// Cancel clears the draft, shows "Cancelled", confirms nothing, A/B stay available for a new draft.
// Reset (after cancel or after confirm) returns to the placed state with no draft; note stays shown.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {
  DISCLOSURE,
  expectShownOnly,
  isInactive,
  NO_DRAFT_TEXT,
  readControllerState,
  requireObject,
  SpatialReviewLeafInteractor,
  STATUS_CANCELLED,
  STATUS_CONFIRMED,
  STATUS_DRAFT,
  TEXT_A,
  TEXT_B,
  textOf
} from "./SpatialReviewLeafHelpers"

function expectPlacedNoDraft(label: string): void {
  expect(requireObject("NoteCard").enabled, `${label}: note still shown`).toBe(true)
  expect(textOf("StatusText").toLowerCase().includes("choose a simulated transcription"), `${label}: placed status`).toBe(true)
  expect(textOf("SentenceText"), `${label}: no draft text`).toBe(NO_DRAFT_TEXT)
  expect(textOf("DisclosureText"), `${label}: disclosure`).toBe(DISCLOSURE)
  expectShownOnly(["SampleAButton", "SampleBButton"], label)
  expect(isInactive("SampleAButton"), `${label}: A active`).toBe(false)
  expect(isInactive("SampleBButton"), `${label}: B active`).toBe(false)
  expect(readControllerState().phase, `${label}: phase PLACED`).toBe("PLACED")
}

@component
export class Criterion4CancelResetScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new SpatialReviewLeafInteractor()
    await sleep(1000)
    await interactor.ensureDraft("A")
    const confirmsBefore = readControllerState().confirmCount

    // --- Cancel a draft ---
    await interactor.press("CancelButton")
    expect(textOf("StatusText"), "status after Cancel").toBe(STATUS_CANCELLED)
    expect(textOf("SentenceText"), "draft cleared").toBe(NO_DRAFT_TEXT)
    expect(textOf("SentenceText") === TEXT_A, "cancelled sentence is gone").toBe(false)
    expect(textOf("DisclosureText"), "disclosure after Cancel").toBe(DISCLOSURE)
    expect(readControllerState().phase, "phase CANCELLED").toBe("CANCELLED")
    expect(readControllerState().confirmCount, "Cancel confirms nothing").toBe(confirmsBefore)
    // A and B are available for a new draft; Confirm and Cancel are hidden; Reset stays available.
    expectShownOnly(["SampleAButton", "SampleBButton", "ResetButton"], "CANCELLED")
    expect(isInactive("SampleAButton"), "A active after cancel").toBe(false)
    expect(isInactive("SampleBButton"), "B active after cancel").toBe(false)

    // --- A new draft can be started after Cancel ---
    await interactor.press("SampleBButton")
    expect(textOf("StatusText"), "new draft status").toBe(STATUS_DRAFT)
    expect(textOf("SentenceText"), "new draft sentence").toBe(TEXT_B)
    expect(readControllerState().confirmCount, "new draft not confirmed").toBe(confirmsBefore)

    // --- Cancel again, then Reset after cancellation ---
    await interactor.press("CancelButton")
    expect(textOf("StatusText"), "cancelled again").toBe(STATUS_CANCELLED)
    await interactor.press("ResetButton")
    expectPlacedNoDraft("Reset after Cancel")
    expect(readControllerState().confirmCount, "Reset after Cancel confirms nothing").toBe(confirmsBefore)

    // --- Confirm, then Reset after confirmation ---
    await interactor.press("SampleAButton")
    await interactor.press("ConfirmButton")
    expect(textOf("StatusText"), "confirmed").toBe(STATUS_CONFIRMED)
    expect(readControllerState().confirmCount, "one deliberate confirmation").toBe(confirmsBefore + 1)
    await interactor.press("ResetButton")
    expectPlacedNoDraft("Reset after Confirm")

    // --- The flow repeats without restarting the Lens ---
    await interactor.press("SampleBButton")
    expect(textOf("StatusText"), "flow repeats: draft").toBe(STATUS_DRAFT)
    expect(textOf("SentenceText"), "flow repeats: sentence").toBe(TEXT_B)
    expect(readControllerState().confirmCount, "flow repeats: no extra confirmation").toBe(confirmsBefore + 1)
  }
}
