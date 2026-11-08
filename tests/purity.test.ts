import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialState, describe as describeState, reduce } from "../src/logic";
import type { SpatialEvent, SpatialState } from "../src/logic";
import { TABLE } from "./contract-table";
import {
  ALL_PHASES,
  CANCEL,
  CONFIRM,
  INTERRUPT,
  MALFORMED_EVENTS,
  PLACE,
  RESET,
  SELECT_A,
  SELECT_B,
  asEvent,
  deepClone,
  makeLcg,
  stateInPhase,
} from "./support";

const VALID: readonly SpatialEvent[] = [PLACE, SELECT_A, SELECT_B, CONFIRM, CANCEL, RESET, INTERRUPT];

describe("purity: inputs are never mutated", () => {
  it("does not change a frozen input state or event, for every phase x event", () => {
    for (const phase of ALL_PHASES) {
      for (const event of VALID) {
        const state = stateInPhase(phase);
        const stateSnapshot = deepClone(state);
        const eventSnapshot = deepClone(event);
        const frozenEvent = Object.freeze({ ...event });
        reduce(state, frozenEvent as SpatialEvent);
        expect(state).toEqual(stateSnapshot);
        expect(event).toEqual(eventSnapshot);
      }
    }
  });

  it("does not write to a plain, UNFROZEN copy of the state (not relying on freeze to catch writes)", () => {
    for (const phase of ALL_PHASES) {
      for (const event of VALID) {
        const frozen = stateInPhase(phase);
        const loose: SpatialState = { ...frozen };
        expect(Object.isFrozen(loose)).toBe(false);
        const snapshot = deepClone(loose);
        const result = reduce(loose, event);
        expect(loose).toEqual(snapshot);
        expect(Object.isFrozen(loose)).toBe(false);
        // The result may be a new object or (when ignored) the input object; either way it is frozen or the input.
        if (result.state !== loose) expect(Object.isFrozen(result.state)).toBe(true);
      }
    }
  });
});

describe("purity: results are frozen and deterministic", () => {
  it("every applied transition returns a NEW frozen state", () => {
    for (const row of TABLE.filter((r) => r.outcome === "applied")) {
      const before = stateInPhase(row.phase);
      const { state } = reduce(before, row.event);
      expect(state).not.toBe(before);
      expect(Object.isFrozen(state)).toBe(true);
    }
  });

  it("freezes states that are returned after a long run of events", () => {
    const rnd = makeLcg(7);
    let state = createInitialState();
    for (let i = 0; i < 500; i += 1) {
      const ev = VALID[Math.floor(rnd() * VALID.length)] as SpatialEvent;
      state = reduce(state, ev).state;
      expect(Object.isFrozen(state)).toBe(true);
    }
  });

  it("same state + same event twice gives deep-equal results", () => {
    for (const phase of ALL_PHASES) {
      for (const event of VALID) {
        const state = stateInPhase(phase);
        const first = reduce(state, event);
        const second = reduce(state, event);
        expect(second).toEqual(first);
        // And equal to a result computed from an independently built identical state.
        const rebuilt = reduce(stateInPhase(phase), event);
        expect(rebuilt).toEqual(first);
      }
    }
  });

  it("an ignored transition returns the very same state object", () => {
    for (const row of TABLE.filter((r) => r.outcome === "ignored")) {
      const before = stateInPhase(row.phase);
      expect(reduce(before, row.event).state).toBe(before);
    }
    for (const phase of ALL_PHASES) {
      const before = stateInPhase(phase);
      for (const bad of MALFORMED_EVENTS) {
        expect(reduce(before, asEvent(bad)).state).toBe(before);
      }
    }
  });

  it("reason is null exactly when applied", () => {
    for (const row of TABLE) {
      const r = reduce(stateInPhase(row.phase), row.event);
      expect(r.reason === null).toBe(r.outcome === "applied");
    }
  });

  it("a prior call does not influence a later one (no hidden module state)", () => {
    const before = stateInPhase("DRAFT");
    const baseline = reduce(before, CONFIRM);
    // Churn through unrelated sequences, then repeat.
    let s = createInitialState();
    for (const ev of [PLACE, SELECT_B, CONFIRM, RESET, SELECT_A, CANCEL, INTERRUPT]) {
      s = reduce(s, ev).state;
    }
    expect(reduce(before, CONFIRM)).toEqual(baseline);
  });
});

describe("no external side effects", () => {
  const consoleMethods = ["log", "info", "warn", "error", "debug", "trace"] as const;

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("never touches fetch, console, Date.now or Math.random during a long event sequence", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const consoleObj = (globalThis as unknown as { console: Record<(typeof consoleMethods)[number], (...a: unknown[]) => void> }).console;
    const consoleSpies = consoleMethods.map((m) => vi.spyOn(consoleObj, m).mockImplementation(() => undefined));
    const dateNow = vi.spyOn(Date, "now");
    const random = vi.spyOn(Math, "random");

    // Own deterministic generator (it does not use Math.random).
    const rnd = makeLcg(2026);
    let state = createInitialState();
    for (let i = 0; i < 3000; i += 1) {
      const pick = rnd();
      const event: SpatialEvent =
        pick < 0.1
          ? asEvent(MALFORMED_EVENTS[Math.floor(rnd() * MALFORMED_EVENTS.length)])
          : (VALID[Math.floor(rnd() * VALID.length)] as SpatialEvent);
      state = reduce(state, event).state;
      describeState(state);
    }

    expect(fetchSpy).not.toHaveBeenCalled();
    for (const spy of consoleSpies) expect(spy).not.toHaveBeenCalled();
    expect(dateNow).not.toHaveBeenCalled();
    expect(random).not.toHaveBeenCalled();
  });

  it("does not construct Date objects or read clocks via performance.now", () => {
    const g = globalThis as unknown as { performance?: { now: () => number } };
    const perf = g.performance;
    const perfNow = perf ? vi.spyOn(perf, "now") : null;
    const RealDate = Date;
    const dateCtor = vi.fn(function (this: unknown, ...args: unknown[]) {
      return new (RealDate as unknown as new (...a: unknown[]) => Date)(...args);
    });
    vi.stubGlobal("Date", Object.assign(dateCtor, { now: RealDate.now }));
    try {
      let state = createInitialState();
      for (const ev of VALID) state = reduce(state, ev).state;
      describeState(state);
    } finally {
      vi.unstubAllGlobals();
    }
    expect(dateCtor).not.toHaveBeenCalled();
    if (perfNow) expect(perfNow).not.toHaveBeenCalled();
  });
});

describe("describe() is pure too", () => {
  it("does not mutate the state and is deterministic", () => {
    for (const phase of ALL_PHASES) {
      const state = stateInPhase(phase);
      const snapshot = deepClone(state);
      const first = describeState(state);
      const second = describeState(state);
      expect(state).toEqual(snapshot);
      expect(second).toEqual(first);
    }
  });
});
