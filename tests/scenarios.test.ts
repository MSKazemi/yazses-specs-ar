import { describe, expect, it } from "vitest";
import {
  DISCLOSURE,
  SAMPLE_LABEL,
  SAMPLE_TEXT,
  createInitialState,
  reduce,
} from "../src/logic";
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
  run,
  stateAfter,
} from "./support";

describe("constants", () => {
  it("exposes exactly the two preset simulated samples", () => {
    expect(SAMPLE_TEXT.A).toBe("Prepare the blue and yellow blocks.");
    expect(SAMPLE_TEXT.B).toBe("Place the blue block beside the yellow block.");
    expect(Object.keys(SAMPLE_TEXT).sort()).toEqual(["A", "B"]);
  });

  it("labels the samples as simulated", () => {
    expect(SAMPLE_LABEL.A).toBe("Simulated transcription A");
    expect(SAMPLE_LABEL.B).toBe("Simulated transcription B");
    expect(Object.keys(SAMPLE_LABEL).sort()).toEqual(["A", "B"]);
  });

  it("discloses that nothing is live speech, with an em dash", () => {
    expect(DISCLOSURE).toBe("Simulated transcription — not live speech");
  });
});

describe("initial state", () => {
  it("is IDLE, unplaced, empty, and frozen", () => {
    const s = createInitialState();
    expect(s).toEqual({
      phase: "IDLE",
      placed: false,
      sample: null,
      draftText: null,
      confirmedText: null,
      confirmCount: 0,
    });
    expect(Object.isFrozen(s)).toBe(true);
  });

  it("returns an equal, frozen, FRESH object on every call", () => {
    const a = createInitialState();
    const b = createInitialState();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    expect(Object.isFrozen(b)).toBe(true);
  });
});

describe("placement before draft", () => {
  it("ignores SELECT_SAMPLE before PLACE with reason not-placed", () => {
    const s0 = createInitialState();
    for (const ev of [SELECT_A, SELECT_B]) {
      const r = reduce(s0, ev);
      expect(r.outcome).toBe("ignored");
      expect(r.reason).toBe("not-placed");
      expect(r.state).toBe(s0);
      expect(r.state.draftText).toBeNull();
    }
  });

  it("a rejected SELECT does not queue: PLACE afterwards yields PLACED, not DRAFT", () => {
    const { state, results } = run([SELECT_A, PLACE]);
    expect(results[0]?.outcome).toBe("ignored");
    expect(results[1]?.outcome).toBe("applied");
    expect(state.phase).toBe("PLACED");
    expect(state.sample).toBeNull();
    expect(state.draftText).toBeNull();
  });

  it("PLACE sets placed=true and nothing else", () => {
    const s = stateAfter([PLACE]);
    expect(s.placed).toBe(true);
    expect(s.phase).toBe("PLACED");
    expect(s.confirmCount).toBe(0);
  });

  it("a second PLACE is ignored as already-placed in every placed phase", () => {
    const paths = [
      [PLACE],
      [PLACE, SELECT_A],
      [PLACE, SELECT_A, CONFIRM],
      [PLACE, SELECT_A, CANCEL],
    ];
    for (const path of paths) {
      const before = stateAfter(path);
      const r = reduce(before, PLACE);
      expect(r.outcome).toBe("ignored");
      expect(r.reason).toBe("already-placed");
      expect(r.state).toBe(before);
    }
  });

  it("CONFIRM and CANCEL before PLACE are ignored as not-placed", () => {
    const s0 = createInitialState();
    for (const ev of [CONFIRM, CANCEL]) {
      const r = reduce(s0, ev);
      expect(r.reason).toBe("not-placed");
      expect(r.state).toBe(s0);
    }
    expect(s0.confirmCount).toBe(0);
  });
});

describe("sample A / B selection and switching", () => {
  it("selecting A drafts the A text without confirming", () => {
    const s = stateAfter([PLACE, SELECT_A]);
    expect(s.phase).toBe("DRAFT");
    expect(s.sample).toBe("A");
    expect(s.draftText).toBe(TEXT_A);
    expect(s.confirmedText).toBeNull();
    expect(s.confirmCount).toBe(0);
  });

  it("selecting B drafts the B text without confirming", () => {
    const s = stateAfter([PLACE, SELECT_B]);
    expect(s.phase).toBe("DRAFT");
    expect(s.sample).toBe("B");
    expect(s.draftText).toBe(TEXT_B);
    expect(s.confirmedText).toBeNull();
    expect(s.confirmCount).toBe(0);
  });

  it("switching A -> B -> A -> B replaces the draft each time and never confirms", () => {
    const { results } = run([PLACE, SELECT_A, SELECT_B, SELECT_A, SELECT_B]);
    const drafts = results.slice(1);
    expect(drafts.map((r) => r.outcome)).toEqual(["applied", "applied", "applied", "applied"]);
    expect(drafts.map((r) => r.state.sample)).toEqual(["A", "B", "A", "B"]);
    expect(drafts.map((r) => r.state.draftText)).toEqual([TEXT_A, TEXT_B, TEXT_A, TEXT_B]);
    for (const r of drafts) {
      expect(r.state.phase).toBe("DRAFT");
      expect(r.state.confirmCount).toBe(0);
      expect(r.state.confirmedText).toBeNull();
    }
  });

  it("many rapid switches still commit nothing", () => {
    const events = [PLACE];
    for (let i = 0; i < 101; i += 1) events.push(i % 2 === 0 ? SELECT_A : SELECT_B);
    const s = stateAfter(events);
    expect(s.phase).toBe("DRAFT");
    expect(s.confirmCount).toBe(0);
    expect(s.confirmedText).toBeNull();
    expect(s.sample).toBe("A"); // 101 selections, the last index is 100 (even)
  });

  it("re-selecting the current sample is ignored as same-sample and preserves the draft", () => {
    const before = stateAfter([PLACE, SELECT_B]);
    const r = reduce(before, SELECT_B);
    expect(r.outcome).toBe("ignored");
    expect(r.reason).toBe("same-sample");
    expect(r.state).toBe(before);
    expect(r.state.draftText).toBe(TEXT_B);
  });

  it("a switch replaces the draft text rather than appending to it", () => {
    const s = stateAfter([PLACE, SELECT_A, SELECT_B]);
    expect(s.draftText).toBe(TEXT_B);
    expect(s.draftText).not.toContain(TEXT_A);
  });

  it("the draft survives ignored events (PLACE, malformed) unchanged", () => {
    const before = stateAfter([PLACE, SELECT_A]);
    const { state } = run(
      [
        PLACE,
        SELECT_A,
        { type: "NOPE" } as never,
        { type: "SELECT_SAMPLE", sample: "Z" } as never,
      ],
      before,
    );
    expect(state).toBe(before);
  });
});

describe("confirm exactly once", () => {
  it("DRAFT + CONFIRM commits the draft text exactly once", () => {
    const s = stateAfter([PLACE, SELECT_A, CONFIRM]);
    expect(s.phase).toBe("CONFIRMED");
    expect(s.confirmedText).toBe(TEXT_A);
    expect(s.confirmCount).toBe(1);
    expect(s.sample).toBeNull();
    expect(s.draftText).toBeNull();
  });

  it("commits whichever sample is current (B after switching from A)", () => {
    const s = stateAfter([PLACE, SELECT_A, SELECT_B, CONFIRM]);
    expect(s.confirmedText).toBe(TEXT_B);
    expect(s.confirmCount).toBe(1);
  });

  it("a second CONFIRM is ignored as already-confirmed and changes nothing", () => {
    const confirmed = stateAfter([PLACE, SELECT_A, CONFIRM]);
    const r = reduce(confirmed, CONFIRM);
    expect(r.outcome).toBe("ignored");
    expect(r.reason).toBe("already-confirmed");
    expect(r.state).toBe(confirmed);
    expect(r.state.confirmCount).toBe(1);
  });

  it("fifty duplicate CONFIRMs in a row leave confirmCount at 1", () => {
    const events = [PLACE, SELECT_B, CONFIRM];
    for (let i = 0; i < 50; i += 1) events.push(CONFIRM);
    const { state, results } = run(events);
    expect(state.confirmCount).toBe(1);
    expect(state.confirmedText).toBe(TEXT_B);
    expect(state.phase).toBe("CONFIRMED");
    expect(results.filter((r) => r.outcome === "applied")).toHaveLength(3);
    for (const r of results.slice(3)) {
      expect(r.outcome).toBe("ignored");
      expect(r.reason).toBe("already-confirmed");
    }
  });

  it("after CONFIRM, SELECT_SAMPLE / CANCEL / INTERRUPT cannot alter the committed result", () => {
    const confirmed = stateAfter([PLACE, SELECT_A, CONFIRM]);
    for (const ev of [SELECT_A, SELECT_B, CANCEL, INTERRUPT, CONFIRM]) {
      const r = reduce(confirmed, ev);
      expect(r.outcome).toBe("ignored");
      expect(r.reason).toBe("already-confirmed");
      expect(r.state).toBe(confirmed);
    }
  });

  it("CONFIRM without a draft never commits", () => {
    for (const path of [[PLACE], [PLACE, SELECT_A, CANCEL]]) {
      const before = stateAfter(path);
      const r = reduce(before, CONFIRM);
      expect(r.outcome).toBe("ignored");
      expect(r.reason).toBe("no-draft");
      expect(r.state.confirmCount).toBe(0);
      expect(r.state.confirmedText).toBeNull();
    }
  });
});

describe("cancel without committing", () => {
  it("DRAFT + CANCEL -> CANCELLED with nothing committed", () => {
    const s = stateAfter([PLACE, SELECT_A, CANCEL]);
    expect(s.phase).toBe("CANCELLED");
    expect(s.confirmedText).toBeNull();
    expect(s.confirmCount).toBe(0);
    expect(s.sample).toBeNull();
    expect(s.draftText).toBeNull();
    expect(s.placed).toBe(true);
  });

  it("cancel keeps an earlier cycle's confirmCount without committing again", () => {
    // cycle 1 confirmed, RESET clears the cycle, cycle 2 is cancelled
    const s = stateAfter([PLACE, SELECT_A, CONFIRM, RESET, SELECT_B, CANCEL]);
    expect(s.phase).toBe("CANCELLED");
    expect(s.confirmCount).toBe(1);
    expect(s.confirmedText).toBeNull();
  });

  it("a later CONFIRM after cancel is ignored as no-draft", () => {
    const { state, results } = run([PLACE, SELECT_A, CANCEL, CONFIRM, CONFIRM]);
    expect(results[3]?.reason).toBe("no-draft");
    expect(results[4]?.reason).toBe("no-draft");
    expect(state.phase).toBe("CANCELLED");
    expect(state.confirmCount).toBe(0);
    expect(state.confirmedText).toBeNull();
  });

  it("a second CANCEL is ignored as no-draft", () => {
    const cancelled = stateAfter([PLACE, SELECT_B, CANCEL]);
    const r = reduce(cancelled, CANCEL);
    expect(r.reason).toBe("no-draft");
    expect(r.state).toBe(cancelled);
  });

  it("cancel then new draft: a fresh draft is allowed and can be confirmed", () => {
    const afterCancel = stateAfter([PLACE, SELECT_A, CANCEL]);
    const { state, results } = run([SELECT_B], afterCancel);
    expect(results[0]?.outcome).toBe("applied");
    expect(state.phase).toBe("DRAFT");
    expect(state.sample).toBe("B");
    expect(state.draftText).toBe(TEXT_B);
    expect(state.confirmCount).toBe(0);

    const confirmed = reduce(state, CONFIRM).state;
    expect(confirmed.confirmedText).toBe(TEXT_B);
    expect(confirmed.confirmCount).toBe(1);
  });

  it("the cancelled draft text is never what a later draft commits", () => {
    const s = stateAfter([PLACE, SELECT_A, CANCEL, SELECT_B, CONFIRM]);
    expect(s.confirmedText).toBe(TEXT_B);
    expect(s.confirmedText).not.toBe(TEXT_A);
  });
});

describe("clear and reset from every phase", () => {
  it("IDLE: RESET ignored as already-clear", () => {
    const s0 = createInitialState();
    const r = reduce(s0, RESET);
    expect(r.outcome).toBe("ignored");
    expect(r.reason).toBe("already-clear");
    expect(r.state).toBe(s0);
  });

  it("PLACED: RESET ignored as already-clear", () => {
    const s = stateAfter([PLACE]);
    expect(reduce(s, RESET).reason).toBe("already-clear");
  });

  it("DRAFT: RESET lands in PLACED, discards the draft, commits nothing", () => {
    const r = reduce(stateAfter([PLACE, SELECT_A]), RESET);
    expect(r.outcome).toBe("applied");
    expect(r.state).toEqual({
      phase: "PLACED",
      placed: true,
      sample: null,
      draftText: null,
      confirmedText: null,
      confirmCount: 0,
    });
  });

  it("CONFIRMED: RESET lands in PLACED, clears confirmedText, keeps confirmCount", () => {
    const r = reduce(stateAfter([PLACE, SELECT_A, CONFIRM]), RESET);
    expect(r.outcome).toBe("applied");
    expect(r.state.phase).toBe("PLACED");
    expect(r.state.confirmedText).toBeNull();
    expect(r.state.confirmCount).toBe(1);
    expect(r.state.placed).toBe(true);
  });

  it("CANCELLED: RESET lands in PLACED", () => {
    const r = reduce(stateAfter([PLACE, SELECT_A, CANCEL]), RESET);
    expect(r.outcome).toBe("applied");
    expect(r.state.phase).toBe("PLACED");
  });

  it("RESET always lands in PLACED and never un-places", () => {
    for (const path of [[PLACE, SELECT_A], [PLACE, SELECT_A, CONFIRM], [PLACE, SELECT_A, CANCEL]]) {
      const s = reduce(stateAfter(path), RESET).state;
      expect(s.phase).toBe("PLACED");
      expect(s.placed).toBe(true);
    }
  });

  it("a second RESET right after a reset is ignored as already-clear", () => {
    const { results } = run([PLACE, SELECT_A, CONFIRM, RESET, RESET, RESET]);
    expect(results[3]?.outcome).toBe("applied");
    expect(results[4]?.reason).toBe("already-clear");
    expect(results[5]?.reason).toBe("already-clear");
  });

  it("a new cycle after RESET can confirm once more and confirmCount only grows", () => {
    const { results } = run([PLACE, SELECT_A, CONFIRM, RESET, SELECT_B, CONFIRM, CONFIRM]);
    const counts = results.map((r) => r.state.confirmCount);
    expect(counts).toEqual([0, 0, 1, 1, 1, 2, 2]);
    const last = results[results.length - 1]?.state;
    expect(last?.confirmedText).toBe(TEXT_B);
    expect(last?.phase).toBe("CONFIRMED");
  });
});

describe("interrupted interactions", () => {
  it("INTERRUPT in DRAFT discards the draft and returns to PLACED", () => {
    const r = reduce(stateAfter([PLACE, SELECT_A]), INTERRUPT);
    expect(r.outcome).toBe("applied");
    expect(r.state.phase).toBe("PLACED");
    expect(r.state.draftText).toBeNull();
    expect(r.state.sample).toBeNull();
    expect(r.state.confirmedText).toBeNull();
    expect(r.state.confirmCount).toBe(0);
  });

  it("a CONFIRM after an interrupted draft is ignored as no-draft", () => {
    const { state, results } = run([PLACE, SELECT_A, INTERRUPT, CONFIRM]);
    expect(results[3]?.outcome).toBe("ignored");
    expect(results[3]?.reason).toBe("no-draft");
    expect(state.confirmCount).toBe(0);
    expect(state.confirmedText).toBeNull();
    expect(state.phase).toBe("PLACED");
  });

  it("an interrupt after switching samples still discards the whole draft", () => {
    const { state } = run([PLACE, SELECT_A, SELECT_B, INTERRUPT, CONFIRM, CANCEL]);
    expect(state.phase).toBe("PLACED");
    expect(state.confirmCount).toBe(0);
  });

  it("a second INTERRUPT is ignored as already-clear", () => {
    const { results } = run([PLACE, SELECT_A, INTERRUPT, INTERRUPT]);
    expect(results[2]?.outcome).toBe("applied");
    expect(results[3]?.reason).toBe("already-clear");
  });

  it("INTERRUPT in CONFIRMED does not undo the commit", () => {
    const confirmed = stateAfter([PLACE, SELECT_A, CONFIRM]);
    const r = reduce(confirmed, INTERRUPT);
    expect(r.outcome).toBe("ignored");
    expect(r.reason).toBe("already-confirmed");
    expect(r.state.confirmedText).toBe(TEXT_A);
    expect(r.state.confirmCount).toBe(1);
  });

  it("after an interrupt a new draft can be selected and confirmed normally", () => {
    const s = stateAfter([PLACE, SELECT_A, INTERRUPT, SELECT_B, CONFIRM]);
    expect(s.confirmedText).toBe(TEXT_B);
    expect(s.confirmCount).toBe(1);
  });
});

describe("no transition ever confirms without CONFIRM received in DRAFT", () => {
  it("every non-CONFIRM event from every reachable state keeps confirmCount unchanged", () => {
    const paths = [
      [],
      [PLACE],
      [PLACE, SELECT_A],
      [PLACE, SELECT_B],
      [PLACE, SELECT_A, CONFIRM],
      [PLACE, SELECT_A, CANCEL],
    ];
    for (const path of paths) {
      const before = stateAfter(path);
      for (const ev of [PLACE, SELECT_A, SELECT_B, CANCEL, RESET, INTERRUPT]) {
        const after = reduce(before, ev).state;
        expect(after.confirmCount, `${before.phase} + ${ev.type}`).toBe(before.confirmCount);
        if (before.phase !== "CONFIRMED") {
          expect(after.phase, `${before.phase} + ${ev.type}`).not.toBe("CONFIRMED");
        }
      }
    }
  });
});
