// LEAF test helpers for YazSes Spatial Review.
//
// Read-only: these helpers only query scene objects, Text components and Interactables
// and press buttons through LEAF's SIK interactor. They never edit app scripts or state.
//
// Scene object names are the ones built by Assets/Scripts/SpatialReviewUI.ts at runtime
// (StatusText, SentenceText, DisclosureText, PlaceNoteButton, SampleAButton, SampleBButton,
// ConfirmButton, CancelButton, ResetButton) plus the authored Workbench hierarchy.

import {DefaultLeafInteractor} from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import {findInteractablesByName} from "Leaf.lspkg/Interactors/InteractableUtils"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {findSceneObjectByName, sleep, withTimeout} from "Leaf.lspkg/Utils/common/Utils"

// Exact strings from the approved design brief (devpost/design-brief.md). Deliberately NOT
// imported from Assets/Scripts/Logic so the tests stay an independent check of the product.
export const TEXT_A = "Prepare the blue and yellow blocks."
export const TEXT_B = "Place the blue block beside the yellow block."
export const DISCLOSURE = "Simulated transcription — not live speech"
export const STATUS_DRAFT = "Draft — not confirmed"
export const STATUS_CONFIRMED = "Confirmed"
export const STATUS_CANCELLED = "Cancelled"
export const LABEL_A = "Simulated transcription A"
export const LABEL_B = "Simulated transcription B"
export const NO_DRAFT_TEXT = "No draft yet"

export type ButtonName =
  | "PlaceNoteButton"
  | "SampleAButton"
  | "SampleBButton"
  | "ConfirmButton"
  | "CancelButton"
  | "ResetButton"

export const ALL_BUTTONS: ButtonName[] = [
  "PlaceNoteButton",
  "SampleAButton",
  "SampleBButton",
  "ConfirmButton",
  "CancelButton",
  "ResetButton",
]

export function requireObject(name: string): SceneObject {
  const obj = findSceneObjectByName(name)
  if (!obj) {
    throw new Error(`Scene object "${name}" not found`)
  }
  return obj
}

export function textOf(name: string): string {
  const text = requireObject(name).getComponent("Component.Text") as Text
  if (!text) {
    throw new Error(`Scene object "${name}" has no Text component`)
  }
  return text.text
}

/** True when the button's SceneObject is enabled in the hierarchy (i.e. actually shown). */
export function isShown(name: string): boolean {
  return requireObject(name).isEnabledInHierarchy
}

/** True when the button's SIK Interactable is disabled (UIKit Button.inactive = true). */
export function isInactive(name: string): boolean {
  const interactable = findInteractablesByName(name)[0]
  if (!interactable) {
    throw new Error(`No Interactable found on "${name}"`)
  }
  return !interactable.enabled
}

/** Shown AND pressable. */
export function isPressable(name: string): boolean {
  return isShown(name) && !isInactive(name)
}

export function expectShownOnly(visible: ButtonName[], message: string): void {
  for (const name of ALL_BUTTONS) {
    const shouldShow = visible.indexOf(name) >= 0
    expect(isShown(name), `${message}: ${name} shown`).toBe(shouldShow)
  }
}

/** The SpatialReviewController component's private reducer state, read-only (for deltas). */
export function readControllerState(): {phase: string; confirmCount: number} {
  const anchor = requireObject("NoteAnchor")
  const scripts = anchor.getComponents("Component.ScriptComponent") as any[]
  for (const script of scripts) {
    const state = (script as any).state
    if (state && typeof state.phase === "string") {
      return {phase: state.phase, confirmCount: state.confirmCount}
    }
  }
  throw new Error("SpatialReviewController state not found on NoteAnchor")
}

export class SpatialReviewLeafInteractor extends DefaultLeafInteractor {
  /** Press a visible, active button the way a SIK pinch/click would (hover, select, release). */
  async press(name: ButtonName): Promise<void> {
    const button = findInteractablesByName(name, undefined, true)[0]
    if (!button) {
      throw new Error(`Button "${name}" not found, hidden or inactive; it cannot be pressed`)
    }
    // Bounded so a control that never receives hover fails the test instead of hanging.
    await withTimeout(this.trigger(button), 8000, `Timed out pressing "${name}" (no hover/trigger events)`)
    await sleep(250)
  }

  /** Bring the Lens to PLACED regardless of what an earlier scenario left behind. */
  async ensurePlaced(): Promise<void> {
    if (isPressable("ResetButton")) {
      await this.press("ResetButton")
    } else if (isPressable("PlaceNoteButton")) {
      await this.press("PlaceNoteButton")
    }
    expect(textOf("StatusText").toLowerCase().includes("choose a simulated transcription"), "ensurePlaced status").toBe(true)
  }

  /** Bring the Lens to DRAFT for the given sample, starting from any state. */
  async ensureDraft(sample: "A" | "B"): Promise<void> {
    await this.ensurePlaced()
    await this.press(sample === "A" ? "SampleAButton" : "SampleBButton")
    expect(textOf("StatusText"), "ensureDraft status").toBe(STATUS_DRAFT)
    expect(textOf("SentenceText"), "ensureDraft sentence").toBe(sample === "A" ? TEXT_A : TEXT_B)
  }
}
