// LEAF scenario registry for YazSes Spatial Review (test-only; not part of the Lens experience).

import {scenariosIndex} from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator"
import {ScenarioMetadata} from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata"
import {Criterion1PlaceNoteScenario} from "./Criterion1PlaceNoteScenario"
import {Criterion2DraftSelectionScenario} from "./Criterion2DraftSelectionScenario"
import {Criterion3ConfirmScenario} from "./Criterion3ConfirmScenario"
import {Criterion4CancelResetScenario} from "./Criterion4CancelResetScenario"
import {Criterion5SpatialStabilityScenario} from "./Criterion5SpatialStabilityScenario"

@component
export class LeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    {id: "c1-place-note", typename: Criterion1PlaceNoteScenario.getTypeName()},
    {id: "c2-draft-selection", typename: Criterion2DraftSelectionScenario.getTypeName()},
    {id: "c3-confirm", typename: Criterion3ConfirmScenario.getTypeName()},
    {id: "c4-cancel-reset", typename: Criterion4CancelResetScenario.getTypeName()},
    {id: "c5-spatial-stability", typename: Criterion5SpatialStabilityScenario.getTypeName()}
  ]
}
