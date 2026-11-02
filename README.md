# SSPP prediction demo — 2 November 2026

Version `2026-11-02-v10.2` applies the actionable comments and tracked wording suggestions in the Google Doc `vip-SSPP`, tab **version Oct 26, 2026**, reviewed on November 2. The Google Doc and its comment threads have not been edited or resolved.

Open `index.html` locally, or upload it as the default `index.html` in the existing GitHub Pages repository. This is one standalone file containing the interface, styles, and JavaScript. There is no build step or external library. This update has not been published to GitHub; the public URL will update after upload and deployment.

The October 26 v9 release and October 25 v8 release are preserved unchanged in their dated output folders. Version 10.2 uses its own browser-session key and does not overwrite saved v9 responses. Existing Word, PDF, and Google Docs review copies still show v8 or earlier screenshots.

## Practice layout restored in v10.2

At the user's clarification, practice retains the original three-example graph, three period columns, and nine answer boxes. All three tasks appear together on the same page. Only A in 1–2 (move its marker), B in 1–4 (type 0.25), and C in 1–6 (confirm zero on its marker) are required. The other six boxes may remain blank. A prominent note states this, and completion checks only those three tasks. The prior v10 and v10.1 releases remain unchanged in their dated output folders.

Browser verification confirmed nine desktop markers, nine boxes, six blank boxes, and an enabled Continue button after the three tasks. The existing phone comparison selector and all nine table entries are preserved.

## Changes from the October 26 comments

- Simplified the introduction, removed repeated title wording and the two-hours-per-bag detail, separated Who/When/Work/Pay/Assignment, and adopted the proposed arm descriptions and expected-total-work wording.
- Used past tense for questions about the completed trial, in the first and revision rounds.
- Retained the original nine-marker tutorial at the user’s clarification. Instructions appear before the controls and specify just three tasks; the remaining six answers can stay blank. A completion message tells respondents when to continue.
- Moved practice before the timing/reference-window page. Completing practice still requires reading that page before the first prediction.
- Shortened the cumulative-window explanation and separated the phone-survey cadence from the baseline/endline interviews. Precise endline timing remains pending.
- Adopted the suggested mental-health definition wording. Mental health still uses −0.50 to +0.50 SD.
- Removed the routine decimal-precision sentence. Entries with more than two decimal places now receive an inline error, including trailing third decimals such as `0.100`.
- Focused mechanism ratings on mental health. Adopted Leandro's consumption-level and consumption-volatility wording. Included the proposed “mental engagement” wording while retaining the Version 2 proposal label.
- Replaced the selection of two or three reasons and separate minimum-length explanations with one large open question. It comes at the end of the first prediction/reasons block, before any additional information. It requires a nonblank answer but has no word minimum. The answer locks on submission and is included in the summary, JSON, and reasons CSV.
- Preserved phone layouts, keyboard and pointer input, Back navigation, read-only saved responses, and separate first/revised numerical predictions.

## Current sequence

1. Study introduction and arms.
2. Three practice tasks on the original nine-marker graph and table.
3. Timing and cumulative windows 1–2, 1–4, and 1–6.
4. Mental health versus Control: three arms × three windows.
5. Consumption versus Control in GHC: three arms × three windows.
6. Proposed high-minus-low consumption comparison within Predictable and Risky, over all six periods.
7. Mental-health mechanism importance ratings.
8. One open explanation of the mental-health predictions.
9. Additional information, still a review placeholder.
10. Revision choice, followed by three numerical revision pages if Yes.
11. Optional demographics, then summary and downloads.

There are 20 numerical estimates per round. Nothing is transmitted externally.

## Decisions still needed from the PIs

- Whether the high–low question should also cover windows 1–2 and 1–4, and whether to add a mental-health version. These comments are questions, not settled instructions. Shorter windows can lack both work levels for some participants, so sample and weighting choices matter. The existing six-period consumption proposal remains in place with an explicit review note.
- Exact endline timing relative to Period 6 and which surveys enter each reference window.
- Final mechanism list, especially the proposed “mental engagement” wording. The one-box question is drafted for review; its location preserves explanations before any new evidence is shown.
- Approved consumption benchmark, denominator/recall period, study earnings on the same basis, and historical USD conversion with date/source.
- Confirmation of the mental-health outcome and qualitative income/crowd-out summary; any numerical first-stage results to show.
- The actual information to reveal before revisions, and total consumption versus food expenditure/sample/period adjustments for the high–low question.

The October 26 transcript was not present in the local Meetings folder. This update uses the comments and tracked suggestions in the specified Google Doc, including the comments recording Heather's mental-health-only and single-open-question requests.

## Editing and verification

Canonical source: `code/exploratory/qualtrics_revised_2026_10_12/index.html`.
Preview mirror: `code/exploratory/qualtrics_six_periods/revised.html`.
Release: `output/qualtrics_revised_2026_11_02_v10_2/index.html`.

Edit `PANELS` for question wording/comparisons, `MECHANISMS` for reason labels, `SETTINGS.benchmark` for approved money references, and `SETTINGS.additionalInformation` for the disclosure. This is a review demo, not a Qualtrics QSF import.

Regression command:

```powershell
$env:UV_CACHE_DIR = Join-Path (Get-Location) 'output/.uv-cache'
$env:UV_PYTHON = 'C:/Users/jingy/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
uv run --no-project node 'code/exploratory/qualtrics_revised_2026_10_12/test_meeting_demo.cjs'
```

Passed checks: tutorial step requirements, decimal validation, SD bounds, currency expansion, all 20 estimates, separate revisions, nonblank open explanation and overwrite protection, JSON/CSV records, spreadsheet-safe text, and both final routes.

The browser walkthrough completed all practice steps and the full revision route, checked Back/read-only behavior and explanation draft retention, and downloaded JSON with first 0.10 and revised −0.10 preserved separately. The explanation and mental-health scope were present in the downloaded record. No browser errors were logged. Phone-sized 320px and 390px layouts had no page-wide horizontal overflow. Physical phone hardware was not tested. Screenshots use fictional test entries where populated.
