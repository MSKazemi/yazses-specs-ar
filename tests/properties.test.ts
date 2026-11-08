// Property-style tests: thousands of deterministic pseudo-random event sequences,
// checked against invariants from docs/STATE-CONTRACT.md and an independent
// reference model of the transition table. No dependencies, no Math.random.
import { describe, expect, it } from "vitest";
import {
  SAMPLE_TEXT,
  createInitialState,
  describe as describeState,
  reduce,
} from "../src/logic";
import type {
  IgnoredReason,
  Phase,
  SampleId,
  SpatialEvent,
  SpatialState,
} from "../src/logic";
import {
  CANCEL,
  CONFIRM,
  INTERRUPT,
  MALFORMED_EVENTS,
  PLACE,
  RESET,
  SELECT_A,
  SELECT_B,
  TEXT_A,
  TEXT_B,
  asEvent,
  makeLcg,
} from "./support";

const VALID: readonly SpatialEvent[] = [PLACE, SELECT_A, SELECT_B, CONFIRM, CANCEL, RESET, INTERRUPT];

/** Weighted draw: mostly well-formed events, ~12% malformed. */
function pickEvent(rnd: () => number): unknown {
  if (rnd() < 0.12) return MALFORMED_EVENTS[Math.floor(rnd() * MALFORMED_EVENTS.length)];
  return VALID[Math.floor(rnd() * VALID.length)];
}

interface Model {
  readonly outcome: "applied" | "ignored";
  readonly reason: IgnoredReason | null;
  readonly phase: Phase;
}

/** Independent reference of the transition table, keyed by the *logical* event kind. */
function model(phase: Phase, sample: SampleId | null, ev: unknown): Model {
  const ign = (reason: IgnoredReason): Model => ({ outcome: "ignored", reason, phase });
  const app = (next: Phase): Model => ({ outcome: "applied", reason: null, phase: next });

  const e = ev as { type?: unknown; sample?: unknown } | null | undefined;
  const type = typeof e === "object" && e !== null ? e.type : undefined;
  const validTypes = ["PLACE", "SELECT_SAMPLE", "CONFIRM", "CANCEL", "RESET", "INTERRUPT"];
  if (typeof type !== "string" || !validTypes.includes(type)) return ign("not-allowed-in-phase");
  if (type === "SELECT_SAMPLE" && e?.sample !== "A" && e?.sample !== "B") {
    return ign("not-allowed-in-phase");
  }

  switch (phase) {
    case "IDLE":
      if (type === "PLACE") return app("PLACED");
      if (type === "RESET" || type === "INTERRUPT") return ign("already-clear");
      return ign("not-placed");
    case "PLACED":
      if (type === "PLACE") return ign("already-placed");
      if (type === "SELECT_SAMPLE") return app("DRAFT");
      if (type === "CONFIRM" || type === "CANCEL") return ign("no-draft");
      return ign("already-clear");
    case "DRAFT":
      if (type === "PLACE") return ign("already-placed");
      if (type === "SELECT_SAMPLE") return e?.sample === sample ? ign("same-sample") : app("DRAFT");
      if (type === "CONFIRM") return app("CONFIRMED");
      if (type === "CANCEL") return app("CANCELLED");
      return app("PLACED"); // RESET, INTERRUPT
    case "CONFIRMED":
      if (type === "PLACE") return ign("already-placed");
      if (type === "RESET") return app("PLACED");
      return ign("already-confirmed");
    case "CANCELLED":
      if (type === "PLACE") return ign("already-placed");
      if (type === "SELECT_SAMPLE") return app("DRAFT");
      if (type === "RESET") return app("PLACED");
      if (type === "INTERRUPT") return ign("already-clear");
      return ign("no-draft"); // CONFIRM, CANCEL
  }
}

function checkStateShape(s: SpatialState): void {
  expect(Object.isFrozen(s)).toBe(true);
  expect(s.placed).toBe(s.phase !== "IDLE");
  expect(Number.isInteger(s.confirmCount)).toBe(true);
  expect(s.confirmCount).toBeGreaterThanOrEqual(0);
  expect(s.draftText === null).toBe(s.phase !== "DRAFT");
  expect(s.sample === null).toBe(s.phase !== "DRAFT");
  if (s.sample !== null) expect(s.draftText).toBe(SAMPLE_TEXT[s.sample]);
  expect(s.confirmedText === null).toBe(s.phase !== "CONFIRMED");
  if (s.confirmedText !== null) expect([TEXT_A, TEXT_B]).toContain(s.confirmedText);
}

const SEEDS = 400;
const STEPS = 250; // 100,000 transitions in total

describe("property: random event sequences", () => {
  it(`holds every contract invariant over ${SEEDS * STEPS} transitions`, () => {
    let appliedCount = 0;
    let ignoredCount = 0;
    let confirmations = 0;
    const phasesSeen = new Set<Phase>();

    for (let seed = 1; seed <= SEEDS; seed += 1) {
      const rnd = makeLcg(seed * 7919);
      let state = createInitialState();
      let placedEver = false;

      for (let step = 0; step < STEPS; step += 1) {
        const ev = pickEvent(rnd);
        const prev = state;
        const where = `seed ${seed} step ${step} ${prev.phase} + ${JSON.stringify(ev) ?? String(ev)}`;

        // Malformed events never throw.
        let result: ReturnType<typeof reduce>;
        try {
          result = reduce(prev, asEvent(ev));
        } catch (error) {
          throw new Error(`reduce threw at ${where}: ${String(error)}`);
        }
        const next = result.state;
        state = next;
        phasesSeen.add(next.phase);

        // Reference model: outcome, reason and landing phase.
        const expected = model(prev.phase, prev.sample, ev);
        expect({ outcome: result.outcome, reason: result.reason, phase: next.phase }, where).toEqual(
          expected,
        );

        if (result.outcome === "ignored") {
          ignoredCount += 1;
          expect(next, where).toBe(prev);
          expect(result.reason, where).not.toBeNull();
        } else {
          appliedCount += 1;
          expect(next, where).not.toBe(prev);
          expect(result.reason, where).toBeNull();
        }

        checkStateShape(next);

        // confirmCount never decreases; +1 only on DRAFT --CONFIRM--> CONFIRMED.
        const isConfirmTransition =
          prev.phase === "DRAFT" && next.phase === "CONFIRMED" && result.outcome === "applied";
        expect(next.confirmCount, where).toBe(prev.confirmCount + (isConfirmTransition ? 1 : 0));
        if (isConfirmTransition) {
          confirmations += 1;
          expect((ev as { type: string }).type, where).toBe("CONFIRM");
          expect(next.confirmedText, where).toBe(prev.draftText);
        }

        // CONFIRMED is reachable only from DRAFT via CONFIRM (or stays CONFIRMED when ignored).
        if (next.phase === "CONFIRMED" && prev.phase !== "CONFIRMED") {
          expect(prev.phase, where).toBe("DRAFT");
          expect((ev as { type: string }).type, where).toBe("CONFIRM");
        }
        if (next.phase === "CONFIRMED" && prev.phase === "CONFIRMED") {
          expect(next, where).toBe(prev);
        }

        // A draft switch never confirms and keeps confirmCount.
        if (prev.phase === "DRAFT" && next.phase === "DRAFT") {
          expect(next.confirmCount, where).toBe(prev.confirmCount);
        }

        // placed is monotonic once true, and the first PLACE is what sets it.
        if (placedEver) expect(next.placed, where).toBe(true);
        if (next.placed) placedEver = true;

        // The view model stays coherent with the state.
        const vm = describeState(next);
        expect(vm.phase, where).toBe(next.phase);
        expect(vm.canConfirm, where).toBe(next.phase === "DRAFT");
        expect(vm.canCancel, where).toBe(next.phase === "DRAFT");
      }
    }

    // Sanity: the generator really exercised the machine, not just the ignore paths.
    expect(phasesSeen.size).toBe(5);
    expect(appliedCount).toBeGreaterThan(10_000);
    expect(ignoredCount).toBeGreaterThan(10_000);
    expect(confirmations).toBeGreaterThan(1_000);
  }, 120_000);

  it("every random walk is deterministic: the same seed replays to the same trace", () => {
    const trace = (seed: number): string => {
      const rnd = makeLcg(seed);
      let state = createInitialState();
      const out: string[] = [];
      for (let i = 0; i < 300; i += 1) {
        const r = reduce(state, asEvent(pickEvent(rnd)));
        state = r.state;
        out.push(`${r.outcome}/${r.reason}/${state.phase}/${state.confirmCount}`);
      }
      return out.join("|");
    };
    expect(trace(12345)).toBe(trace(12345));
    expect(trace(12345)).not.toBe(trace(54321));
  });

  it("duplicate-confirm storms: any number of repeated CONFIRMs adds at most one commit per draft", () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const rnd = makeLcg(seed);
      let state = createInitialState();
      let drafts = 0;
      state = reduce(state, PLACE).state;
      for (let i = 0; i < 200; i += 1) {
        const burst = 1 + Math.floor(rnd() * 8);
        const sel = rnd() < 0.5 ? SELECT_A : SELECT_B;
        const before = state;
        state = reduce(state, sel).state;
        if (state !== before && state.phase === "DRAFT") drafts += 1;
        for (let k = 0; k < burst; k += 1) state = reduce(state, CONFIRM).state;
        if (rnd() < 0.5) state = reduce(state, RESET).state;
        else if (rnd() < 0.5) state = reduce(state, INTERRUPT).state;
        // Never more commits than drafts that were created.
        expect(state.confirmCount).toBeLessThanOrEqual(drafts);
      }
    }
  });
});
