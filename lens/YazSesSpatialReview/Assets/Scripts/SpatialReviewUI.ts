// SpatialReviewUI - passive view for the YazSes Spatial Review note card and its controls.
//
// Owns:    the note card (status / sentence / disclosure texts on a UIKit BackPlate) and the
//          six UIKit buttons (PlaceNoteButton, SampleAButton, SampleBButton, ConfirmButton,
//          CancelButton, ResetButton), all built under authored containers.
// Inputs:  noteCard + controlPanel (authored SceneObjects, wired in the scene), plus the
//          Settings group below (sizes, colours, billboard toggle).
// Must not: hold domain state or make decisions. It renders a ViewModel (render()) and
//          reports user intent through onAction. No network, no microphone, no persistence.

import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate"
import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button"
import {FlexItem} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem"
import {FlexLayout} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout"
import {
  FlexAlign,
  FlexAlignSelf,
  FlexDirection,
  FlexJustify
} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes"
import {Billboard} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {SAMPLE_LABEL} from "./Logic/index"
import type {ViewModel} from "./Logic/index"

export type UiAction = "PLACE" | "SELECT_A" | "SELECT_B" | "CONFIRM" | "CANCEL" | "RESET"

// -- Type scale (single source of truth for text size + weight) -----------------------
const FONT_SIZE_SCALE = 1.0
type TextRole = "Headline1" | "Headline2" | "Subheadline" | "Button" | "Body" | "Caption"
const TYPE_SCALE: Record<TextRole, {size: number; weight: number}> = {
  Headline1: {size: 54, weight: 700},
  Headline2: {size: 48, weight: 700},
  Subheadline: {size: 41, weight: 700},
  Button: {size: 39, weight: 500},
  Body: {size: 39, weight: 500},
  Caption: {size: 38, weight: 500}
}
function applyTextRole(t: Text, role: TextRole): void {
  t.size = TYPE_SCALE[role].size * FONT_SIZE_SCALE
  ;(t as Text & {weight?: number}).weight = TYPE_SCALE[role].weight
}

const BUTTON_LABEL_Z = 0.08
const CONTENT_Z = 0.6
const WHITE = new vec4(1, 1, 1, 1)
const DIM = new vec4(1, 1, 1, 0.45)

interface ButtonRef {
  obj: SceneObject
  button: Button
  label: Text
}

@component
export class SpatialReviewUI extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">SpatialReviewUI - note card and controls (passive view)</span>')
  @ui.separator
  @ui.group_start("References")
  @input
  @hint("Authored empty container for the note card (status, sentence, disclosure).")
  noteCard!: SceneObject

  @input
  @hint("Authored empty container for the six buttons, placed directly below the note card.")
  controlPanel!: SceneObject
  @ui.group_end

  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Note card width in cm.")
  @widget(new SliderWidget(20, 40, 0.5))
  noteWidthCm: number = 28

  @input
  @hint("Note card height in cm.")
  @widget(new SliderWidget(12, 28, 0.5))
  noteHeightCm: number = 18

  @input
  @hint("Button height in cm. Minimum 4 cm for comfortable targets; 5-6 cm recommended.")
  @widget(new SliderWidget(4, 8, 0.1))
  buttonHeightCm: number = 5.5

  @input
  @hint("When on, the whole note + controls group yaws gently to face the viewer (SIK Billboard, Y axis only). Position never changes. Off = fixed angle.")
  faceViewer: boolean = true

  @input("vec4", "{0.45, 0.9, 0.55, 1}")
  @widget(new ColorWidget())
  @hint("Status colour for Confirmed.")
  confirmedColor: vec4 = new vec4(0.45, 0.9, 0.55, 1)

  @input("vec4", "{1, 0.82, 0.3, 1}")
  @widget(new ColorWidget())
  @hint("Status colour for Draft - not confirmed.")
  draftColor: vec4 = new vec4(1, 0.82, 0.3, 1)
  @ui.group_end

  private _onAction: Event<UiAction> = new Event<UiAction>()
  get onAction(): PublicApi<UiAction> {
    return this._onAction.publicApi()
  }

  private statusText!: Text
  private sentenceText!: Text
  private disclosureText!: Text
  private place!: ButtonRef
  private sampleA!: ButtonRef
  private sampleB!: ButtonRef
  private confirm!: ButtonRef
  private cancel!: ButtonRef
  private reset!: ButtonRef

  onAwake(): void {
    if (!this.noteCard || !this.controlPanel) {
      print("[SpatialReview] SpatialReviewUI: noteCard / controlPanel input not wired")
      return
    }
    // Canvas defaults to Hierarchy sorting: hierarchy order is render order.
    this.sceneObject.createComponent("Component.Canvas")
    if (this.faceViewer) {
      // Yaw-only billboard (Y axis is the Billboard default). Rotates about this object's origin.
      this.sceneObject.createComponent(Billboard.getTypeName())
    }
    this.buildNoteCard()
    this.buildControls()
  }

  // ---- public API (main -> UI) ----------------------------------------------------

  render(vm: ViewModel): void {
    if (!this.statusText) return
    this.noteCard.enabled = vm.phase !== "IDLE"

    this.statusText.text = vm.statusText
    this.statusText.textFill.color =
      vm.phase === "CONFIRMED" ? this.confirmedColor : vm.phase === "DRAFT" ? this.draftColor : WHITE

    const hasText = vm.cardText !== null && vm.cardText !== undefined
    this.sentenceText.text = hasText ? (vm.cardText as string) : "No draft yet"
    this.sentenceText.textFill.color = hasText ? WHITE : DIM
    this.disclosureText.text = vm.disclosure

    const selectVisible = vm.phase === "PLACED" || vm.phase === "CANCELLED" || vm.phase === "DRAFT"
    this.setButton(this.place, vm.canPlace, false)
    this.setButton(this.sampleA, selectVisible, !vm.canSelect.A)
    this.setButton(this.sampleB, selectVisible, !vm.canSelect.B)
    this.setButton(this.confirm, vm.canConfirm, false)
    this.setButton(this.cancel, vm.canCancel, false)
    this.setButton(this.reset, vm.canReset, false)
  }

  // ---- building --------------------------------------------------------------------

  private buildNoteCard(): void {
    const w = this.noteWidthCm
    const h = this.noteHeightCm
    const plate = this.noteCard.createComponent(BackPlate.getTypeName()) as BackPlate
    plate.size = new vec2(w, h)

    const content = this.makeChild(this.noteCard, "Content")
    content.getTransform().setLocalPosition(new vec3(0, 0, CONTENT_Z))
    const col = content.createComponent(FlexLayout.getTypeName()) as FlexLayout
    // Items are registered explicitly via addItems() below, which requires auto-discovery off.
    col.autoDiscoverItemsOnStart = false
    col.width = w
    col.height = h
    col.direction = FlexDirection.Column
    col.alignItems = FlexAlign.Stretch
    col.justifyContent = FlexJustify.Center
    col.rowGap = 0.8
    col.paddingTop = 1.2
    col.paddingBottom = 1.2
    col.paddingLeft = 1.4
    col.paddingRight = 1.4

    const statusH = 3.2
    const disclosureH = 2.6
    const sentenceH = Math.max(4, h - 2.4 - 1.6 - statusH - disclosureH)
    const items: FlexItem[] = []
    this.statusText = this.addRow(content, "StatusText", "Subheadline", statusH, items)
    this.sentenceText = this.addRow(content, "SentenceText", "Headline2", sentenceH, items)
    this.sentenceText.horizontalOverflow = HorizontalOverflow.Wrap
    this.disclosureText = this.addRow(content, "DisclosureText", "Body", disclosureH, items)
    col.addItems(items)
  }

  private addRow(parent: SceneObject, name: string, role: TextRole, heightCm: number, items: FlexItem[]): Text {
    const so = this.makeChild(parent, name)
    const t = so.createComponent("Component.Text") as Text
    t.depthTest = true
    applyTextRole(t, role)
    t.textFill.color = WHITE
    t.horizontalAlignment = HorizontalAlignment.Center
    t.verticalAlignment = VerticalAlignment.Center
    t.horizontalOverflow = HorizontalOverflow.Overflow
    t.verticalOverflow = VerticalOverflow.Overflow
    t.layoutRect = Rect.create(-0.5, 0.5, -0.5, 0.5)
    const item = so.createComponent(FlexItem.getTypeName()) as FlexItem
    item.alignSelf = FlexAlignSelf.Stretch
    item.overrideHeight = heightCm
    items.push(item)
    return t
  }

  private buildControls(): void {
    const h = this.buttonHeightCm
    const rowY = h / 2 + 0.5
    const half = this.noteWidthCm / 2
    const abW = (this.noteWidthCm - 0.8) / 2
    const smallW = 8.5

    // Row 1: Place note (IDLE, centred) or Simulated transcription A | B.
    this.place = this.makeButton("PlaceNoteButton", "Place note", 12, 0, rowY, h, "PLACE")
    this.sampleA = this.makeButton("SampleAButton", SAMPLE_LABEL.A, abW, -(abW / 2 + 0.4), rowY, h, "SELECT_A")
    this.sampleB = this.makeButton("SampleBButton", SAMPLE_LABEL.B, abW, abW / 2 + 0.4, rowY, h, "SELECT_B")
    // Row 2: Cancel (left) and Confirm (right) are separated by Reset in the middle.
    this.cancel = this.makeButton("CancelButton", "Cancel", smallW, -(half - smallW / 2), -rowY, h, "CANCEL")
    this.reset = this.makeButton("ResetButton", "Reset", smallW, 0, -rowY, h, "RESET")
    this.confirm = this.makeButton("ConfirmButton", "Confirm", smallW, half - smallW / 2, -rowY, h, "CONFIRM")
    this.confirm.label.textFill.color = this.confirmedColor
  }

  private makeButton(
    name: string,
    label: string,
    wCm: number,
    x: number,
    y: number,
    hCm: number,
    action: UiAction
  ): ButtonRef {
    const so = this.makeChild(this.controlPanel, name)
    so.getTransform().setLocalPosition(new vec3(x, y, 0))
    const button = so.createComponent(Button.getTypeName()) as Button
    button.size = new vec3(wCm, hCm, 1)

    const labelObj = this.makeChild(so, name + "Label")
    labelObj.getTransform().setLocalPosition(new vec3(0, 0, BUTTON_LABEL_Z))
    const t = labelObj.createComponent("Component.Text") as Text
    t.text = label
    t.depthTest = true
    applyTextRole(t, "Button")
    t.textFill.color = WHITE
    t.horizontalAlignment = HorizontalAlignment.Center
    t.verticalAlignment = VerticalAlignment.Center
    t.horizontalOverflow = HorizontalOverflow.Overflow
    t.verticalOverflow = VerticalOverflow.Overflow
    t.layoutRect = Rect.create(-(wCm - 0.4) / 2, (wCm - 0.4) / 2, -1.2, 1.2)

    button.onTriggerUp.add(() => this._onAction.invoke(action))
    return {obj: so, button, label: t}
  }

  private setButton(ref: ButtonRef, visible: boolean, inactive: boolean): void {
    ref.obj.enabled = visible
    ref.button.inactive = inactive
    const base = ref === this.confirm ? this.confirmedColor : WHITE
    ref.label.textFill.color = inactive ? DIM : base
  }

  private makeChild(parent: SceneObject, name: string): SceneObject {
    const so = global.scene.createSceneObject(name)
    so.setParent(parent)
    return so
  }
}
