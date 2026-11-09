import type { SampleId } from "./types";

export const SAMPLE_TEXT: Readonly<Record<SampleId, string>> = Object.freeze({
  A: "Prepare the blue and yellow blocks.",
  B: "Place the blue block beside the yellow block.",
});

export const SAMPLE_LABEL: Readonly<Record<SampleId, string>> = Object.freeze({
  A: "Simulated transcription A",
  B: "Simulated transcription B",
});

// — is an em dash; escaped so the string cannot be altered by an editor or encoding.
export const DISCLOSURE: string = "Simulated transcription — not live speech";
