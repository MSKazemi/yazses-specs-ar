// Shared helpers for the YazSes Spatial Review state-logic tests.
// Everything here is simulated: no microphone, no speech recognition, no network.
import { createInitialState, reduce } from "../src/logic";
import type {
  Phase,
  SampleId,
  SpatialEvent,
  SpatialState,
  TransitionResult,
} from "../src/logic";

export const PLACE: SpatialEvent = { type: "PLACE" };
export const SELECT_A: SpatialEvent = { type: "SELECT_SAMPLE", sample: "A" };
export const SELECT_B: SpatialEvent = { type: "SELECT_SAMPLE", sample: "B" };
export const CONFIRM: SpatialEvent = { type: "CONFIRM" };
export const CANCEL: SpatialEvent = { type: "CANCEL" };
export const RESET: SpatialEvent = { type: "RESET" };
export const INTERRUPT: SpatialEvent = { type: "INTERRUPT" };

export const TEXT_A = "Prepare the blue and yellow blocks.";
export const TEXT_B = "Place the blue block beside the yellow block.";

export const ALL_PHASES: readonly Phase[] = [
  "IDLE",
  "PLACED",
  "DRAFT",
  "CONFIRMED",
  "CANCELLED",
];

export function select(sample: SampleId): SpatialEvent {
  return { type: "SELECT_SAMPLE", sample };
}

/** Apply events in order from `from`; return the final state and every result. */
export function run(
  events: readonly SpatialEvent[],
  from: SpatialState = createInitialState(),
): { state: SpatialState; results: TransitionResult[] } {
  let state = from;
  const results: TransitionResult[] = [];
  for (const event of events) {
    const result = reduce(state, event);
    results.push(result);
    state = result.state;
  }
  return { state, results };
}

export function stateAfter(events: readonly SpatialEvent[]): SpatialState {
  return run(events).state;
}

/** Event sequences that reach each phase from createInitialState(). DRAFT holds sample A. */
export const PATH_TO_PHASE: Readonly<Record<Phase, readonly SpatialEvent[]>> = {
  IDLE: [],
  PLACED: [PLACE],
  DRAFT: [PLACE, SELECT_A],
  CONFIRMED: [PLACE, SELECT_A, CONFIRM],
  CANCELLED: [PLACE, SELECT_A, CANCEL],
};

export function stateInPhase(phase: Phase): SpatialState {
  const state = stateAfter(PATH_TO_PHASE[phase]);
  if (state.phase !== phase) {
    throw new Error(`test setup failed: wanted ${phase}, reached ${state.phase}`);
  }
  return state;
}

/** Malformed events a careless JavaScript caller could send. reduce must never throw on them. */
export const MALFORMED_EVENTS: readonly unknown[] = [
  null,
  undefined,
  {},
  [],
  42,
  "CONFIRM",
  true,
  { type: "NOPE" },
  { type: "" },
  { type: "confirm" },
  { type: " CONFIRM" },
  { type: 5 },
  { type: null },
  { type: ["CONFIRM"] },
  { type: "toString" },
  { type: "__proto__" },
  { type: "constructor" },
  { type: "hasOwnProperty" },
  { type: "SELECT_SAMPLE" },
  { type: "SELECT_SAMPLE", sample: undefined },
  { type: "SELECT_SAMPLE", sample: null },
  { type: "SELECT_SAMPLE", sample: "C" },
  { type: "SELECT_SAMPLE", sample: "a" },
  { type: "SELECT_SAMPLE", sample: "" },
  { type: "SELECT_SAMPLE", sample: 1 },
  { type: "SELECT_SAMPLE", sample: ["A"] },
  { type: "SELECT_SAMPLE", sample: "toString" },
  { type: "SELECT_SAMPLE", sample: "constructor" },
  { type: "SELECT_SAMPLE", sample: "__proto__" },
  () => undefined,
  Symbol("event"),
];

export function asEvent(value: unknown): SpatialEvent {
  return value as SpatialEvent;
}

/** Tiny deterministic LCG (Numerical Recipes constants). No dependencies, no Math.random. */
export function makeLcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296; // [0, 1)
  };
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
