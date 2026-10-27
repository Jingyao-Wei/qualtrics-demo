# Prediction demo — 26 October 2026

Version `2026-10-26-v9` adds desktop and phone layouts to the October 19 PI discussion version. Open `index.html` in a browser, or upload it as the default `index.html` in the existing GitHub Pages repository. It is a single file containing the interface, styles, and JavaScript; no build or external library is needed.

The October 25 v8 release is preserved in `output/qualtrics_revised_2026_10_25`, and October 16 v7 in `output/qualtrics_revised_2026_10_16`. This update has not been published to GitHub. Upload the new `index.html` to the existing repository to keep the same demo URL, https://jingyao-wei.github.io/qualtrics-demo/. GitHub's commit history retains the old default. Version 9 uses a separate browser-session key, so existing v8 demo responses are not overwritten.

## Desktop and phone layout

- The desktop graph shows every comparison together. When the graph area is narrower than 560 pixels, a labelled selector shows one comparison at a time with 44-pixel marker targets. All periods remain in horizontal order, and all estimates remain in the table.
- Focusing an answer field selects its comparison in the phone graph. Choosing a comparison or resizing the window does not change any answers.
- Phone answer fields include a ± button for entering negative values with decimal keyboards. Blank answers remain distinct from zero.
- Study-arm information and completed-answer summaries stack into labelled blocks on phones. Mechanism ratings, navigation, downloads, and the FAQ fit narrow screens.
- Questions, units, validation, answer locking, and separate revision records are unchanged. Existing Word/Google Docs screenshots are still the v8 review copy; they have not been replaced with this layout.

## Current sequence

1. Study context and four arms, followed by a brief implementation summary.
2. Timing, data collection, and the cumulative 1–2, 1–4, and 1–6 reference windows.
3. Required practice with fictional examples.
4. Mental-health differences: three treatment arms versus Control, across three windows; −0.50 to +0.50 SD.
5. Consumption differences: the same comparisons and windows, in GHC per household per two-week period.
6. Proposed consumption-smoothing question: high-work minus low-work consumption within Predictable and Risky, across all six periods.
7. Mechanism importance ratings, including Unsure and an optional additional reason.
8. Explanations of two or three selected reasons.
9. Additional information (explicitly pending).
10. Choice to revise numerical predictions, followed by three revision pages if Yes.
11. Optional age, country of residence, discipline, and professional title; then the answer summary and downloads.

There are 20 numerical estimates per round. Mechanism questions are collected once before the information step. Back preserves drafts and displays submitted answers read-only. First and revised numerical responses remain separate. No answers are transmitted externally.

## Main changes

- Clear Mental health → Consumption → Reasons → About you section labels.
- Mental health uses SD throughout. The definition follows the primary PHQ-2/GAD-2 index in the current analysis: higher scores mean better health, standardized against Control at baseline.
- Consumption uses levels. The initial currency graph is −100 to +100 GHC; this is a provisional display, not a response limit. Typing larger amounts expands it. Positive values mean higher consumption; negative values mean lower consumption.
- A consumption benchmark and USD reference sit beside consumption and in the FAQ. Missing values are labelled as pending.
- The introduction covers home-based work, flexible hours, arms and advance knowledge before surveying and timing. The first-stage summary describes similar average income and greater variation in Predictable and Risky without invented percentages.
- Mechanism ratings precede explanations. The draft asks for 20 words per selected reason to discourage very short answers; this threshold is editable.
- Earlier consumption-unit alternatives and matched-calendar/early-versus-late proposals remain disabled in `PANELS`, and are omitted from the flow and downloads.

## Inputs and decisions still needed

- Supply the approved consumption benchmark and study earnings on the same household/time basis; verify the denominator and consumption recall period.
- Supply the study-period USD-per-GHC factor, date, and source. No current exchange rate has been substituted.
- Verify the qualitative first-stage summary and supply numerical results for means, variability, and crowd-out if desired.
- Confirm the primary mental-health measure from the analysis code is the intended survey outcome.
- Confirm total consumption versus food expenditure for the high–low question, its estimator, and the initial currency-axis display. The current question estimates a spending gap, not a consumption-to-income ratio or an arm ranking. An explicit ranking is still a proposal.
- Review the mechanism list, wording, and explanation minimum. These are Version 1 proposals, not finalized meeting language.
- Supply the information to reveal before revisions. The suggested “We found X; how convinced are you?” question is not included because X and the disclosure have not been agreed.

## Editing and files

Canonical source: `code/exploratory/qualtrics_revised_2026_10_12/index.html`.
Local preview: `code/exploratory/qualtrics_six_periods/revised.html`.
Dated release: `output/qualtrics_revised_2026_10_26/index.html`.

Edit `PANELS` for questions, units, comparisons, and proposal labels; `MECHANISMS` and `RATINGS` for the importance matrix; and `renderInfo` for introduction wording. `SETTINGS.benchmark` holds `householdConsumption`, `studyIncome`, `source`, `usdPerGhc`, `exchangeRateDate`, and `exchangeRateSource`. `SETTINGS.additionalInformation` holds the approved disclosure. Update the version identifier after material changes and synchronize the three HTML copies.

The source is a standalone review demo. It is not a Qualtrics QSF import or a ready-made Qualtrics question script. Existing Word/PDF exports have not been refreshed for v9.

## Checks

Run with the bundled environment:

```powershell
$env:UV_CACHE_DIR = Join-Path (Get-Location) 'output/.uv-cache'
$env:UV_PYTHON = 'C:/Users/jingy/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
uv run --no-project node 'code/exploratory/qualtrics_revised_2026_10_12/test_meeting_demo.cjs'
```

Checks cover SD bounds, explicit zero versus missing, decimal currency entry and axis expansion, all 20 estimates, separate original/revised exports, mechanism and demographic records, spreadsheet-safe CSV text, and demographics routing with either revision choice.

The browser walkthrough also checked the tutorial, invalid SD entry, currency expansion, draft preservation on Back, read-only first answers, mechanism ratings and Other validation, the three-reason selection limit, separate revisions, optional demographics and invalid age, and the actual JSON download. It contained 20 estimates and preserved −0.50 as the first response after revising it to 0.15. No browser errors were logged. Captured screens use fictional test answers.

The v9 browser walkthrough checked 320, 390, 768, and 1440-pixel viewport widths. The prediction page had no document-wide horizontal overflow, showed three mobile markers versus nine desktop markers, and retained the same answers across resizing. Pointer dragging, the required tutorial, automatic comparison selection, ± sign changes, currency expansion to ±4000, locked answers on Back, all 20 summary estimates, the No-revision route with blank demographics, and the phone FAQ were checked. No browser errors were logged. These checks use desktop Chromium at phone-sized viewports; physical iOS/Android keyboard and touch behavior still needs device testing. Screenshots are in `output/qualtrics_review_v9_screenshots`.
