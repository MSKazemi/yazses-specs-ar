import { SAMPLE_TEXT } from "./samples";
import type {
  IgnoredReason,
  Phase,
  SampleId,
  SpatialEvent,
  SpatialState,
  TransitionResult,
} from "./types";

export function createInitialState(): SpatialState {
  return Object.freeze({
    phase: "IDLE",
    placed: false,
    sample: null,
    draftText: null,
    confirmedText: null,
    confirmCount: 0,
  });
}

function applied(state: SpatialState): TransitionResult {
  return Object.freeze({ state: Object.freeze(state), outcome: "applied", reason: null });
}

function ignored(state: SpatialState, reason: IgnoredReason): TransitionResult {
  return Object.freeze({ state, outcome: "ignored", reason });
}

function isSampleId(value: unknown): value is SampleId {
  return value === "A" || value === "B";
}

function isPhase(value: unknown): value is Phase {
  return (
    value === "IDLE" ||
    value === "PLACED" ||
    value === "DRAFT" ||
    value === "CONFIRMED" ||
    value === "CANCELLED"
  );
}

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

// Read event.type and, for SELECT_SAMPLE, event.sample, without ever throwing
// (a malformed JavaScript caller could pass a getter that throws).
function readEvent(event: unknown): { type: string; sample: unknown } | null {
  try {
    if (typeof event !== "object" || event === null) return null;
    const record = event as { type?: unknown; sample?: unknown };
    const type = record.type;
    if (typeof type !== "string") return null;
    return { type, sample: type === "SELECT_SAMPLE" ? record.sample : undefined };
  } catch {
    return null;
  }
}

function placedState(state: SpatialState): SpatialState {
  return {
    phase: "PLACED",
    placed: true,
    sample: null,
    draftText: null,
    confirmedText: null,
    confirmCount: safeCount(state.confirmCount),
  };
}

function draftState(state: SpatialState, sample: SampleId): SpatialState {
  return {
    phase: "DRAFT",
    placed: true,
    sample,
    draftText: SAMPLE_TEXT[sample],
    confirmedText: null,
    confirmCount: safeCount(state.confirmCount),
  };
}

export function reduce(state: SpatialState, event: SpatialEvent): TransitionResult {
  try {
    const phase: unknown = typeof state === "object" && state !== null ? state.phase : undefined;
    if (!isPhase(phase)) {
      // Malformed state: nothing can be applied to it. Hand it back untouched.
      return ignored(state, "not-allowed-in-phase");
    }
    const ev = readEvent(event);
    if (ev === null) return ignored(state, "not-allowed-in-phase");

    switch (ev.type) {
      case "PLACE":
        if (phase === "IDLE") {
          return applied({ ...placedState(state), sample: null });
        }
        return ignored(state, "already-placed");

      case "SELECT_SAMPLE": {
        const sample = ev.sample;
        if (!isSampleId(sample)) return ignored(state, "not-allowed-in-phase");
        switch (phase) {
          case "IDLE":
            return ignored(state, "not-placed");
          case "PLACED":
          case "CANCELLED":
            return applied(draftState(state, sample));
          case "DRAFT":
            if (state.sample === sample) return ignored(state, "same-sample");
            return applied(draftState(state, sample));
          case "CONFIRMED":
            return ignored(state, "already-confirmed");
        }
        break;
      }

      case "CONFIRM":
        switch (phase) {
          case "IDLE":
            return ignored(state, "not-placed");
          case "PLACED":
          case "CANCELLED":
            return ignored(state, "no-draft");
          case "CONFIRMED":
            return ignored(state, "already-confirmed");
          case "DRAFT": {
            // Never confirm anything but the text the draft actually holds.
            const text = state.draftText;
            if (typeof text !== "string") return ignored(state, "no-draft");
            return applied({
              phase: "CONFIRMED",
              placed: true,
              sample: null,
              draftText: null,
              confirmedText: text,
              confirmCount: safeCount(state.confirmCount) + 1,
            });
          }
        }
        break;

      case "CANCEL":
        switch (phase) {
          case "IDLE":
            return ignored(state, "not-placed");
          case "PLACED":
          case "CANCELLED":
            return ignored(state, "no-draft");
          case "CONFIRMED":
            return ignored(state, "already-confirmed");
          case "DRAFT":
            return applied({
              phase: "CANCELLED",
              placed: true,
              sample: null,
              draftText: null,
              confirmedText: null,
              confirmCount: safeCount(state.confirmCount),
            });
        }
        break;

      case "RESET":
        if (phase === "DRAFT" || phase === "CONFIRMED" || phase === "CANCELLED") {
          return applied(placedState(state));
        }
        return ignored(state, "already-clear");

      case "INTERRUPT":
        if (phase === "DRAFT") return applied(placedState(state));
        if (phase === "CONFIRMED") return ignored(state, "already-confirmed");
        return ignored(state, "already-clear");

      default:
        return ignored(state, "not-allowed-in-phase");
    }
    return ignored(state, "not-allowed-in-phase");
  } catch {
    return ignored(state, "not-allowed-in-phase");
  }
}
