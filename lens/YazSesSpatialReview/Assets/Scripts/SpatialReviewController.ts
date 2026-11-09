// SpatialReviewController - orchestrates the YazSes Spatial Review demo.
//
// Owns:    the single SpatialState (via the portable logic in ./Logic), event dispatch through
//          reduce(), and pushing describe(state) into the SpatialReviewUI view.
// Inputs:  ui (the SpatialReviewUI ScriptComponent, wired in the scene), plus the optional
//          debug "demoScript" described below.
// Must not: create UI, use the network, microphone, audio or any persistence. Everything shown
//          is a simulated transcription; nothing is sent, saved or executed.

import {createInitialState, describe, reduce} from "./Logic/index"
import type {SpatialEvent, SpatialState} from "./Logic/index"
import {SpatialReviewUI} from "./SpatialReviewUI"
import type {UiAction} from "./SpatialReviewUI"

const TAG = "[SpatialReview]"

@component
export class SpatialReviewController extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">SpatialReviewController - state + dispatch</span>')
  @ui.separator
  @ui.group_start("References")
  @input
  @hint("The SpatialReviewUI component that renders the note card and buttons.")
  ui!: SpatialReviewUI
  @ui.group_end

  @ui.separator
  @ui.group_start("Debug")
  @input
  @hint("Optional comma-separated list of UI actions replayed once at start (PLACE, SELECT_A, SELECT_B, CONFIRM, CANCEL, RESET, INTERRUPT). Empty = normal behaviour. For evidence capture only; it dispatches the same events as the buttons.")
  demoScript: string = ""
  @ui.group_end

  private state: SpatialState = createInitialState()

  onAwake(): void {
    // SIK / UIKit subscriptions bind in OnStartEvent, never in onAwake.
    this.createEvent("OnStartEvent").bind(() => this.start())
  }

  private start(): void {
    if (!this.ui) {
      print(`${TAG} ERROR: ui input is not wired`)
      return
    }
    this.ui.onAction.add((a: UiAction) => this.onUiAction(a))
    this.render()
    print(`${TAG} started phase=${this.state.phase} (simulated transcription - not live speech)`)

    const script = (this.demoScript || "").trim()
    if (script.length > 0) {
      print(`${TAG} demoScript replay: ${script}`)
      for (const token of script.split(",")) {
        this.onUiAction(token.trim() as UiAction)
      }
    }
  }

  private onUiAction(action: UiAction | "INTERRUPT"): void {
    let event: SpatialEvent | null = null
    switch (action) {
      case "PLACE":
        event = {type: "PLACE"}
        break
      case "SELECT_A":
        event = {type: "SELECT_SAMPLE", sample: "A"}
        break
      case "SELECT_B":
        event = {type: "SELECT_SAMPLE", sample: "B"}
        break
      case "CONFIRM":
        event = {type: "CONFIRM"}
        break
      case "CANCEL":
        event = {type: "CANCEL"}
        break
      case "RESET":
        event = {type: "RESET"}
        break
      case "INTERRUPT":
        event = {type: "INTERRUPT"}
        break
    }
    if (event === null) {
      print(`${TAG} unknown action ignored: ${action}`)
      return
    }
    this.dispatch(event, action)
  }

  private dispatch(event: SpatialEvent, label: string): void {
    const before = this.state.phase
    const result = reduce(this.state, event)
    this.state = result.state
    print(
      `${TAG} ${label}: ${result.outcome}${result.reason ? " (" + result.reason + ")" : ""} ` +
        `${before} -> ${this.state.phase} confirmCount=${this.state.confirmCount}`
    )
    this.render()
  }

  private render(): void {
    this.ui.render(describe(this.state))
  }
}
