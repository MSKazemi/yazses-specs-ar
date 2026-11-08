// Tests for the issue-driven adapter: transition(state, action) -> state.
// It must agree with reduce() for every phase x action pair.
import { describe, expect, it } from "vitest";
import { createInitialState, reduce, transition } from "../src/logic";
import type { Action, SpatialEvent } from "../src/logic";
import {
  ALL_PHASES,
  CANCEL,
  CONFIRM,
  INTERRUPT,
  PLACE,
  RESET,
  SELECT_A,
  SELECT_B,
  TEXT_A,
  TEXT_B,
  asEvent,
  stateAfter,
  stateInPhase,
} from "./support";

const ACTIONS: ReadonlyArray<readonly [Action, SpatialEvent]> = [
  [{ type: "PLACE" }, PLACE],
  [{ type: "SELECT_SAMPLE_A" }, SELECT_A],
  [{ type: "SELECT_SAMPLE_B" }, SELECT_B],
  [{ type: "CONFIRM" }, CONFIRM],
  [{ type: "CANCEL" }, CANCEL],
  [{ type: "RESET" }, RESET],
  [{ type: "INTERRUPT" }, INTERRUPT],
];

function act(state: ReturnType<typeof createInitialState>, types: readonly Action["type"][]) {
  let s = state;
  for (const type of types) s = transition(s, { type });
  return s;
}

describe("transition(): agrees with reduce()", () => {
  it("covers all seven issue actions", () => {
    expect(ACTIONS.map(([a]) => a.type)).toEqual([
      "PLACE",
      "SELECT_SAMPLE_A",
      "SELECT_SAMPLE_B",
      "CONFIRM",
      "CANCEL",
      "RESET",
      "INTERRUPT",
    ]);
  });

  describe.each(ALL_PHASES.map((p) => [p] as const))("from %s", (phase) => {
    it.each(ACTIONS.map(([a, e]) => [a.type, a, e] as const))(
      "%s equals reduce(...).state",
      (_name, action, event) => {
        const before = stateInPhase(phase);
        const viaTransition = transition(before, action);
        const viaReduce = reduce(before, event);
        expect(viaTransition).toEqual(viaReduce.state);
        if (viaReduce.outcome === "ignored") {
          expect(viaTransition).toBe(before);
        } else {
          expect(viaTransition).not.toBe(before);
          expect(Object.isFrozen(viaTransition)).toBe(true);
        }
      },
    );
  });

  it("SELECT_SAMPLE_A / _B equal SELECT_SAMPLE with sample A / B", () => {
    const placed = stateAfter([PLACE]);
    expect(transition(placed, { type: "SELECT_SAMPLE_A" })).toEqual(
      reduce(placed, { type: "SELECT_SAMPLE", sample: "A" }).state,
    );
    expect(transition(placed, { type: "SELECT_SAMPLE_B" })).toEqual(
      reduce(placed, { type: "SELECT_SAMPLE", sample: "B" }).state,
    );
    expect(transition(placed, { type: "SELECT_SAMPLE_A" }).draftText).toBe(TEXT_A);
    expect(transition(placed, { type: "SELECT_SAMPLE_B" }).draftText).toBe(TEXT_B);
  });

  it("a long mixed sequence ends in the same state through both APIs", () => {
    const seq = ACTIONS.concat(ACTIONS).concat([ACTIONS[0]!, ACTIONS[2]!, ACTIONS[3]!, ACTIONS[3]!]);
    let a = createInitialState();
    let b = createInitialState();
    for (const [action, event] of seq) {
      a = transition(a, action);
      b = reduce(b, event).state;
      expect(a).toEqual(b);
    }
  });
});

describe("transition(): behaviour through the issue API", () => {
  it("a draft before PLACE is impossible", () => {
    const s0 = createInitialState();
    for (const type of ["SELECT_SAMPLE_A", "SELECT_SAMPLE_B"] as const) {
      const s = transition(s0, { type });
      expect(s).toBe(s0);
      expect(s.phase).toBe("IDLE");
      expect(s.draftText).toBeNull();
    }
    expect(act(s0, ["SELECT_SAMPLE_A", "CONFIRM"]).confirmCount).toBe(0);
  });

  it("duplicate CONFIRM leaves confirmCount at 1", () => {
    const types: Action["type"][] = ["PLACE", "SELECT_SAMPLE_A", "CONFIRM"];
    for (let i = 0; i < 25; i += 1) types.push("CONFIRM");
    const s = act(createInitialState(), types);
    expect(s.phase).toBe("CONFIRMED");
    expect(s.confirmCount).toBe(1);
    expect(s.confirmedText).toBe(TEXT_A);
  });

  it("switching sample never confirms", () => {
    let s = act(createInitialState(), ["PLACE"]);
    for (let i = 0; i < 20; i += 1) {
      s = transition(s, { type: i % 2 === 0 ? "SELECT_SAMPLE_A" : "SELECT_SAMPLE_B" });
      expect(s.phase).toBe("DRAFT");
      expect(s.confirmCount).toBe(0);
      expect(s.confirmedText).toBeNull();
    }
    expect(s.sample).toBe("B");
    expect(s.draftText).toBe(TEXT_B);
  });

  it("an interrupted draft cannot be confirmed afterwards", () => {
    const s = act(createInitialState(), ["PLACE", "SELECT_SAMPLE_B", "INTERRUPT", "CONFIRM"]);
    expect(s.phase).toBe("PLACED");
    expect(s.confirmCount).toBe(0);
  });

  it("cancel then new draft then confirm commits once", () => {
    const s = act(createInitialState(), [
      "PLACE", "SELECT_SAMPLE_A", "CANCEL", "SELECT_SAMPLE_B", "CONFIRM",
    ]);
    expect(s.confirmedText).toBe(TEXT_B);
    expect(s.confirmCount).toBe(1);
  });
});

describe("transition(): malformed actions", () => {
  const MALFORMED: readonly unknown[] = [
    null,
    undefined,
    {},
    { type: "NOPE" },
    { type: "SELECT_SAMPLE_C" },
    { type: "select_sample_a" },
    { type: 5 },
    42,
    "CONFIRM",
    [],
  ];

  it("never throws and returns the same state object, in every phase", () => {
    for (const phase of ALL_PHASES) {
      const before = stateInPhase(phase);
      for (const bad of MALFORMED) {
        let out: unknown;
        expect(() => {
          out = transition(before, asEvent(bad) as unknown as Action);
        }, JSON.stringify(bad) ?? String(bad)).not.toThrow();
        expect(out).toBe(before);
      }
    }
  });
});
