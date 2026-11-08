import { reduce } from "./reducer";
import type { SpatialEvent, SpatialState } from "./types";

// Thin adapter over `reduce` using the action names from the project issue:
// transition(state, action) -> state. Ignored actions return the same state object.
export type Action = {
  readonly type:
    | "PLACE"
    | "SELECT_SAMPLE_A"
    | "SELECT_SAMPLE_B"
    | "CONFIRM"
    | "CANCEL"
    | "RESET"
    | "INTERRUPT";
};

export function transition(state: SpatialState, action: Action): SpatialState {
  try {
    const type: unknown =
      typeof action === "object" && action !== null ? action.type : undefined;
    let event: unknown = action;
    if (type === "SELECT_SAMPLE_A") event = { type: "SELECT_SAMPLE", sample: "A" };
    else if (type === "SELECT_SAMPLE_B") event = { type: "SELECT_SAMPLE", sample: "B" };
    // Anything else (including malformed input) is passed through; reduce ignores it.
    return reduce(state, event as SpatialEvent).state;
  } catch {
    return state;
  }
}
