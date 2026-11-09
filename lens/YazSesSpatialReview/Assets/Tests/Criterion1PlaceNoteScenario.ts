// Done criterion 1: workbench and note placement.
// Preview start: workbench + one blue + one yellow block, note hidden, only "Place note" shown.
// After pressing Place note: readable note appears to the right of the blocks, controls below
// it, and nothing covers the blocks.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {
  DISCLOSURE,
  expectShownOnly,
  isInactive,
  readControllerState,
  requireObject,
  SpatialReviewLeafInteractor,
  textOf
} from "./SpatialReviewLeafHelpers"

@component
export class Criterion1PlaceNoteScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new SpatialReviewLeafInteractor()
    await sleep(1000)

    // --- Initial (IDLE) state ---
    const workbench = requireObject("Workbench")
    const table = requireObject("TableTop")
    const blue = requireObject("BlueBlock")
    const yellow = requireObject("YellowBlock")
    expect(workbench.isEnabledInHierarchy, "Workbench shown").toBe(true)
    expect(table.isEnabledInHierarchy, "TableTop shown").toBe(true)
    expect(blue.isEnabledInHierarchy, "BlueBlock shown").toBe(true)
    expect(yellow.isEnabledInHierarchy, "YellowBlock shown").toBe(true)

    expect(readControllerState().phase, "starts in IDLE (Lens is reset before each scenario)").toBe("IDLE")
    expect(requireObject("NoteCard").enabled, "note hidden before Place note").toBe(false)
    expectShownOnly(["PlaceNoteButton"], "IDLE")
    expect(isInactive("PlaceNoteButton"), "Place note is pressable").toBe(false)

    // Workbench is about 1.1 m in front of the user, slightly below eye level.
    const wbPos = workbench.getTransform().getWorldPosition()
    expect(Math.abs(wbPos.z + 110) < 5, `workbench ~110 cm in front (z=${wbPos.z})`).toBe(true)
    expect(wbPos.y < 0, `workbench below eye level (y=${wbPos.y})`).toBe(true)

    // --- Press Place note ---
    await interactor.press("PlaceNoteButton")

    expect(readControllerState().phase, "PLACED after Place note").toBe("PLACED")
    expect(requireObject("NoteCard").enabled, "note shown after Place note").toBe(true)
    expect(textOf("StatusText").toLowerCase().includes("choose a simulated transcription"), "status invites a choice").toBe(true)
    expect(textOf("DisclosureText"), "disclosure visible").toBe(DISCLOSURE)
    expectShownOnly(["SampleAButton", "SampleBButton"], "PLACED")

    // --- Note does not cover the blocks and sits to their right ---
    const anchor = requireObject("NoteAnchor")
    const card = requireObject("NoteCard")
    const panel = requireObject("ControlPanel")
    const ui = anchor.getComponents("Component.ScriptComponent").find((s: any) => s.noteWidthCm !== undefined) as any
    const noteW: number = ui ? ui.noteWidthCm : 28
    const noteH: number = ui ? ui.noteHeightCm : 18

    const cardPos = card.getTransform().getWorldPosition()
    const panelPos = panel.getTransform().getWorldPosition()
    // Yaw about the vertical axis can only shrink the X extent, so w/2 is a safe half-width.
    const noteMinX = cardPos.x - noteW / 2
    const panelMinX = panelPos.x - noteW / 2
    for (const block of [blue, yellow]) {
      const p = block.getTransform().getWorldPosition()
      const s = block.getTransform().getWorldScale()
      const blockMaxX = p.x + s.x / 2
      const blockTopY = p.y + s.y / 2
      expect(noteMinX > blockMaxX, `note (minX=${noteMinX}) is right of ${block.name} (maxX=${blockMaxX})`).toBe(true)
      expect(panelMinX > blockMaxX, `controls (minX=${panelMinX}) are right of ${block.name} (maxX=${blockMaxX})`).toBe(true)
      // Also clear in height: the note's lower edge is above the block tops.
      expect(cardPos.y - noteH / 2 > blockTopY, `note bottom is above ${block.name} top`).toBe(true)
    }
    // Controls sit directly below the note and are horizontally aligned with it.
    expect(panelPos.y < cardPos.y, "controls are below the note").toBe(true)
    expect(Math.abs(panelPos.x - cardPos.x) < 0.5, "controls aligned with note").toBe(true)
    // Note is near the workbench, in front of the user.
    const dx = cardPos.x - wbPos.x
    expect(dx > 0 && dx < 35, `note is beside the workbench (dx=${dx})`).toBe(true)
  }
}
