# Licensing and rights: what may go in the public repository

Research date: 2026-11-08 (Ubuntu session). This is an engineering reading of public texts, **not legal advice**.
Every row says where the evidence came from. Nothing here has been sent to Snap or Devpost.

**Bottom line**

| Question | Answer |
|---|---|
| Publish entrant-authored scripts, docs, tests, the `devpost/` folder? | **YES** (they are ours) |
| Publish the generated Lens Studio project files (`.esproj`, `Scene.scene`, `.meta`, `Assets/`)? | **YES, with high confidence.** Devpost's own skill pack tells entrants to publish the project folder; Snap's own MIT sample repo publishes exactly these file types. |
| Publish Snap template/package files that live inside the project (`Packages/*.lspkg`: Spectacles Interaction Kit, UI Kit, Sync Kit, Leaf)? | **UNKNOWN, leaning YES.** Snap's own MIT repo commits `SpectaclesInteractionKit.lspkg` and `SpectaclesUIKit.lspkg` in every sample, and the organizer rules explicitly allow "Lens Studio templates and assets". But no text we found grants third parties an explicit redistribution licence for the packages themselves. Ask (question below). |
| Publish the Lens Studio application or any of its install directory? | **NO.** |

## 1. Evidence read (primary sources)

1. **Lens Studio License Agreement** (effective 2024-06-17), read in full at
   <https://www.snap.com/en-US/terms/lens-studio-license-agreement>.
   - §2: limited licence to install and use Lens Studio for developing Lenses. "No other use or redistribution of Lens Studio is allowed."
   - §3(d),(f): no derivative works of "Lens Studio, or any portion of the Lens Studio"; no distributing "Lens Studio in whole or in part".
   - §1(a): "Lens Studio" = the software **plus Documentation** and "any other software and tools marked in an accompanying file as being subject to this Agreement".
   - §5: "Your Content" (anything you use in a Lens, from any source) is your responsibility. You warrant you own or have licences to it.
   - §4(d): third-party materials inside Lens Studio stay the property of their owners.
   - The agreement **never mentions** project files, templates, or the Asset Library. It restricts Lens Studio, not what the user authors with it.
2. **Snap Developer Terms** (effective 2025-01-31), read in full at <https://www.snap.com/en-US/terms/developer>. They govern the Snap Developer Program (APIs, SDKs, keys) for an "Application".
   - Para 2(a): tools may include third-party or open-source software governed by its own licence.
   - Para 2(d): "Snap Content" is defined (line 12 of the page) as content "created, uploaded... or otherwise provided by Snap, Snap users... or other third-party licensors". You may not use or distribute Snap Content "unless you obtain all necessary rights, permissions, and licenses". Whether template meshes/textures count as "Snap Content" is not stated. This is the clause that keeps template assets at UNKNOWN.
   - Nothing on the page is specific to Lens Studio project files or to the hackathon.
3. **Official hackathon rules**, read live 2026-11-08 at <https://learn-specs.devpost.com/rules>:
   - "Participants may use standard development tools, including frameworks, libraries, starter templates, Lens Studio templates and assets, and AI coding assistants, but must disclose any other pre-existing code or work incorporated into the Project."
   - "Provide a URL to your public code repository... The repository should contain the Lens Studio project files." The `devpost` planning folder is welcome, not required.
   - "Use of the developer tools will be subject to the license agreement related thereto."
   - IP: the Submission must be "solely owned" by the entrant and not violate others' rights; open source is allowed if the entrant "complies with applicable open source licenses" and builds on it.
   - Snap gets a non-exclusive licence to use the entry for judging. Entrant must make the Project available free of charge and without restriction for testing until judging ends.
4. **Organizer update 2026-11-06** (<https://learn-specs.devpost.com/updates/47523-4-projects-reviewed-live-what-to-fix-before-you-submit>): eligibility needs "A public code repo (GitHub preferred) with your Lens Studio project files and the devpost folder the Devpost Learn skill pack creates. We check for that folder."
5. **Devpost skill pack README** (<https://github.com/challengepost/learn-specs>, MIT, Copyright 2026 Devpost): "Publish the Lens project folder, with `devpost/` inside it, as your public repo." The project folder is the one created by SPECS, Base Template, Save As, and it contains the `.esproj` and `.mcp.json`.
6. **Snap's own sample repo** `Snapchat/Spectacles-Sample` (<https://github.com/Snapchat/Spectacles-Sample>). `LICENSE.md`: "Copyright (c) 2026 Specs Inc. The sample projects in this repository are made available under the MIT License... Please also see the Specs Developer Terms and Lens Studio License Agreement". (GitHub's detector reports `NOASSERTION` only because the file has extra text; the body is MIT.)
   - Observed in the tree (Laser Pointer sample): `LaserPointer.esproj`, `Assets/`, `Packages/` containing `SpectaclesInteractionKit.lspkg`, `SpectaclesUIKit.lspkg`, `SpectaclesSyncKit.lspkg`, `LSTween.lspkg` (each ~4 MB, stored with Git LFS), plus `.meta` files. Its `.gitignore` is the one Lens Studio generates (ignores `Cache/`, `Workspaces/`, `BackUp/`, `Support/`, `PluginsUserPreferences/`, `.vscode/`, `jsconfig.json`, `tsconfig.json`, `*.lock`).
   - Other samples carry per-sample licences (for example `Think Out Loud/LICENSE` is MIT, Copyright 2025 Alessio Grancini), so third-party sample code keeps its own licence.
   - Caveat: this shows Snap itself publishes the packages. It does not by itself license a third party to redistribute a standalone copy.
7. **`lens-studio-devs/ls-extensions`** (CLAD plugin `ls-clad`, LEAF skills): `LICENSE` = "Copyright 2026 Specs Inc... licensed under the Apache License, Version 2.0... Use of Lens Studio, Lens Studio APIs, and other Snap products and services remains subject to the applicable Snap terms." Source files carry `SPDX-License-Identifier: Apache-2.0`.
8. LEAF itself is a **package installed from the Lens Studio Asset Library** (`Leaf.lspkg`) into the project, per `plugins/ls-clad/skills/specs-leaf-install-packages/SKILL.md`. Its licence text was not found.
9. **Not found:** a standalone repository or licence file for the Spectacles Interaction Kit or UI Kit (`Snapchat/Spectacles-Interaction-Kit` and `Snapchat/Spectacles-UI-Kit` returned 404), and no Asset Library licence page. The organizer Discussions and Updates pages contain nothing about licensing or template redistribution (read 2026-11-08).

## 2. Category table

| # | Item | Owner | Source | Public repo? | Evidence and notes |
|---|---|---|---|---|---|
| 1 | Lens Studio application binaries, installer, install directory, bundled Snap libraries | Snap / Specs Inc. and licensors | LSLA §2, §3(d),(f) | **NO** | "No other use or redistribution of Lens Studio is allowed"; no derivative or distribution "in whole or in part". Never copy anything out of the install directory. |
| 2 | Generated project files: `*.esproj`, `Scene.scene`, `*.scene.meta`, `Assets/**` that we or CLAD created, `.meta` files | Entrant (output of entrant's use; "Your Content") | LSLA §5; Devpost rules; `learn-specs` README | **YES** | Organizers require "Lens Studio project files" in the repo. Snap's own MIT repo publishes the same file types. The LSLA restricts Lens Studio itself, not the entrant's project. Remaining risk: files may embed Snap template content (row 4-5). |
| 3 | Entrant-authored scripts (TypeScript/JS), tests, docs, `devpost/` brief, README, `src/logic` | Entrant | Our work | **YES** | License choice is ours. See AGENTS.md: evaluate Apache-2.0 against the actual assets before applying it to the whole repo. |
| 4 | SPECS Base Template scene, prefabs, materials, meshes, textures that Lens Studio puts in the new project | Snap / Specs Inc. | Rules ("Lens Studio templates and assets" are allowed); Developer Terms para 2(d) | **UNKNOWN (lean YES)** | The rules explicitly allow using them. Snap's MIT sample repo ships template-style scenes and assets. But the Developer Terms bar distributing "Snap Content" without rights. Mitigation: keep the template scaffolding as unmodified as possible, disclose it, and ask. |
| 5 | `Packages/*.lspkg`: Spectacles Interaction Kit, UI Kit, Sync Kit, Remote Service Gateway, LSTween | Snap / Specs Inc. (LSTween may be third-party) | Observed committed in Snap's MIT repo | **UNKNOWN (lean YES)** | Strongest evidence is Snap's own repo (item 6 above). No explicit third-party redistribution grant found; no standalone licence found. Safest pattern is to commit what Lens Studio created in the project as-is (the organizers asked for the project files), add the NOTICE, and not republish extracted package contents elsewhere. |
| 6 | LEAF package (`Leaf.lspkg`) installed by the CLAD skill | Snap / Specs Inc. | `specs-leaf-install-packages` skill | **UNKNOWN (lean YES)** | Same reasoning as row 5. Licence text of the package not found. |
| 7 | CLAD plugin, LEAF skills, `ls-clad` agents (lives in the agent's plugin directory, not in the project) | Specs Inc., Apache-2.0 | `lens-studio-devs/ls-extensions/LICENSE` | **YES if ever copied, but do not copy** | Apache-2.0 allows redistribution with notice. It is not needed in our repo; reference it by name and URL. |
| 8 | Devpost skill pack (`skills/plan-lens/**`) and the generated `devpost/design-brief.md` | Devpost, MIT; the brief is our output | `challengepost/learn-specs` LICENSE | **YES** | MIT. The generated brief is a filled-in template: keep the MIT notice if template text is retained. Organizers want the `devpost/` folder. |
| 9 | `.mcp.json` created in the project folder | Local configuration | `learn-specs` README step 2 | **INSPECT FIRST** | Not a licensing issue but a secrets one: AGENTS.md forbids committing an auth-bearing `.mcp.json`. Read it; commit only if it contains no token, path or account data (or add a sanitized example). |
| 10 | Lens Studio Asset Library packages (other than Snap kits), third-party models, textures, fonts, audio | Varies per asset | Asset page licence | **NO until each licence is read** | LSLA §5: we warrant that we hold rights to everything used. Default plan uses none; if any is added, record name, author, licence, URL in `NOTICE.md`. |
| 11 | Snap / Spectacles trademarks, logos, Snapchat ghost, Bitmoji | Snap | Developer Terms para 2(e) (Snap Brand Features) | **NO** (do not add) | Also relevant to the video: rules forbid third-party trademarks and copyrighted music unless permitted. |
| 12 | Captured Lens Studio screenshots/video in README or the demo | Mixed (our scene plus Snap UI chrome) | Rules (video) | **YES for preview recordings of our Lens** | The rules require a screen recording of the Preview. Avoid showing account names, tokens, or private folders. |
| 13 | Real user audio, transcripts, voiceprints, credentials | n/a | AGENTS.md | **NO** | Prototype uses only the two synthetic "Simulated transcription" inputs. |
| 14 | YazSes core application code | Owner | Separate repo | **Not part of this repo** | Do not copy. Disclose any pre-existing code that is reused (rules require disclosure). |

## 3. Recommended publication pattern

1. Publish the **entire Lens project folder** as created by SPECS, Base Template, Save As (that is what the organizers and the skill pack ask for), with `devpost/` inside it.
2. Use the `.gitignore` that Lens Studio generates (as Snap's samples do). Do not commit `Cache/`, `Workspaces/`, `BackUp/`, `Support/`, `PluginsUserPreferences/`, `.vscode/`.
3. Do not extract, repackage or re-host any Snap package outside the project. Leave `Packages/*.lspkg` exactly as Lens Studio installed them. Use Git LFS if the host rejects files over its size limit (Snap's repo uses LFS for them), but check LFS works for the judges' clone.
4. Add `NOTICE.md` at the repo root listing: Lens Studio (not distributed), SPECS Base Template and Snap packages (name and version as shown in Lens Studio, source Specs Inc., used under the Lens Studio License Agreement and Specs Developer Terms), LEAF, Devpost Learn skill pack (MIT, Devpost), CLAD plugin (Apache-2.0, not included), and anything else with licence and URL.
5. Add the same disclosure in the README and the Devpost description, as the rules require: pre-existing code (`src/logic` is written before the Submission Period, if that is so: say it plainly), Snap templates/packages, AI assistants used.
6. License the **authored** code and docs separately and explicitly (for example Apache-2.0 for our files only), with a sentence that Snap-owned template and package files stay under Snap's terms. Do this only after the owner confirms.
7. Keep a sanitized `.mcp.json` or none at all.
8. Open the repo while signed out and make sure a judge can clone it with LFS.

## 4. What NOT to upload

- Anything from the Lens Studio install directory, or Lens Studio installers.
- Extracted or modified copies of Snap packages outside `Packages/`.
- Auth-bearing `.mcp.json`, `.env`, tokens, Snap account data, `.claude/`, `~/.claude`.
- Any private-business repo content or paths.
- Real audio, transcripts or personal recordings.
- Third-party assets without a read licence; Snap or Bitmoji branding; copyrighted music in the video.
- Lens Studio `Cache/`, `Workspaces/`, `BackUp/`, `Support/` folders.

## 5. Question for Devpost / Snap support (READY, NOT SENT; owner approval required)

Channels: Devpost Discussions at <https://learn-specs.devpost.com/forum_topics> (public), `support@devpost.com` (from the rules), Discord `#specs-general`. Sending needs the owner's go-ahead and the owner's account.

> Subject: Learn AR with SPECS — may we publish the Lens Studio project including Snap's SPECS packages?
>
> Hello, we are building a SPECS Lens for the Learn AR with SPECS hackathon. The rules ask for a public repository containing the Lens Studio project files, and the skill pack README says to publish the project folder. Our project was created from SPECS > Base Template > Save As and contains `Packages/*.lspkg` (Spectacles Interaction Kit, Spectacles UI Kit, and possibly Leaf and others) and template scenes/assets. We confirmed that Snap's `Snapchat/Spectacles-Sample` repository (MIT) publishes projects with these packages inside.
>
> Can you confirm that entrants may publish the unmodified Snap-provided template files and `.lspkg` packages inside their public project repository for the purposes of judging (and afterwards), and whether any attribution or notice file is required? If any package or asset may not be redistributed, please say which, so we can reference it instead. Thank you.

## 6. Open items

- Owner decides whether to ask the question above. Without an answer, the safe default is: publish the project as created (the organizers requested it), unmodified Snap packages included, with `NOTICE.md`.
- After the Windows build, record the exact package names and versions in `Packages/` and run the `.mcp.json` inspection before the first push.
- Re-read the LSLA version shown at install time on Windows; if Lens Studio shows a newer agreement than 2024-06-17, the table above must be rechecked.
