import { describe, expect, it } from "vitest";
import { reduce } from "../src/logic";
import type { SpatialState } from "../src/logic";
import { TABLE } from "./contract-table";
import {
  ALL_PHASES,
  MALFORMED_EVENTS,
  asEvent,
  stateInPhase,
} from "./support";

describe("transition table: every phase x event pair", () => {
  it("covers every phase with all seven event shapes", () => {
    for (const phase of ALL_PHASES) {
      const rows = TABLE.filter((r) => r.phase === phase);
      // PLACE, SELECT A, SELECT B, CONFIRM, CANCEL, RESET, INTERRUPT
      expect(rows, `rows for ${phase}`).toHaveLength(7);
    }
  });

  describe.each(TABLE.map((row) => [`${row.phase} + ${row.label}`, row] as const))(
    "%s",
    (_name, row) => {
      it("matches the contract", () => {
        const before = stateInPhase(row.phase);
        const result = reduce(before, row.event);

        expect(result.outcome).toBe(row.outcome);
        expect(result.reason).toBe(row.reason);

        if (row.outcome === "ignored") {
          // Ignored: the very same state object comes back, untouched.
          expect(result.state).toBe(before);
        } else {
          expect(result.state).not.toBe(before);
          expect(result.state).toEqual(row.next);
          expect(Object.isFrozen(result.state)).toBe(true);
          expect(result.state.phase).toBe(row.next?.phase);
        }
      });
    },
  );

  describe("malformed state", () => {
    it("an unknown phase is returned untouched as ignored not-allowed-in-phase, for every event", () => {
      const bad = Object.freeze({
        ...stateInPhase("DRAFT"),
        phase: "BOGUS",
      }) as unknown as SpatialState;
      for (const row of TABLE.slice(0, 7)) {
        const r = reduce(bad, row.event);
        expect(r.outcome, row.label).toBe("ignored");
        expect(r.reason, row.label).toBe("not-allowed-in-phase");
        expect(r.state, row.label).toBe(bad);
      }
    });
  });

  describe("malformed events are ignored in every phase", () => {
    for (const phase of ALL_PHASES) {
      it(`${phase}: never throws, ignored as not-allowed-in-phase, state untouched`, () => {
        const before = stateInPhase(phase);
        for (const bad of MALFORMED_EVENTS) {
          let result: ReturnType<typeof reduce> | undefined;
          expect(() => {
            result = reduce(before, asEvent(bad));
          }, `event ${String(
            typeof bad === "symbol" ? "Symbol" : JSON.stringify(bad) ?? typeof bad,
          )}`).not.toThrow();
          expect(result?.outcome).toBe("ignored");
          expect(result?.reason).toBe("not-allowed-in-phase");
          expect(result?.state).toBe(before);
        }
      });
    }
  });
});
