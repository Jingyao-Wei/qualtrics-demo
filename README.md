

# Revised slider demo — 12 October 2026

link for the demo: https://jingyao-wei.github.io/qualtrics-demo/


Open `index.html` in a browser. It is self-contained, works offline, and can replace the `index.html` in your existing GitHub Pages repository. No external libraries, build step, or other files are needed for the demo.

This version follows `Revising Sliders 10.12.26.docx` and the follow-up request to include all three consumption units on separate, easily removable pages. It is a standalone demonstration, not an installed Qualtrics survey. The earlier six-period Qualtrics question code is a separate, older version.

## Flow

1. Study introduction and draft consent information.
2. Study arms and six two-week periods.
3. Compliance information screen, with an explicit placeholder for actual implementation figures.
4. Assigned study income chart in GHC, using clearly labelled illustrative numbers.
5. Instructions on pooled windows, locking, and revisions.
6. `MH_slider_1`: Stable–Control and pooled Unstable–Control.
7. `MH_slider_2`: Stable–Control, Predictable–Control, Risky–Control.
8. `MH_slider_3`: a proposed Predictable–Risky contrast within matched realized calendars.
9. `MH_slider_4`: that proposed contrast split by early- and late-income calendars.
10. `CON_slider_1_log`: consumption in log points.
11. `CON_slider_1_sd`: consumption in standard deviation units.
12. `CON_slider_1_proportion`: consumption in proportional changes.
13. Recorded yes/no decision about revising.
14. If yes, a second pass through the seven prediction pages with the first answers carried forward.
15. Read-only review and optional CSV/JSON downloads.

“Preview the sliders” skips the information screens for convenient testing. It does not submit research consent. A FAQ and a read-only first-answer view remain available throughout prediction and revision pages.

## Scale and period changes

All prediction graphs use **−1 to +1**, at increments of 0.01, and the **1–2, 1–4, 1–6 pooled reference windows** specified in the new document. These replace the old demo's asymmetric limits and six individual periods.

Each mental-health and consumption graph notes community, cohort, and period fixed effects. There are no confidence intervals, equivalence tests, or p-values. Markers use both shapes and colours. Respondents may drag markers, type numbers, or use a keyboard. Blank is distinct from zero.

The consumption pages have identical structure and scale limits, with different unit labels and explanations. The same numeric value has a different meaning on each page. The demo does not automatically convert answers between units; a standard-deviation conversion would require additional data.

## Remove a consumption version

Open `index.html` in a text editor. Find the `PANELS` array near the start of the script. Change `enabled:true` to `enabled:false` for an unwanted page:

- `CON_slider_1_log` — log points.
- `CON_slider_1_sd` — standard deviations.
- `CON_slider_1_proportion` — proportional changes.

The page then disappears from both rounds, progress counts, and exports. You do not need to edit the navigation. Changing the enabled set starts a fresh browser-tab demo record. The “Version A/B/C of 3” wording is written for the three-version comparison; update those tags and the explanatory introduction if you settle on just one version for a final survey.

## Editable assumptions

- **MH_slider_3:** The document requests matched Predictable–Risky calendars but leaves the exact coefficient undefined. The demo proposes P−R within an identical realized six-period work calendar. A positive value means a higher index for Predictable.
- **MH_slider_4:** The demo proposes the same P−R contrast separately for early- and late-income calendars. It restricts the example definition to calendars with three high-work and three low-work periods. Early means at least two high periods in Periods 1–3; late means at least two in Periods 4–6. This is an editable anticipation-related comparison, not a validated identification of optimism or dread. The exact matching rules and estimator still need specification.
- **Mental-health direction:** Higher index values are described literally. The supplied revision does not define whether higher is better or worse; add this before fielding.
- **Consumption comparisons:** The detailed slider instructions name S−C, P−C, and R−C, whereas the surrounding prose refers to pooled Unstable. The three consumption alternatives follow the detailed three-marker specification.
- **Compliance:** No empirical compliance statements were invented. The requested screen identifies what information is still needed.
- **Income:** GHC 10 per bag and the displayed calendars are illustrative, not actual study figures. The earlier Word description supplies the nine-bag Stable and three/fifteen-bag variable-work design. Replace `SETTINGS.income` with approved study inputs. The chart sums assigned income over each reference window; it does not elicit predictions or claim those incomes were earned.
- **Study introduction:** The draft information is retained in a collapsible introduction. This prototype does not collect consent or verify the source document's factual/IRB claims.
- **Results disclosure:** Actual study coefficients and mechanism-feedback text were not supplied, so no results are fabricated. The demo ends with the respondent's own predictions.

All proposed contrasts are defined in the `PANELS` array. Labels and descriptions there update the graphs, answer grids, review tables, and exports together.

## What is recorded

Answers are stored in this browser tab's session storage where the browser permits it. Closing the tab may remove the record; downloads provide a durable copy. Nothing is transmitted. This is a UI lock for a prototype, not protection against a person deliberately modifying browser code.

Clicking “Lock answers & continue” captures a separate numeric first-answer snapshot and timestamp. Those snapshots are not overwritten by the revision round. “First answers” is read-only. The yes/no revision choice and its timestamp are captured when the decision is submitted.

If revision is chosen, each page starts with the saved first answers. Editing one estimate leaves the others intact. Submitting the revision page records a second snapshot. If revision is declined, second answers stay null/blank and the final answer equals the first answer.

The CSV has one row per prediction: panel ID, document label, unit, proposed-contrast flag, reference window, comparison, first answer, revised answer, final answer, changed flag, revision choice, and timestamps. JSON also includes the panel definitions and scale. With all seven prediction pages enabled, there are 51 predictions per round.

To connect this design to Qualtrics, create the intended page sequence with separate storage for first and second responses and a branch on the revision choice. This standalone `index.html` is not a drop-in replacement for the old question JavaScript.
