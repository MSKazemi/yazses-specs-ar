// Done criterion 3: explicit confirmation, no accidental confirmation.
// Confirm changes status to "Confirmed", keeps the sentence, hides/deactivates Confirm, Cancel and
// the sample buttons; a repeated confirm has no extra effect.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {
  DISCLOSURE,
  expectShownOnly,
  readControllerState,
  requireObject,
  SpatialReviewLeafInteractor,
  STATUS_CONFIRMED,
  STATUS_DRAFT,
  TEXT_B,
  textOf
} from "./SpatialReviewLeafHelpers"

@component
export class Criterion3ConfirmScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new SpatialReviewLeafInteractor()
    await sleep(1000)
    await interactor.ensureDraft("B")

    // Delta-based: scenarios share live state, so compare with the count before pressing Confirm.
    const before = readControllerState()
    expect(before.phase, "DRAFT before confirm").toBe("DRAFT")
    expect(textOf("StatusText"), "unconfirmed before the press").toBe(STATUS_DRAFT)

    // --- Deliberate Confirm ---
    await interactor.press("ConfirmButton")
    expect(textOf("StatusText"), "status after Confirm").toBe(STATUS_CONFIRMED)
    expect(textOf("SentenceText"), "sentence kept after Confirm").toBe(TEXT_B)
    expect(textOf("DisclosureText"), "disclosure still visible").toBe(DISCLOSURE)
    expect(requireObject("NoteCard").enabled, "note stays shown").toBe(true)
    // Confirm, Cancel and A/B are gone (hidden); only Reset remains.
    expectShownOnly(["ResetButton"], "CONFIRMED")
    const after = readControllerState()
    expect(after.phase, "phase CONFIRMED").toBe("CONFIRMED")
    expect(after.confirmCount, "exactly one confirmation").toBe(before.confirmCount + 1)

    // --- Repeated Confirm has no extra effect ---
    // The Confirm button is hidden in CONFIRMED, so a second physical press is impossible. To
    // check the underlying guarantee in the live Lens, dispatch the same CONFIRM action the button
    // sends straight to the controller (private onUiAction; read/exercise only, no app change).
    const anchor = requireObject("NoteAnchor")
    const controller = anchor.getComponents("Component.ScriptComponent").find((s: any) => typeof s.onUiAction === "function") as any
    expect(controller !== undefined && controller !== null, "controller found on NoteAnchor").toBe(true)
    controller.onUiAction("CONFIRM")
    controller.onUiAction("CONFIRM")
    await sleep(300)
    expect(readControllerState().confirmCount, "repeated Confirm adds nothing").toBe(before.confirmCount + 1)
    expect(textOf("StatusText"), "status unchanged after repeated Confirm").toBe(STATUS_CONFIRMED)
    expect(textOf("SentenceText"), "sentence unchanged after repeated Confirm").toBe(TEXT_B)
    expectShownOnly(["ResetButton"], "CONFIRMED (after repeat)")
  }
}
