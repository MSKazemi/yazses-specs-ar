# Demo storyboard — YazSes Spatial Review

**Status: script only. Nothing here has been recorded.** Every shot is **to be recorded on Windows**, from a real Lens Studio Preview of the real Lens project. If a behaviour does not work in Preview, cut that shot and say less. Do not fake it, mock it in a browser, or edit footage to imply it works.

Target length: **2:20 (140 s)**, inside the 120–150 s plan and well under the 3-minute limit.

Exact on-screen disclosure (visible in every shot, in the Lens itself, not only in a caption):

> Simulated transcription — not live speech

Sample strings (exact):

- A: "Prepare the blue and yellow blocks."
- B: "Place the blue block beside the yellow block."

Narration is written for a calm human voice. Record it yourself; no synthetic voice that implies a person or a product. Wording marked `[CONFIRM]` depends on what the finished Lens actually does.

## Shot list

| # | Time | On screen | Narration | Status |
|---|---|---|---|---|
| 1 | 0:00–0:12 | Lens Studio Preview with the Lens loaded; the disclosure is readable. Title overlay added in the video editor: "YazSes Spatial Review". | "This is YazSes Spatial Review, a Lens Studio experiment for SPECS. Everything you will see is simulated. Nothing here listens to speech." | to be recorded on Windows |
| 2 | 0:12–0:26 | Scene overview: simulated tabletop workbench with the blue and yellow blocks, and the note card beside it `[CONFIRM]`. | "The setting is a small tabletop task. The idea: a short text draft sits next to the work, so you can check it without looking away." | to be recorded on Windows |
| 3 | 0:26–0:40 | Place the note. Status text shows the placed state, with no draft. | "First I place the note beside the workbench. Until it is placed, nothing can be drafted." | to be recorded on Windows |
| 4 | 0:40–0:58 | Choose Simulated transcription A. Draft appears: "Prepare the blue and yellow blocks." Status text says it is an unconfirmed draft. | "I choose Simulated transcription A. It is a preset sentence, labelled as simulated. It appears as a draft, not as a confirmed result." | to be recorded on Windows |
| 5 | 0:58–1:12 | Switch to Simulated transcription B. Draft changes to "Place the blue block beside the yellow block." Still unconfirmed. | "Switching to B replaces the draft. Switching never confirms anything." | to be recorded on Windows |
| 6 | 1:12–1:30 | Press Confirm. Status shows confirmed. Press Confirm again; nothing changes. | "Only a deliberate Confirm commits the text. A second Confirm does nothing more." | to be recorded on Windows |
| 7 | 1:30–1:48 | Reset. Back to the placed note. Choose A, then Cancel. Status shows cancelled; no text is committed. | "Reset returns to a clean note. If I draft again and choose Cancel, nothing is committed." | to be recorded on Windows |
| 8 | 1:48–2:02 | Move the Preview viewpoint around the scene; the card stays beside the workbench `[CONFIRM]`. Cut this shot if it does not hold. | "As the viewpoint moves, the card stays next to the workbench." | to be recorded on Windows |
| 9 | 2:02–2:20 | Final frame: Lens with disclosure, plus an overlay listing limits and the repo URL. | "This is a prototype. The input is simulated, it was tested in Lens Studio Preview only, and it is not connected to YazSes. The code is in the linked repository." | to be recorded on Windows |

Total narration is about 165 words (counted from the table), roughly 80 s of speech; the rest of the 140 s is for on-screen actions and pauses. If the take runs past 2:30, trim shot 2 or 8 rather than speeding up.

Overlay text for shot 9 (add in the editor, plain text, no logos):

- "Simulated input only. No microphone, no speech recognition."
- "Tested in Lens Studio Preview. No headset testing."
- "Not integrated with YazSes."
- Repository URL: https://github.com/MSKazemi/yazses-specs-ar

## Rules for what appears on screen

Do **not** show:

- Tokens, API keys, auth headers, account pages with personal data, or the Devpost or YouTube login state.
- `.mcp.json` or any config file that can hold credentials. If the terminal is visible, keep it out of frame.
- Private paths (home directories with a username, private repo names, private issue URLs). Record only the Preview window, or crop to it.
- Third-party trademarks, logos, or other companies' branding beyond what is inherent in the Lens Studio window itself. No brand names in overlays.
- Music, even royalty-free, unless its licence is verified and credited. Narration only.
- Real user audio, real transcripts, or real people. Only the two sample strings.
- Any claim in narration or overlay of live speech, headset use, YazSes integration, or accessibility benefit.

## Recording checklist

Before recording:

- [ ] The Lens is the real project opened in Lens Studio on Windows; Preview runs without blocking errors. Note the Lens Studio version for the description.
- [ ] Which shots actually work is decided first; shots that fail are cut from the script.
- [ ] Notifications off; no other windows, tabs, chat or terminal visible; capture only the Preview window or crop to it.
- [ ] Disclosure "Simulated transcription — not live speech" is readable at 1080p.
- [ ] Screen recording is of the real Preview, not a mock-up.
- [ ] Narration is recorded in English; add English captions.

After recording:

- [ ] Length is under 3:00 (aim 2:00–2:30).
- [ ] Review the full video frame by frame for tokens, private paths, usernames, and trademarks.
- [ ] Upload to YouTube as **Public** (not Unlisted, not Private) after the owner reviews it.
- [ ] Open the video link in a signed-out browser window (or private window) and confirm it plays without login.
- [ ] Title and description on YouTube repeat the disclosure and limits; no hype.
- [ ] Put the video URL in the Devpost entry. The owner performs the upload and the submission; agents do not.
