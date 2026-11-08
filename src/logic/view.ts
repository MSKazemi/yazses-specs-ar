import { DISCLOSURE } from "./samples";
import type { Phase, SpatialState, ViewModel } from "./types";

const NONE = Object.freeze({ A: false, B: false });
const BOTH = Object.freeze({ A: true, B: true });
const ONLY_A = Object.freeze({ A: true, B: false });
const ONLY_B = Object.freeze({ A: false, B: true });

function statusFor(phase: Phase): string {
  switch (phase) {
    case "PLACED":
      return "Placed — choose a simulated transcription";
    case "DRAFT":
      return "Draft — not confirmed";
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Not placed";
  }
}

export function describe(state: SpatialState): ViewModel {
  const phase: Phase =
    state !== null && typeof state === "object" ? state.phase : "IDLE";
  switch (phase) {
    case "PLACED":
    case "CANCELLED":
      return Object.freeze({
        phase,
        disclosure: DISCLOSURE,
        statusText: statusFor(phase),
        cardText: null,
        canPlace: false,
        canSelect: BOTH,
        canConfirm: false,
        canCancel: false,
        canReset: phase === "CANCELLED",
      });
    case "DRAFT":
      return Object.freeze({
        phase,
        disclosure: DISCLOSURE,
        statusText: statusFor(phase),
        cardText: state.draftText,
        canPlace: false,
        // Selecting the current sample is ignored, so only the other one is offered.
        canSelect: state.sample === "A" ? ONLY_B : state.sample === "B" ? ONLY_A : BOTH,
        canConfirm: state.draftText !== null,
        canCancel: true,
        canReset: true,
      });
    case "CONFIRMED":
      return Object.freeze({
        phase,
        disclosure: DISCLOSURE,
        statusText: statusFor(phase),
        cardText: state.confirmedText,
        canPlace: false,
        canSelect: NONE,
        canConfirm: false,
        canCancel: false,
        canReset: true,
      });
    default:
      return Object.freeze({
        phase: "IDLE" as Phase,
        disclosure: DISCLOSURE,
        statusText: statusFor("IDLE"),
        cardText: null,
        canPlace: true,
        canSelect: NONE,
        canConfirm: false,
        canCancel: false,
        canReset: false,
      });
  }
}
