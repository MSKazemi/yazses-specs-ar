import { describe, expect, it } from "vitest";
import { DISCLOSURE, SAMPLE_TEXT, describe as describeState, reduce } from "../src/logic";
import type { Phase, SpatialState } from "../src/logic";
import {
  ALL_PHASES,
  CANCEL,
  CONFIRM,
  PLACE,
  RESET,
  SELECT_A,
  SELECT_B,
  TEXT_A,
  TEXT_B,
  stateAfter,
  stateInPhase,
} from "./support";

describe("describe(): view model", () => {
  it("echoes the phase of the state", () => {
    for (const phase of ALL_PHASES) {
      expect(describeState(stateInPhase(phase)).phase).toBe(phase);
    }
  });

  it("carries the simulated-transcription disclosure in EVERY phase", () => {
    for (const phase of ALL_PHASES) {
      expect(describeState(stateInPhase(phase)).disclosure, phase).toBe(DISCLOSURE);
    }
    // ...also for B drafts and a second-cycle confirmation.
    expect(describeState(stateAfter([PLACE, SELECT_B])).disclosure).toBe(DISCLOSURE);
    expect(
      describeState(stateAfter([PLACE, SELECT_A, CONFIRM, RESET, SELECT_B, CONFIRM])).disclosure,
    ).toBe(DISCLOSURE);
  });

  it("DISCLOSURE says simulated and not live speech", () => {
    expect(DISCLOSURE.toLowerCase()).toContain("simulated");
    expect(DISCLOSURE.toLowerCase()).toContain("not live speech");
  });

  it("canConfirm and canCancel are true only in DRAFT", () => {
    for (const phase of ALL_PHASES) {
      const vm = describeState(stateInPhase(phase));
      expect(vm.canConfirm, `${phase} canConfirm`).toBe(phase === "DRAFT");
      expect(vm.canCancel, `${phase} canCancel`).toBe(phase === "DRAFT");
    }
  });

  it("canReset is true in DRAFT, CONFIRMED, CANCELLED only", () => {
    const expected: Record<Phase, boolean> = {
      IDLE: false,
      PLACED: false,
      DRAFT: true,
      CONFIRMED: true,
      CANCELLED: true,
    };
    for (const phase of ALL_PHASES) {
      expect(describeState(stateInPhase(phase)).canReset, phase).toBe(expected[phase]);
    }
  });

  it("canPlace is true only when PLACE would be applied (IDLE)", () => {
    for (const phase of ALL_PHASES) {
      const vm = describeState(stateInPhase(phase));
      expect(vm.canPlace, phase).toBe(phase === "IDLE");
    }
  });

  it("the can* flags never promise an action that reduce() would ignore", () => {
    for (const phase of ALL_PHASES) {
      const state = stateInPhase(phase);
      const vm = describeState(state);
      const applied = (ev: Parameters<typeof reduce>[1]) => reduce(state, ev).outcome === "applied";
      expect(vm.canPlace, `${phase} canPlace`).toBe(applied(PLACE));
      expect(vm.canConfirm, `${phase} canConfirm`).toBe(applied(CONFIRM));
      expect(vm.canCancel, `${phase} canCancel`).toBe(applied(CANCEL));
      expect(vm.canReset, `${phase} canReset`).toBe(applied(RESET));
      if (vm.canSelect.A) expect(applied(SELECT_A), `${phase} canSelect.A`).toBe(true);
      if (vm.canSelect.B) expect(applied(SELECT_B), `${phase} canSelect.B`).toBe(true);
    }
  });

  it("canSelect: closed in IDLE and CONFIRMED, open for both in PLACED and CANCELLED", () => {
    expect(describeState(stateInPhase("IDLE")).canSelect).toEqual({ A: false, B: false });
    expect(describeState(stateInPhase("CONFIRMED")).canSelect).toEqual({ A: false, B: false });
    expect(describeState(stateInPhase("PLACED")).canSelect).toEqual({ A: true, B: true });
    expect(describeState(stateInPhase("CANCELLED")).canSelect).toEqual({ A: true, B: true });
  });

  it("canSelect in DRAFT is true only for the OTHER sample (the current one would be same-sample)", () => {
    expect(describeState(stateAfter([PLACE, SELECT_A])).canSelect).toEqual({ A: false, B: true });
    expect(describeState(stateAfter([PLACE, SELECT_B])).canSelect).toEqual({ A: true, B: false });
  });

  it("canSelect[x] is true exactly when SELECT_SAMPLE x would be applied", () => {
    for (const phase of ALL_PHASES) {
      const state = stateInPhase(phase);
      const vm = describeState(state);
      expect(vm.canSelect.A, `${phase} A`).toBe(reduce(state, SELECT_A).outcome === "applied");
      expect(vm.canSelect.B, `${phase} B`).toBe(reduce(state, SELECT_B).outcome === "applied");
    }
  });

  it("describe of a malformed state (unknown phase) returns the IDLE view", () => {
    const bad = { ...stateInPhase("DRAFT"), phase: "BOGUS" } as unknown as SpatialState;
    expect(describeState(bad)).toEqual(describeState(stateInPhase("IDLE")));
  });

  it("statusText is a non-empty, trimmed, single-line string in every phase", () => {
    for (const phase of ALL_PHASES) {
      const { statusText } = describeState(stateInPhase(phase));
      expect(typeof statusText).toBe("string");
      expect(statusText.trim().length, phase).toBeGreaterThan(0);
      expect(statusText, phase).toBe(statusText.trim());
      expect(statusText, phase).not.toMatch(/[\r\n]/);
      expect(statusText.length, phase).toBeLessThanOrEqual(120);
    }
  });

  it("statusText is distinct for every phase", () => {
    const texts = ALL_PHASES.map((p) => describeState(stateInPhase(p)).statusText);
    expect(new Set(texts).size).toBe(ALL_PHASES.length);
  });

  it("statusText names the phase in words (not colour-only), case-insensitively", () => {
    for (const phase of ALL_PHASES) {
      const { statusText } = describeState(stateInPhase(phase));
      // The contract only says the text "names the phase". IDLE is the one phase whose
      // natural plain-language name is "not placed", so either spelling is accepted there.
      const words = phase === "IDLE" ? ["idle", "not placed"] : [phase.toLowerCase()];
      const text = statusText.toLowerCase();
      expect(
        words.some((w) => text.includes(w)),
        `${phase}: "${statusText}"`,
      ).toBe(true);
    }
  });

  it("cardText is the draft text in DRAFT", () => {
    expect(describeState(stateAfter([PLACE, SELECT_A])).cardText).toBe(TEXT_A);
    expect(describeState(stateAfter([PLACE, SELECT_B])).cardText).toBe(TEXT_B);
    expect(describeState(stateAfter([PLACE, SELECT_A, SELECT_B])).cardText).toBe(SAMPLE_TEXT.B);
  });

  it("cardText is the confirmed text in CONFIRMED", () => {
    expect(describeState(stateAfter([PLACE, SELECT_A, CONFIRM])).cardText).toBe(TEXT_A);
    expect(describeState(stateAfter([PLACE, SELECT_B, CONFIRM])).cardText).toBe(TEXT_B);
  });

  it("cardText is null in IDLE, PLACED and CANCELLED", () => {
    for (const phase of ["IDLE", "PLACED", "CANCELLED"] as const) {
      expect(describeState(stateInPhase(phase)).cardText, phase).toBeNull();
    }
  });

  it("a confirmed card disappears after RESET", () => {
    expect(describeState(stateAfter([PLACE, SELECT_A, CONFIRM, RESET])).cardText).toBeNull();
  });
});
