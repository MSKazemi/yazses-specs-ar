# Integration contract — portable core to Lens Studio (SPECS)

Status: **UNVERIFIED RESEARCH, written on Ubuntu on 2026-11-08.** Nothing here was run in Lens Studio, Preview, CLAD, MCP or LEAF. Every API below was read in official documentation or in Snap's own sample code, and each is tagged with a source `[S#]` from section 8. Where the docs do not settle a point it says **ASSUMPTION — verify in editor**. Task IDs T01–T12 are the ones in `ROADMAP.md` ("Minimum measurable acceptance matrix"); the research brief called them V1–V12.

This file is a *design brief* for the Windows Builder (W2–W5). The hackathon requires the official CLAD workflow to generate and test the actual Lens, so treat the skeleton as a constraint list and cross-check, not as code to paste unread.

## 1. Adapter architecture

```
 SIK/UI Kit button  --onTriggerUp-->  Adapter (Lens component, the ONLY file that touches Lens APIs)
                                        |  debounce (time-based, adapter-owned)
                                        |  reduce(state, event) -> { state, outcome, reason }
                                        |  describe(state)      -> ViewModel
                                        v
                         render(ViewModel): Text.text, button enabled flags, card/workbench placement
                                        |
                                        +--> console.log("[SR] ...")  one line per event (Logger evidence for T11)
```

Rules:
1. `src/logic/*` stays pure (STATE-CONTRACT). It never imports a Lens or SIK symbol. The adapter imports it, not the reverse.
2. **One writer of state.** Only `dispatch(event)` calls `reduce`. Button callbacks, the optional test hook and any LEAF scenario go through `dispatch`. No second copy of phase in the scene.
3. **Debounce in the adapter, idempotence in the core.** Drop any event of the same type arriving within `debounceSeconds` (default 0.4 s) of the last accepted one. Use an accumulated clock from `UpdateEvent.getDeltaTime()` [S16d]. The core still makes a repeated CONFIRM harmless by phase alone.
4. **Render from `describe()` only.** Visible text and enabled flags come from the ViewModel, never from the event. `statusText` names the phase in words (not colour-only); `disclosure` is shown in every phase.
5. **Disabled means hidden or inactive.** Drive each button from `canPlace`, `canSelect.A/B`, `canConfirm`, `canCancel`, `canReset`. Use `SceneObject.enabled` [S16c], which is documented. The UI Kit docs list an "Inactive" setting for buttons [S9]; its TypeScript property name was not found, so **ASSUMPTION — verify in editor** before using it instead.
6. **No network, no mic, no external action.** Do not add `InternetModule`, `RemoteServiceGateway`, ASR, camera or microphone modules to the project. The skeleton imports none.
7. Every handled event logs one line: `[SR] event=CONFIRM outcome=applied reason=- phase=CONFIRMED confirmCount=1`. `console.log` is documented for the Logger [S15].

## 2. SpatialEvent to Lens Studio input

Preferred control: **Spectacles UI Kit button** (BackPlate-backed, world-space), subscribed with `onTriggerUp`. Evidence: the UI Kit page shows `button.onTriggerUp.add(...)` [S9]; Snap's sample binds `onTriggerDown/onTriggerUp` on an `@input button: BaseButton` [S18a]; the CLAD guidance says a UI Kit Button "already handles its own tap" and not to hand-roll a collider button [S4]. Alternative: SIK `PinchButton.onButtonPinched` [S8, S18b] or a raw `Interactable` (`onTriggerStart` in sample code [S18c]; the docs page also shows `onInteractorTriggerStart(cb)` [S7] — see open question Q2).

| SpatialEvent | Control (SceneObject name) | Lens event | Visible label (English) | Enabled when |
|---|---|---|---|---|
| `PLACE` | `PlaceButton` | UI Kit `onTriggerUp` | "Place workbench" | `canPlace` |
| `SELECT_SAMPLE A` | `SampleAButton` | `onTriggerUp` | "Simulated transcription A" | `canSelect.A` |
| `SELECT_SAMPLE B` | `SampleBButton` | `onTriggerUp` | "Simulated transcription B" | `canSelect.B` |
| `CONFIRM` | `ConfirmButton` | `onTriggerUp` (deliberate: a distinct, separated, larger target) | "Confirm" | `canConfirm` |
| `CANCEL` | `CancelButton` | `onTriggerUp` | "Cancel" | `canCancel` |
| `RESET` | `ResetButton` | `onTriggerUp` | "Reset" | `canReset` |
| `INTERRUPT` | `InterruptButton` | `onTriggerUp` | "Simulate interruption" | always shown; core ignores when it does not apply |

Design notes, all taken from Snap's spatial design guide in the CLAD plugin [S17b]:
- Targets: minimum 2 degrees, spacing 1 degree; at 110 cm that is at least 4 cm (6 cm recommended). Keep Confirm and Cancel apart so one pinch cannot hit both.
- `INTERRUPT` has no real source in this prototype (no microphone). It is a **labelled simulation control**. Do not bind it to a Lens lifecycle event; `TurnOffEvent` exists [S14] but mapping it was not researched — see Q9.
- Switching A to B is `SELECT_SAMPLE` again; the core never confirms on a switch (T03).

## 3. Scene object list (names are the LEAF lookup keys)

LEAF finds things by **SceneObject name** and says to prefer stable names [S3]. Fix these names; never let CLAD rename them after tests exist.

| SceneObject | Components | Purpose |
|---|---|---|
| `SpatialReviewRoot` | `SpatialReviewAdapter` (script), optional `Component.Canvas` | Adapter; holds all `@input` wiring. World-anchored, **not** parented to the camera. |
| `Workbench` | RenderMeshVisual (simple box/plane) | The *simulated* tabletop. Enabled and positioned on `PLACE`. Label it "simulated" in text. |
| `NoteCard` | BackPlate (static) + Billboard optional [S17a] | Card beside the workbench. Child of `Workbench` or a sibling at a fixed world offset. |
| `CardText` | `Component.Text` | `vm.cardText` (draft or confirmed text; empty when null). |
| `StatusText` | `Component.Text` | `vm.statusText`. |
| `DisclosureText` | `Component.Text` | `vm.disclosure`, always visible: "Simulated transcription — not live speech". |
| `ConfirmCountText` | `Component.Text` | "Confirmed notes: n". Observable proof for T03/T04/T05/T07. |
| `PlaceButton`, `SampleAButton`, `SampleBButton`, `ConfirmButton`, `CancelButton`, `ResetButton`, `InterruptButton` | UI Kit button (+ its Interactable) | Section 2. Each holds a child label Text. |
| `SpectaclesInteractionKit` prefab | SIK | Required for any hand input [S5]. |
| Camera | Device Tracking, Tracking Mode = World; Far = a large value such as 100,000 | Required SPECS camera setup [S5]. |
| `LeafIndex` | script with `@scenariosIndex` | Registers LEAF scenarios [S3]. |

Project setup facts [S2, S5]: Lens Studio 5.22 or later; Home > SPECS > Base Template, then File > Save As; Preview device "SPECS 27"; install SPECS UI Kit (it pulls in Spectacles Interaction Kit) from the Asset Library; verify under Packages in the Asset Browser. CLAD is labelled "preview" [S1].

**Positioning (T08).** Lens Studio world units are centimetres in Snap's UI guidance ("z = -110 cm", sizes in cm [S17a, S17b]). Defaults from the same guide: focus plane at 1 m, **best default 110 cm**; near field 35–60 cm (hand reach), far field 60–160 cm (ray). The organizers' FAQ (https://learn-specs.devpost.com/details/faqs) says to keep content "about 0.5 to 3 m" away and never head-locked; Snap's UI guide gives the narrower defaults above. Use 60–160 cm with 110 cm as default, which sits inside both. Position content slightly low, because the display boresight is tilted downward [S17b]. "Fixed in world" is Snap's default anchor mode; "following the head" is the alternative [S17b]. For T08 use fixed-in-world: set the world position once on `PLACE` with `Transform.setWorldPosition` [S16b], and do not parent the card to the camera, add `Headlock`, or enable a UI Kit `Frame` follow [S17a, S19]. Snap's own sample moves an object to another object's `getWorldPosition()` [S18d].

## 4. TypeScript adapter skeleton — UNVERIFIED

Not compiled, not run. Do not describe it as working. Every symbol is from the cited source; items marked A are assumptions. Copy `src/logic/*.ts` into the Lens project (for example `Assets/Logic/`), keep them byte-identical to the repo, and re-copy after any core change (Q1).

```ts
// Assets/Scripts/SpatialReviewAdapter.ts   (UNVERIFIED SKELETON)
import { BaseButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/BaseButton"; // [S18a] path used by Snap's sample
import { createInitialState, describe, reduce } from "../Logic/index";                    // A: explicit file path into the copied core (no directory index), see Q1
import type { SpatialEvent, SpatialState } from "../Logic/index";                         // type-only: needed because isolatedModules=true [S12]

@component                                                                                // [S11]
export class SpatialReviewAdapter extends BaseScriptComponent {                           // [S11]
  @input placeButton: BaseButton;       // [S18a] pattern: @input typed as BaseButton
  @input sampleAButton: BaseButton;
  @input sampleBButton: BaseButton;
  @input confirmButton: BaseButton;
  @input cancelButton: BaseButton;
  @input resetButton: BaseButton;
  @input interruptButton: BaseButton;
  @input statusText: Text;              // built-in Text with a `text` property [S16a]
  @input cardText: Text;
  @input disclosureText: Text;
  @input confirmCountText: Text;
  @input workbench: SceneObject;        // [S16c]
  @input cameraObject: SceneObject;     // the SPECS camera, to read its world pose once on PLACE
  @input debounceSeconds: number = 0.4; // @input with a default value [S11]
  @input placeDistanceCm: number = 110; // Snap's default focal distance [S17b]
  @input placeDropCm: number = 15;      // A: boresight is tilted down; tune in editor

  private state: SpatialState = createInitialState();
  private clock = 0;
  private lastAccepted: { [type: string]: number } = {};

  onAwake(): void {
    // Do NOT bind to SIK/UI Kit events here: bind in OnStartEvent [S14, S17a].
    this.createEvent("OnStartEvent").bind(() => this.onStart());                          // [S14]
    this.createEvent("UpdateEvent").bind((e) => { this.clock += e.getDeltaTime(); });     // [S14, S16d]
  }

  private onStart(): void {
    this.placeButton.onTriggerUp.add(() => this.dispatch({ type: "PLACE" }));             // [S9, S18a]
    this.sampleAButton.onTriggerUp.add(() => this.dispatch({ type: "SELECT_SAMPLE", sample: "A" }));
    this.sampleBButton.onTriggerUp.add(() => this.dispatch({ type: "SELECT_SAMPLE", sample: "B" }));
    this.confirmButton.onTriggerUp.add(() => this.dispatch({ type: "CONFIRM" }));
    this.cancelButton.onTriggerUp.add(() => this.dispatch({ type: "CANCEL" }));
    this.resetButton.onTriggerUp.add(() => this.dispatch({ type: "RESET" }));
    this.interruptButton.onTriggerUp.add(() => this.dispatch({ type: "INTERRUPT" }));
    this.render();
  }

  /** Single entry point. Public so a LEAF scenario can call it (A: component reachable from a scenario, Q8). */
  dispatch(event: SpatialEvent): void {
    const key = event.type + (event.type === "SELECT_SAMPLE" ? event.sample : "");
    const last = this.lastAccepted[key];
    if (last !== undefined && this.clock - last < this.debounceSeconds) {
      console.log("[SR] debounced " + key);                                              // [S15]
      return;
    }
    this.lastAccepted[key] = this.clock;
    const wasPlaced = this.state.placed;
    const result = reduce(this.state, event);
    this.state = result.state;
    if (result.outcome === "applied" && event.type === "PLACE" && !wasPlaced) this.placeWorkbench();
    console.log("[SR] event=" + event.type + " outcome=" + result.outcome + " reason=" + (result.reason ?? "-") +
      " phase=" + this.state.phase + " confirmCount=" + this.state.confirmCount);
    this.render();
  }

  private placeWorkbench(): void {
    const cam = this.cameraObject.getTransform();                                        // [S16c]
    const origin = cam.getWorldPosition();                                               // [S16b]
    const fwd = cam.forward;                                                              // [S16b] A: sign of `forward` for the camera, Q5
    const pos = origin.add(fwd.uniformScale(this.placeDistanceCm)).sub(new vec3(0, this.placeDropCm, 0)); // vec3 add/sub/uniformScale [S16e, S17c]
    this.workbench.getTransform().setWorldPosition(pos);                                 // [S16b]
    this.workbench.enabled = true;                                                       // [S16c]
  }

  private render(): void {
    const vm = describe(this.state);
    this.statusText.text = vm.statusText;                                                // [S16a]
    this.cardText.text = vm.cardText ?? "";
    this.disclosureText.text = vm.disclosure;
    this.confirmCountText.text = "Confirmed notes: " + this.state.confirmCount;
    this.placeButton.sceneObject.enabled = vm.canPlace;                                  // [S16c]
    this.sampleAButton.sceneObject.enabled = vm.canSelect.A;
    this.sampleBButton.sceneObject.enabled = vm.canSelect.B;
    this.confirmButton.sceneObject.enabled = vm.canConfirm;
    this.cancelButton.sceneObject.enabled = vm.canCancel;
    this.resetButton.sceneObject.enabled = vm.canReset;
    if (!this.state.placed) this.workbench.enabled = false;
  }
}
```

Points the skeleton depends on that are **not** confirmed: `BaseButton` exposing `.sceneObject` (A: it is a `BaseScriptComponent`, Q3); the `??` operator compiling under Lens Studio's TS target (`es2019` per the default tsconfig [S12], and TypeScript down-levels it, but A); building `vec3` with `new vec3(x, y, z)` (used in Snap's guides [S17c]); the global `Text` type (the LEAF doc reads `.getComponent("Text").text` [S3]).

**Alternative if the Builder uses CLAD's own scene/UI scripts:** keep the same names and the single `dispatch` entry point, and let CLAD's generated UI emit events that call `dispatch`. CLAD guidance describes exactly that split: the UI module emits events and the main script subscribes [S4].

## 5. LEAF test plan (maps to ROADMAP T01–T12)

How LEAF works [S3]: a scenario is a class extending `Scenario` with `async run()`; a failed `expect()` or any thrown error fails it; register in a class using `@scenariosIndex static scenariosIndex: ScenarioMetadata[] = [{ id, typename: X.getTypeName() }]`; attach that index script to a SceneObject; run from the LEAF panel in Preview after resetting Preview; read **PASSED/FAILED** in the Logger. Always `await` every async call or failures are swallowed. `expect` supports `toBe, toEqual, toBeCloseTo, toBeGreaterThan, toBeLessThan, toBeTruthy, toBeFalsy, toBeNull, .not` — there is no `toContain`; use `expect(s.includes("x")).toBe(true)` [S17d]. LEAF needs `Leaf.lspkg` from the Asset Library, version-matched to SIK and Lens Studio; it only drives SIK interactables, not raw touch [S3]. Scenario-run resets the scene; do not dispatch runs in parallel; prefer delta assertions [S17d, S17e].

Helpers (imports from [S3, S17d]): `findInteractableByName`, `findInteractablesByName(name, undefined, true)` (the third argument appears to mean "enabled only", **A**, from the error text "not found or not enabled" [S17d]), `findSceneObjectByName`, `sleep`, `nextFrame`, `DefaultLeafInteractor.trigger(interactable)`.

| Scenario id | Steps (each `await`ed) | Asserts | Covers |
|---|---|---|---|
| `sr_disclosure_labels` | wait 1.5 s; read `DisclosureText`; read labels of `SampleAButton`/`SampleBButton`; trigger `PlaceButton`, `SampleAButton`, re-read | text equals the exact disclosure string in IDLE and DRAFT; labels read "Simulated transcription A/B"; no object named like a mic/record control exists | T01 |
| `sr_no_draft_before_place` | fresh Preview; `findInteractablesByName("SampleAButton", undefined, true)` | length 0; `CardText` empty; `StatusText` names IDLE | T02 |
| `sr_switch_never_confirms` | place; trigger A; sleep 600 ms; trigger B | `CardText` equals sample B text; `ConfirmCountText` still "0"; status says DRAFT | T03 |
| `sr_confirm_idempotent` | place, A, trigger `ConfirmButton`, then call `adapter.dispatch({type:"CONFIRM"})` twice via the component (A, Q8) | `ConfirmCountText` is "1" after all three; status names CONFIRMED | T04 |
| `sr_cancel_no_action` | place, A, trigger `CancelButton` | status names CANCELLED; count unchanged; Logger has no network/module error | T05 |
| `sr_reset_clean` | place, A, confirm, trigger `ResetButton`; then A again | after reset: card empty, status PLACED, count preserved ("1"); a new draft is possible and Confirm yields "2" | T06 |
| `sr_interrupt_not_confirm` | place, A, trigger `InterruptButton` | status PLACED; `CardText` empty; `ConfirmButton` not enabled; count unchanged | T07 |
| `sr_world_anchor` (partial) | place; read `Workbench`/`NoteCard` `getWorldPosition()`; `await nextFrame()` several times; read again | positions unchanged; `NoteCard` is not a descendant of the camera object | T08 (partial; the camera move itself is a manual Preview step, Q7) |
| manual / `/verify-preview` | open project, read the TypeScript Status window | green circle, Logger free of errors [S6] | T09 |
| manual / CLAD evidence | `plan-lens` interview output, MCP tool transcript, versions | `devpost/design-brief.md` exists; MCP active-scene use logged | T10 |
| LEAF run | run every scenario; also break one `expect` on purpose | Logger shows PASSED for all, and FAILED for the broken one [S3 checklist] | T11 |
| not applicable | owner publication steps | — | T12 |

IK reachability (recommended by the CLAD LEAF reference for reach-sensitive UI [S17d]): add one scenario with `createIKInteractor()` that triggers `ConfirmButton`, to confirm the control sits within reach at the chosen distance.

Do not write `expect()` values you have not observed [S17e]: after the first manual Preview, copy the real status strings from `describe()` into the scenarios.

## 6. Open questions the Builder must settle in the editor

1. **Q1 Import of the core.** Official docs show `import { RequireMe } from './RequireMe'` for a component [S11]; Snap's MIT sample imports plain, non-component modules by relative path (`./Queue`, `./Conversions`) [S18e]. So a `.ts` without `@component` imports fine. **Not documented:** resolving a directory (`./Logic` to `index.ts`). Use the explicit file path `../Logic/index` or flat files. Also confirm the core compiles under the editor's TS settings (Q10) and that the copied files stay identical to `src/logic`.
2. **Q2 Event API names.** UI Kit button: `onTriggerUp` [S9]. The UI Kit docs page names the class `RectangleButton` (with `button.initialize()` when created in code) [S9] while the CLAD cheatsheet names `Button` [S17f]. Raw interactables: `onTriggerStart.add(cb)` [S17a, S18c] vs `onInteractorTriggerStart(cb)` [S7, S18f]. Check the installed package versions and use the one that compiles.
3. **Q3 `BaseButton` as `@input` type.** Snap's sample does it [S18a]; confirm the Inspector accepts the CLAD-generated buttons and that `.sceneObject` is available.
4. **Q4 Disabling.** `SceneObject.enabled` is documented [S16c]; the "Inactive" button setting [S9] has no confirmed TS name. Decide hide versus grey-out; either way `StatusText` must still name the phase.
5. **Q5 Camera forward sign and height.** `Transform.forward` exists [S16b] but which sign points in front of the SPECS camera was not confirmed. Place once in Preview and look. Tune `placeDropCm`.
6. **Q6 Frame/follow defaults.** If CLAD builds the card with a UI Kit `Frame`, set follow off and autoShowHide false per the cheatsheet [S17f]; prefer `BackPlate` for a static card.
7. **Q7 Moving the camera in Preview (T08).** CLAD docs say CLAD "can simulate camera movement" [S4] but name no API; `preview-inspection` and `reset-preview-environment` skills exist [S4]. Record what you actually did. Do not claim physical-glasses behaviour.
8. **Q8 Can a scenario reach the adapter?** Use `findSceneObjectByName("SpatialReviewRoot").getComponent(SpatialReviewAdapter.getTypeName())` [S11 pattern]; otherwise drop the direct-`dispatch` steps and test idempotence only through the core's unit tests.
9. **Q9 Real interruption.** Decide whether the Lens pause/off event should also send `INTERRUPT`. Not researched; keep the labelled button only unless you test it.
10. **Q10 Target version.** Default Lens Studio tsconfig is `target es2019`, `lib es2019`, `isolatedModules true` [S12], while `STATE-CONTRACT.md` says ES2020 and the repo tsconfig says ES2020. The core currently uses `export type {...}` re-exports (correct for isolatedModules) and no ES2020-only library calls (checked by grep on 2026-11-08). Keep it that way: no `??`/`?.` is *required* in the core; avoid `Object.hasOwn`, `.at()`, `replaceAll`, `matchAll`, `BigInt`, `globalThis`.
11. **Q11 LEAF availability.** LEAF installs from the Asset Library (version-matched to SIK) and the LeafPlugin id is `com.snap.leaf.LeafPlugin` [S3, S17e]. If not available, mark T11 NOT RUN.
12. **Q12 Licences of reused assets.** `ls-extensions` is Apache-2.0 [S17]; `Spectacles-Sample` is MIT plus Specs Developer Terms and the Lens Studio licence agreement [S18]. Neither was copied here. If the Builder copies any sample code or template asset, attribute it.

## 7. Risks (in order)

1. UI Kit button class/event naming and whether LEAF's `findInteractableByName` finds UI Kit buttons by SceneObject name (Q2, Q3). If not, fall back to SIK `PinchButton` or raw `Interactable` on the same names.
2. Importing and compiling the copied core in Lens Studio's TS pipeline (Q1, Q10), and keeping two copies in sync.
3. World placement and T08 evidence: camera `forward` sign, how to move the Preview camera, and what LEAF can honestly show (Q5, Q7).

## 8. Sources (retrieved 2026-11-08 from Ubuntu with `curl`/`gh api`, HTML converted to text; read-only; no login)

Page text was treated as data. No page addressed an AI agent directly, but the Snap-authored CLAD plugin files are written as instructions *for* coding agents (for example "read the setter you want here before writing code"); I used them only as reference material and followed none of them.

- **S1** https://developers.specs.com/docs/clad — CLAD overview; "currently in preview".
- **S2** https://developers.specs.com/docs/clad/setup/setup-lens-studio — Lens Studio 5.22+; SPECS, Base Template, File > Save As.
- **S3** https://developers.specs.com/docs/clad/tools/test-your-lens-with-leaf — Scenario, `run()`, `@scenariosIndex`, `expect`, interactors, Logger PASSED/FAILED, install steps, considerations.
- **S4** https://developers.specs.com/docs/clad/overview-section/agents-and-skills — skill list; UI Kit button vs hand gesture split; `/verify-preview` vs LEAF; camera-movement simulation mentioned.
- **S5** https://developers.specs.com/docs/clad/additional-guides/setup-specs-project — SPECS 27 preview, UI Kit + SIK install, Device Tracking = World, camera Far.
- **S6** https://developers.specs.com/docs/clad/additional-guides/refresh-logger — TypeScript Status window; green circle.
- **S7** https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/interactionsystem — Interactor/Interactable; `onInteractorTriggerStart` example.
- **S8** https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/features/ui-elements — `PinchButton.onButtonPinched`, `ToggleButton.onStateChanged`.
- **S9** https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit/components/Button — UI Kit buttons; `onTriggerUp`, `onTriggerDown`, Inactive; code example.
- **S11** https://developers.snap.com/lens-studio/features/scripting/typescript — `@component`, `@input`, `BaseScriptComponent`, `getTypeName`, relative import example.
- **S12** https://developers.snap.com/lens-studio/features/scripting/custom-typescript-config — default tsconfig (es2019, isolatedModules).
- **S13** https://developers.snap.com/lens-studio/features/scripting/script-modules — CommonJS modules, `require` by path.
- **S14** https://developers.snap.com/lens-studio/features/scripting/script-events — OnAwake, OnStart, Update, TurnOff events.
- **S15** https://developers.snap.com/lens-studio/features/scripting/debugging — `print`, `console.log`, Logger panel.
- **S16** API reference: a) .../api/lens-scripting/classes/Built-In.Text.html b) .../Built-In.Transform.html (`getWorldPosition`, `setWorldPosition`, `forward`) c) .../Built-In.SceneObject.html (`getTransform`, `enabled`) d) .../Built-In.UpdateEvent.html (`getDeltaTime`) e) .../Built-In.vec3.html (`add`, `sub`, `uniformScale`/`scale`). All under https://developers.snap.com/lens-studio/api/lens-scripting/classes/.
- **S17** https://github.com/lens-studio-devs/ls-extensions (Apache-2.0; last push 2026-09-01), paths under `plugins/ls-clad/skills/`: a) `specs-build-ui/references/component-cheatsheet.md` (Billboard, Button, Frame, Text) b) `specs-build-ui/references/spectacles-spatial-design.md` (110 cm default, 35–60 near, 60–160 far, targets, anchor modes) c) `lens-api/SKILL.md` d) `specs-leaf-write-scenarios/references/leaf-reference.md` e) `specs-leaf-run-in-preview/SKILL.md` and `specs-leaf-write-scenarios/SKILL.md` f) `specs-build-ui/SKILL.md`.
- **S18** https://github.com/Snapchat/Spectacles-Sample (MIT + Specs terms; `LICENSE.md`): a) `Voice Playback/Assets/Scripts/ActivateMicrophoneRecorder.ts` b) `Navigation Kit/Assets/NavigationKitAssets/Scripts/MoveOnButton.ts` c) `Depth Cache/Assets/Scripts/TouchDownButton.ts` d) `Essentials/Assets/HookUpButtonsEvents/HookUpButtonsEventsTS.ts` e) `Outdoor Navigation/Assets/Scripts/Queue.ts`, `Path Pioneer/Assets/Scripts/Conversions.ts` f) `Essentials/Assets/MiniDemos/PreviousNext/TS/PreviousNext.ts`.
- **S19** https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/component-list — SIK component list (Billboard, Headlock, PinchButton, ToggleButton, Interactable).

The Builder must replace every "A" and "Q" item with an observation (version, steps, expected, observed) in the Windows run log, or leave it marked NOT RUN.
