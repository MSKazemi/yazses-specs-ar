# Devpost entry checklist: Learn AR with SPECS

Deadline: **2026-11-09 17:00 US Eastern = 23:00 CET** (rules section 1; Eastern is on standard time since 2026-11-01). Organizers advise submitting by Monday noon ET and say edits are possible until the deadline.

Legend: **[OBSERVED]** seen live in the owner's Chrome on 2026-11-08 (about 22:15 UTC, read-only). **[RULES]** read from the Official Rules, Resources, FAQ or Updates pages. **[EXPECTED]** inferred, not seen.

## 1. Live status (OBSERVED)

- Signed in as Devpost user **"mohsen"**, profile link `devpost.com/mohsen`. [OBSERVED]
- Hackathon page still shows **"Join hackathon"** (two buttons on the overview; also on the updates page). The account is **NOT joined**. [OBSERVED]
- The "My projects" link (`https://devpost.com/submit-to/31659-learn-ar-with-specs/manage/submissions`) was opened as a plain page view. It rendered the hackathon overview with **"Join hackathon"**, no submission list and no form. So the "Enter a Submission" form is **not visible before joining**; its field names could **not** be observed. Nothing was clicked, typed or created. [OBSERVED]
- Participants: 1203 shown. Project gallery link exists. Page timezone shows GMT+1. [OBSERVED]
- Devpost's browser-text extraction is blocked on `devpost.com` (not on `learn-specs.devpost.com`), so that page was read through the accessibility tree only. [OBSERVED]

## 2. Who must do what

### Owner only (login, MFA, eligibility, acceptance, publication)

| # | Step | Why owner-only |
|---|---|---|
| O1 | Click **Join hackathon** at <https://learn-specs.devpost.com/> | Accepts the Official Rules as a contract (rules: "submission of any entry constitutes agreement"); registration and consent to data use. AGENTS.md also forbids agents clicking it. |
| O2 | Confirm eligibility: of age of majority, not resident in an excluded country, not an employee/relative of Snap or Devpost, no Snap/Devpost financial or preferential support for the Project (rules section 3 and "Financial or Preferential Support") | Personal representation that only the owner can make. The account settings link `devpost.com/settings/preferences_and_eligibility` exists. [OBSERVED] |
| O3 | Decide Representative / team members (the Representative submits and warrants authority) | Legal warranty (rules, Team Representation). |
| O4 | Complete any Devpost login, MFA, captcha or cookie banner | Credentials/consent. |
| O5 | Create/own the public GitHub repository and publish (push) it | Outward-facing, needs approval per AGENTS.md; identity rules apply (personal repo, `MSKazemi`). |
| O6 | Upload the demo video to **YouTube as Public** | Publication under the owner's channel. Not Drive, not Vimeo (organizer update). |
| O7 | Press **Submit** (not just Save draft) before the deadline, then verify the project shows as submitted in the owner's Devpost portfolio | Final irreversible action; entrant warranties. |
| O8 | Approve or reject sending the licensing question in `docs/LICENSING-AND-RIGHTS.md` section 5 | Outward-facing message. |
| O9 | Real-world Windows 11 work: Lens Studio sign-in, Preview, record screen | Needs the native machine and the owner's Snap account. |

### Agent-assistable (no login, no publication)

- Draft the English text description, the video script/shot list, README, `NOTICE.md`, disclosure text. (Drafts only.)
- Prepare the repo contents, run local checks, verify `.gitignore`, scan for secrets and `.mcp.json` tokens before the owner pushes.
- Rehearse the pre-submit verification list in section 5 against the real URLs once they exist (read-only, signed-out fetches).
- On Windows (Builder agent): `plan-lens` interview, CLAD build, LEAF tests, Preview evidence, using the owner's session.

## 3. Submission requirements (RULES)

From the Official Rules section 4, the Resources FAQ and the 2026-11-06 organizer update:

| Requirement | Detail | Source |
|---|---|---|
| New SPECS Lens | Built during the Submission Period, planned with the Devpost Learn skill pack, built through CLAD + Lens Studio + Lens Studio MCP; must run in the Lens Studio Preview | Rules |
| Public code repo URL | GitHub, GitLab or Bitbucket; must contain the **Lens Studio project files**; the **`devpost/` folder** (design brief from `plan-lens`) is "welcome, not required" in the rules but the 2026-11-06 update says "We check for that folder" | Rules; update |
| Text description | Features and functionality; organizers want: what the Lens does, who it is for, what you learned, how the skill pack helped plan it | Rules; update |
| Demo video | Under 3 minutes (judges need not watch further); screen recording of the Lens **running in the Lens Studio Preview**; publicly visible on **YouTube**; link in the form; no third-party trademarks or copyrighted music; organizers: reach the demo within the first 10 seconds and include one uncut stretch | Rules; update |
| English | All materials in English (or with translation) | Rules |
| Free access for judges | Project available without restriction/charge until judging ends (Nov 17, 5 pm ET) | Rules |
| Disclosure | Disclose pre-existing code or work other than standard tools/templates | Rules; FAQ |
| Originality/IP | Original, solely owned, no third-party IP violations; open source allowed if licences complied with | Rules |
| Multiple submissions | Each must be unique and substantially different | Rules |

Judging (equal weight): Design, Technical Implementation (use of CLAD, Lens Studio, MCP), Innovation/Idea, Presentation. Stage One is pass/fail on requirements. Dates: judging Nov 10-17, winners about Nov 19. [RULES]

Dates note: the rules and the Updates page agree on Monday Nov 9, 5:00 PM ET. [RULES]

## 4. Submission form fields

**Observed live: none.** The form is behind "Join hackathon" and was not opened. [OBSERVED]

**Expected from the rules and standard Devpost behavior (not verified):**

- Project name; elevator pitch/tagline [EXPECTED]
- "About the project" story text, likely with Devpost's standard sections (inspiration, what it does, how we built it, challenges, accomplishments, what we learned, what's next) [EXPECTED]
- "Built with" tags [EXPECTED]
- "Try it out" links, here the **public repository URL** [RULES: required]
- Video demo link, **YouTube** [RULES: required]
- Image gallery / thumbnail [EXPECTED]
- Team members / Representative [RULES: Representative must submit]
- Possibly an eligibility or terms acknowledgment checkbox [EXPECTED]
- Save draft vs Submit: drafts can be saved until the end of the Submission Period; after that nothing can be changed [RULES section 5]

Once the owner has joined, an agent may open "Enter a Submission" **read-only** to record the true field list, then update this section. Do not create a draft or type into fields without the owner.

## 5. Pre-submit verification list

Run in order. Mark each with PASS / FAIL / NOT RUN and the observed evidence.

1. Account shows **joined** (the "Join hackathon" button is gone / "Enter a Submission" is available).
2. Repo URL opens **in a signed-out/private browser window** (no 404, no login wall).
3. Repo root contains the Lens Studio project (`*.esproj`, `Assets/`, `Packages/`, scene files) **and** `devpost/design-brief.md` produced by the real `plan-lens` interview. The `devpost/` folder is at the project root, as the organizers check for it.
4. Git LFS files (if used) download for a fresh clone.
5. No secrets: no `.env`, tokens, auth-bearing `.mcp.json`, account IDs, personal paths; `Cache/`, `Workspaces/`, `BackUp/`, `Support/` ignored.
6. `NOTICE.md` and README list Snap templates/packages, Devpost skill pack, LEAF, AI assistants, and any pre-existing code (see `docs/LICENSING-AND-RIGHTS.md`).
7. README and description state plainly: simulated transcription only ("Simulated transcription — not live speech."), no live microphone, no physical-glasses claim, Preview only. No claim that is not shown in the video.
8. Video: **under 3:00**, **Public** on YouTube, link opens signed out, shows the Lens running in the Lens Studio Preview within the first 10 seconds, at least one uncut stretch, no third-party trademarks or copyrighted music, no private data on screen.
9. Description: what it does, who it is for, what was learned, how the skill pack helped, English.
10. Real evidence exists for every claim: CLAD build log, Preview observation, LEAF results marked PASS/FAIL/NOT RUN honestly.
11. Submitted (not only drafted): confirm status in the owner's Devpost portfolio, and re-open the public submission page signed out.
12. Time check: submitted before 23:00 CET on 2026-11-09 (organizers suggest noon ET = 18:00 CET).

## 6. Things the pages asked, and refused

- No page text asked for any action. The rules' "click Join Hackathon" instruction is addressed to entrants; it was **not** followed (owner-only).
- The Updates page contains a "take the survey" link (to a Zoom URL). Not opened, not relevant.
