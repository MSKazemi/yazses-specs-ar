// Types for the YazSes Spatial Review portable core.
// Everything here is simulated: no microphone, no speech recognition, no network.

export type Phase = "IDLE" | "PLACED" | "DRAFT" | "CONFIRMED" | "CANCELLED";
export type SampleId = "A" | "B";

export type SpatialEvent =
  | { readonly type: "PLACE" }
  | { readonly type: "SELECT_SAMPLE"; readonly sample: SampleId }
  | { readonly type: "CONFIRM" }
  | { readonly type: "CANCEL" }
  | { readonly type: "RESET" }
  | { readonly type: "INTERRUPT" };

export interface SpatialState {
  readonly phase: Phase;
  readonly placed: boolean;
  readonly sample: SampleId | null;
  readonly draftText: string | null;
  readonly confirmedText: string | null;
  readonly confirmCount: number;
}

export type Outcome = "applied" | "ignored";
export type IgnoredReason =
  | "not-placed"
  | "already-placed"
  | "no-draft"
  | "already-confirmed"
  | "same-sample"
  | "already-clear"
  | "not-allowed-in-phase";

export interface TransitionResult {
  readonly state: SpatialState;
  readonly outcome: Outcome;
  readonly reason: IgnoredReason | null;
}

export interface ViewModel {
  readonly phase: Phase;
  readonly disclosure: string;
  readonly statusText: string;
  readonly cardText: string | null;
  readonly canPlace: boolean;
  readonly canSelect: Readonly<Record<SampleId, boolean>>;
  readonly canConfirm: boolean;
  readonly canCancel: boolean;
  readonly canReset: boolean;
}
