export type {
  IgnoredReason,
  Outcome,
  Phase,
  SampleId,
  SpatialEvent,
  SpatialState,
  TransitionResult,
  ViewModel,
} from "./types";
export { DISCLOSURE, SAMPLE_LABEL, SAMPLE_TEXT } from "./samples";
export { createInitialState, reduce } from "./reducer";
export { describe } from "./view";
