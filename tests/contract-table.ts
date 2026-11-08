// The contract's transition table, written out row by row (docs/STATE-CONTRACT.md).
// Setup for each phase is PATH_TO_PHASE in support.ts: DRAFT holds sample A,
// CONFIRMED and CANCELLED were both reached from a draft of sample A, and the
// CONFIRMED setup has already committed once (confirmCount === 1).
import type { IgnoredReason, Phase, SpatialState } from "../src/logic";
import {
  CANCEL,
  CONFIRM,
  INTERRUPT,
  PLACE,
  RESET,
  SELECT_A,
  SELECT_B,
  TEXT_A,
  TEXT_B,
} from "./support";
import type { SpatialEvent } from "../src/logic";

export interface Row {
  readonly phase: Phase;
  readonly label: string;
  readonly event: SpatialEvent;
  /** "ignored" rows carry a reason; "applied" rows carry the full expected next state. */
  readonly outcome: "applied" | "ignored";
  readonly reason: IgnoredReason | null;
  readonly next: SpatialState | null;
}

function ignored(
  phase: Phase,
  label: string,
  event: SpatialEvent,
  reason: IgnoredReason,
): Row {
  return { phase, label, event, outcome: "ignored", reason, next: null };
}

function applied(
  phase: Phase,
  label: string,
  event: SpatialEvent,
  next: SpatialState,
): Row {
  return { phase, label, event, outcome: "applied", reason: null, next };
}

const PLACED_CLEAN: SpatialState = {
  phase: "PLACED",
  placed: true,
  sample: null,
  draftText: null,
  confirmedText: null,
  confirmCount: 0,
};
const draft = (
  sample: "A" | "B",
  confirmCount = 0,
): SpatialState => ({
  phase: "DRAFT",
  placed: true,
  sample,
  draftText: sample === "A" ? TEXT_A : TEXT_B,
  confirmedText: null,
  confirmCount,
});

export const TABLE: readonly Row[] = [
  // IDLE
  applied("IDLE", "PLACE", PLACE, PLACED_CLEAN),
  ignored("IDLE", "SELECT A", SELECT_A, "not-placed"),
  ignored("IDLE", "SELECT B", SELECT_B, "not-placed"),
  ignored("IDLE", "CONFIRM", CONFIRM, "not-placed"),
  ignored("IDLE", "CANCEL", CANCEL, "not-placed"),
  ignored("IDLE", "RESET", RESET, "already-clear"),
  ignored("IDLE", "INTERRUPT", INTERRUPT, "already-clear"),

  // PLACED
  ignored("PLACED", "PLACE", PLACE, "already-placed"),
  applied("PLACED", "SELECT A", SELECT_A, draft("A")),
  applied("PLACED", "SELECT B", SELECT_B, draft("B")),
  ignored("PLACED", "CONFIRM", CONFIRM, "no-draft"),
  ignored("PLACED", "CANCEL", CANCEL, "no-draft"),
  ignored("PLACED", "RESET", RESET, "already-clear"),
  ignored("PLACED", "INTERRUPT", INTERRUPT, "already-clear"),

  // DRAFT (sample A)
  ignored("DRAFT", "PLACE", PLACE, "already-placed"),
  ignored("DRAFT", "SELECT A (same)", SELECT_A, "same-sample"),
  applied("DRAFT", "SELECT B (switch)", SELECT_B, draft("B")),
  applied("DRAFT", "CONFIRM", CONFIRM, {
    phase: "CONFIRMED",
    placed: true,
    sample: null,
    draftText: null,
    confirmedText: TEXT_A,
    confirmCount: 1,
  }),
  applied("DRAFT", "CANCEL", CANCEL, {
    phase: "CANCELLED",
    placed: true,
    sample: null,
    draftText: null,
    confirmedText: null,
    confirmCount: 0,
  }),
  applied("DRAFT", "RESET", RESET, PLACED_CLEAN),
  applied("DRAFT", "INTERRUPT", INTERRUPT, PLACED_CLEAN),

  // CONFIRMED (confirmCount already 1)
  ignored("CONFIRMED", "PLACE", PLACE, "already-placed"),
  ignored("CONFIRMED", "SELECT A", SELECT_A, "already-confirmed"),
  ignored("CONFIRMED", "SELECT B", SELECT_B, "already-confirmed"),
  ignored("CONFIRMED", "CONFIRM", CONFIRM, "already-confirmed"),
  ignored("CONFIRMED", "CANCEL", CANCEL, "already-confirmed"),
  applied("CONFIRMED", "RESET", RESET, { ...PLACED_CLEAN, confirmCount: 1 }),
  ignored("CONFIRMED", "INTERRUPT", INTERRUPT, "already-confirmed"),

  // CANCELLED
  ignored("CANCELLED", "PLACE", PLACE, "already-placed"),
  applied("CANCELLED", "SELECT A", SELECT_A, draft("A")),
  applied("CANCELLED", "SELECT B", SELECT_B, draft("B")),
  ignored("CANCELLED", "CONFIRM", CONFIRM, "no-draft"),
  ignored("CANCELLED", "CANCEL", CANCEL, "no-draft"),
  applied("CANCELLED", "RESET", RESET, PLACED_CLEAN),
  ignored("CANCELLED", "INTERRUPT", INTERRUPT, "already-clear"),
];
