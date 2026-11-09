// Done criterion 5: spatial stability.
// When the viewpoint moves around the workbench the note keeps its world position and distance to
// the workbench, stays parented to the Workbench (never head-locked), and only yaws (vertical axis).

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {hasAncestorWithName, nextFrame, sleep} from "Leaf.lspkg/Utils/common/Utils"
import {requireObject, SpatialReviewLeafInteractor} from "./SpatialReviewLeafHelpers"

function dist(a: vec3, b: vec3): number {
  return a.distance(b)
}

@component
export class Criterion5SpatialStabilityScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new SpatialReviewLeafInteractor()
    await sleep(1000)
    await interactor.ensurePlaced() // note must be shown for this check

    const anchor = requireObject("NoteAnchor")
    const workbench = requireObject("Workbench")
    const cameraObj = requireObject("Camera Object")

    // --- Structural: the note belongs to the workbench, not the head/camera ---
    expect(anchor.getParent() !== null && anchor.getParent().name === "Workbench", "NoteAnchor is a child of Workbench").toBe(true)
    expect(hasAncestorWithName(anchor, "Camera Object"), "note is not under the camera").toBe(false)
    expect(hasAncestorWithName(requireObject("NoteCard"), "Workbench"), "NoteCard is under Workbench").toBe(true)
    expect(hasAncestorWithName(requireObject("ControlPanel"), "Workbench"), "ControlPanel is under Workbench").toBe(true)

    // --- Record before ---
    const at = anchor.getTransform()
    const posBefore = at.getWorldPosition()
    const localBefore = at.getLocalPosition()
    const wbBefore = workbench.getTransform().getWorldPosition()
    const distToWbBefore = dist(posBefore, wbBefore)
    const camTf = cameraObj.getTransform()
    const camPosBefore = camTf.getWorldPosition()
    const camRotBefore = camTf.getWorldRotation()

    // --- Move the viewpoint: 60 cm to the side and back, turned 60 degrees about Y ---
    // The Preview's DeviceTracking rewrites the camera pose every frame, so suspend it (runtime
    // only, restored below) for the script-driven move to take effect.
    const tracking = cameraObj.getComponent("Component.DeviceTracking") as DeviceTracking
    const trackingWasEnabled = tracking ? tracking.enabled : false
    if (tracking) {
      tracking.enabled = false
    }
    const newCamPos = camPosBefore.add(new vec3(60, 10, 40))
    camTf.setWorldPosition(newCamPos)
    camTf.setWorldRotation(quat.fromEulerAngles(0, 60 * MathUtils.DegToRad, 0).multiply(camRotBefore))
    await nextFrame()
    await nextFrame()
    await sleep(500)

    const camPosAfter = camTf.getWorldPosition()
    const moved = dist(camPosAfter, camPosBefore)
    // If the preview's device tracking overrides the script, the viewpoint did not move and the
    // test says so instead of passing vacuously.
    expect(moved > 20, `viewpoint actually moved (camera displacement ${moved.toFixed(1)} cm)`).toBe(true)

    // --- Note is where it was ---
    const posAfter = at.getWorldPosition()
    expect(dist(posAfter, posBefore) < 0.01, `note world position unchanged (delta ${dist(posAfter, posBefore).toFixed(4)} cm)`).toBe(true)
    expect(dist(at.getLocalPosition(), localBefore) < 0.001, "note local position under Workbench unchanged").toBe(true)
    expect(Math.abs(dist(posAfter, workbench.getTransform().getWorldPosition()) - distToWbBefore) < 0.01, "note-to-workbench distance unchanged").toBe(true)
    // The viewpoint moved, the note did not: its distance to the camera changed.
    expect(Math.abs(dist(posAfter, camPosAfter) - dist(posBefore, camPosBefore)) > 5, "note is not head-locked (distance to camera changed)").toBe(true)

    // --- Orientation may yaw toward the viewer but stays upright (no pitch/roll) ---
    const up = at.up
    expect(Math.abs(up.x) < 0.05 && Math.abs(up.z) < 0.05 && up.y > 0.99, `note stays upright (up=${up.x.toFixed(3)},${up.y.toFixed(3)},${up.z.toFixed(3)})`).toBe(true)

    // Restore the viewpoint so later scenarios start from the original pose.
    camTf.setWorldPosition(camPosBefore)
    camTf.setWorldRotation(camRotBefore)
    if (tracking) {
      tracking.enabled = trackingWasEnabled
    }
    await sleep(300)
  }
}
