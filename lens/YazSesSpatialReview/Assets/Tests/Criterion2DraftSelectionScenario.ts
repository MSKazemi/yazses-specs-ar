// Done criterion 2: simulated transcription selection and draft review.
// A and B show their exact sentences, status stays "Draft - not confirmed", the selected option
// becomes inactive, the disclosure stays visible, and Confirm/Cancel/Reset are available.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {
  DISCLOSURE,
  expectShownOnly,
  isInactive,
  isPressable,
  LABEL_A,
  LABEL_B,
  readControllerState,
  requireObject,
  SpatialReviewLeafInteractor,
  STATUS_DRAFT,
  TEXT_A,
  TEXT_B,
  textOf
} from "./SpatialReviewLeafHelpers"

@component
export class Criterion2DraftSelectionScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new SpatialReviewLeafInteractor()
    await sleep(1000)
    await interactor.ensurePlaced()

    const confirmsBefore = readControllerState().confirmCount

    // Both presets are visibly labelled as simulated.
    expect(textOf("SampleAButtonLabel"), "A label").toBe(LABEL_A)
    expect(textOf("SampleBButtonLabel"), "B label").toBe(LABEL_B)

    // --- Select A ---
    await interactor.press("SampleAButton")
    expect(textOf("SentenceText"), "A sentence").toBe(TEXT_A)
    expect(textOf("StatusText"), "status after A").toBe(STATUS_DRAFT)
    expect(textOf("DisclosureText"), "disclosure after A").toBe(DISCLOSURE)
    expect(requireObject("NoteCard").enabled, "note stays shown").toBe(true)
    expectShownOnly(["SampleAButton", "SampleBButton", "ConfirmButton", "CancelButton", "ResetButton"], "DRAFT(A)")
    expect(isInactive("SampleAButton"), "selected A is inactive").toBe(true)
    expect(isInactive("SampleBButton"), "B stays active").toBe(false)
    expect(isPressable("ConfirmButton"), "Confirm available").toBe(true)
    expect(isPressable("CancelButton"), "Cancel available").toBe(true)
    expect(isPressable("ResetButton"), "Reset available").toBe(true)
    expect(readControllerState().phase, "phase DRAFT").toBe("DRAFT")

    // --- Switch to B: never confirms ---
    await interactor.press("SampleBButton")
    expect(textOf("SentenceText"), "B sentence").toBe(TEXT_B)
    expect(textOf("StatusText"), "status still draft after switching").toBe(STATUS_DRAFT)
    expect(textOf("DisclosureText"), "disclosure after B").toBe(DISCLOSURE)
    expect(isInactive("SampleBButton"), "selected B is inactive").toBe(true)
    expect(isInactive("SampleAButton"), "A active again").toBe(false)
    expect(isPressable("ConfirmButton"), "Confirm available").toBe(true)
    expect(isPressable("CancelButton"), "Cancel available").toBe(true)
    expect(isPressable("ResetButton"), "Reset available").toBe(true)
    expect(readControllerState().phase, "phase still DRAFT").toBe("DRAFT")

    // --- Switch back to A: still a draft ---
    await interactor.press("SampleAButton")
    expect(textOf("SentenceText"), "A sentence again").toBe(TEXT_A)
    expect(textOf("StatusText"), "status still draft").toBe(STATUS_DRAFT)

    // Selecting and switching never confirmed anything.
    expect(readControllerState().confirmCount, "no confirmation from selecting/switching").toBe(confirmsBefore)
  }
}
