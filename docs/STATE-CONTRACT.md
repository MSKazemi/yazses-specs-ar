# State contract — YazSes Spatial Review (portable core)

Lead-owned. The Domain agent implements it in `src/logic/`; the Test agent tests it in `tests/`; both read this file and neither edits it. If the contract is wrong, tell the Lead.

Everything here is **simulated**: two preset strings, no microphone, no speech recognition, no YazSes bridge, no network, no external action.

## Files and exports (the only public surface: `src/logic/index.ts`)

```ts
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
  readonly placed: boolean;            // true from the first PLACE until the state is recreated
  readonly sample: SampleId | null;    // the draft's sample while phase is DRAFT, else null
  readonly draftText: string | null;   // text of the current draft, else null
  readonly confirmedText: string | null; // text committed by the one CONFIRM of this cycle, else null
  readonly confirmCount: number;       // commits since createInitialState(); never decreases
}

export type Outcome = "applied" | "ignored";
export type IgnoredReason =
  | "not-placed" | "already-placed" | "no-draft" | "already-confirmed"
  | "same-sample" | "already-clear" | "not-allowed-in-phase";

export interface TransitionResult {
  readonly state: SpatialState;        // a NEW frozen object when applied; the same object when ignored
  readonly outcome: Outcome;
  readonly reason: IgnoredReason | null; // null when applied
}

export const SAMPLE_TEXT: Readonly<Record<SampleId, string>>;
// A: "Prepare the blue and yellow blocks."   B: "Place the blue block beside the yellow block."
export const SAMPLE_LABEL: Readonly<Record<SampleId, string>>;
// A: "Simulated transcription A"   B: "Simulated transcription B"
export const DISCLOSURE: string;      // exactly "Simulated transcription — not live speech" (em dash)

export function createInitialState(): SpatialState;
export function reduce(state: SpatialState, event: SpatialEvent): TransitionResult;
export function describe(state: SpatialState): ViewModel;

export interface ViewModel {
  readonly phase: Phase;
  readonly disclosure: string;                 // always DISCLOSURE, in every phase
  readonly sampleLabels: Readonly<Record<SampleId, string>>; // always SAMPLE_LABEL, in every phase, so the UI shows "Simulated transcription A/B"
  readonly statusText: string;                 // short plain-text status that names the phase, never colour-only
  readonly cardText: string | null;            // draft text in DRAFT, confirmed text in CONFIRMED, else null
  readonly canPlace: boolean;
  readonly canSelect: Readonly<Record<SampleId, boolean>>;
  readonly canConfirm: boolean;                // true only in DRAFT
  readonly canCancel: boolean;                 // true only in DRAFT
  readonly canReset: boolean;                  // true in DRAFT, CONFIRMED, CANCELLED
}
```

## Transition table (anything not listed is ignored with reason `not-allowed-in-phase` unless a reason below applies)

| Phase | Event | Result |
|---|---|---|
| IDLE | PLACE | PLACED, placed=true |
| IDLE | SELECT_SAMPLE / CONFIRM / CANCEL | ignored `not-placed` |
| IDLE | RESET | ignored `already-clear` |
| IDLE | INTERRUPT | ignored `already-clear` |
| PLACED | SELECT_SAMPLE x | DRAFT, sample=x, draftText=SAMPLE_TEXT[x] |
| PLACED | PLACE | ignored `already-placed` |
| PLACED | CONFIRM / CANCEL | ignored `no-draft` |
| PLACED | RESET / INTERRUPT | ignored `already-clear` |
| DRAFT | SELECT_SAMPLE y (y differs) | DRAFT with y (switching never confirms) |
| DRAFT | SELECT_SAMPLE same | ignored `same-sample` |
| DRAFT | CONFIRM | CONFIRMED, confirmedText=draftText, sample=null, draftText=null, confirmCount+1 |
| DRAFT | CANCEL | CANCELLED, sample=null, draftText=null; nothing committed |
| DRAFT | RESET | PLACED, draft discarded; nothing committed |
| DRAFT | INTERRUPT | PLACED, draft discarded; nothing committed (an interrupted draft is never confirmable) |
| DRAFT | PLACE | ignored `already-placed` |
| CONFIRMED | CONFIRM | ignored `already-confirmed` (confirmCount unchanged) |
| CONFIRMED | SELECT_SAMPLE / CANCEL | ignored `already-confirmed` |
| CONFIRMED | RESET | PLACED, confirmedText=null (confirmCount keeps its value) |
| CONFIRMED | INTERRUPT | ignored (stays CONFIRMED) `already-confirmed` |
| CANCELLED | SELECT_SAMPLE x | DRAFT (a fresh draft is allowed after cancel) |
| CANCELLED | CONFIRM / CANCEL | ignored `no-draft` |
| CANCELLED | RESET | PLACED |
| CANCELLED | INTERRUPT | ignored `already-clear` |
| any | PLACE when placed | ignored `already-placed` |

`RESET` is an event, not a resting phase: it always lands in PLACED (or is ignored). No transition ever confirms without an explicit `CONFIRM` received in `DRAFT`.

## Rules

- Pure and deterministic: same state + event gives the same result; no clocks, randomness, globals, I/O, `Date`, `Math.random`, `console`, `process`, DOM, `fetch`.
- No imports from outside `src/logic/`; no Node, DOM or Lens Studio types.
- All returned states are `Object.freeze`d; `reduce` never mutates its input.
- `reduce` never throws on any input, including malformed events from JavaScript callers (return ignored `not-allowed-in-phase`).
- Debouncing and pinch/tap timing belong to the Lens adapter, not here; this core makes a repeated CONFIRM harmless by phase alone.
- Plain ES2020 syntax: no `enum`, no decorators, no `namespace`, no top-level await, so Lens Studio's TypeScript can import it.

## Clarifications (Lead, 2026-11-08, after the first implementation)

- A malformed event (unknown `type`, bad or missing `sample`, non-object) is rejected before the phase is considered: ignored with `not-allowed-in-phase` in every phase, including IDLE.
- A malformed state (unknown `phase`) is returned untouched as ignored `not-allowed-in-phase`. `describe` of a malformed state returns the IDLE view.
- `canSelect[x]` is true when SELECT_SAMPLE x would be applied: in PLACED and CANCELLED both are true; in DRAFT only the other sample is true (the current one would be ignored as `same-sample`); in IDLE and CONFIRMED both are false.
- `canReset` is true only in DRAFT, CONFIRMED and CANCELLED (RESET is ignored as `already-clear` in IDLE and PLACED).
- `confirmCount` keeps its value across RESET. `createInitialState()` returns a fresh frozen object on each call.

- `ViewModel.sampleLabels` (added after the first push, issue #2) equals `SAMPLE_LABEL` in every phase, including the malformed-state IDLE view. It changes no transition.
