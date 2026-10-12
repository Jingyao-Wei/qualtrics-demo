# Six-period Qualtrics prediction question

This working prototype lets respondents drag the three shaped markers for each of six periods, or type their predictions in the answer table. It uses the existing Qualtrics answer fields, giving 18 exported answers per outcome. There are no confidence intervals, p-values, or equivalence tests.

Open `preview.html` in a browser to try it. The preview is an offline demonstration; its answers are not submitted to Qualtrics.

## Add it to Qualtrics

1. Work in a copy of your survey. Use a classic layout such as **Flat** under **Look & Feel → Layout**. This code targets the classic matrix fields and has not been adapted to the newer **Simple / New Survey Taking Experience** layout.
2. Create a **new Matrix Table** question, select **Text Entry**, and choose short text boxes. Do not use Constant Sum: the predictions do not have to add up to anything.
3. Create six statements, in order: **Period 1, Period 2, Period 3, Period 4, Period 5, Period 6**. Create three scale points, in order: **S–C, P–C, R–C**. These mean Stable minus Control, Predictable minus Control, and Risky minus Control.
4. In the question text's **Rich Content Editor → HTML/source view**, paste the contents of `question-text.html`.
5. Select **Question behavior → JavaScript**. Replace the default example callbacks with the **entire** contents of `question.js`, which already includes its callback. Do not wrap it in another callback or paste it into the HTML editor.
6. Set **Force Response** on. Keep statement and column randomization off, use no prefilled answers, and give the question its own page with page breaks before and after it. Set an export tag such as `cons_prediction`.
7. Open **Survey Preview**. Ordinary editing view may not execute the code. Drag a marker and confirm that its matching table cell changes. Type a value and confirm that its marker moves.
8. Make the mental-health question first by duplicating this question and moving it before consumption. Update the settings and question text as described below. Give it a different export tag such as `mh_prediction`.
9. Complete a test response in the actual Qualtrics survey and export its data before collecting responses. Confirm the 18 answers match what you entered, including negative numbers and explicit zeros. Local preview testing cannot verify your account's response storage.

No survey-header scripts, external libraries, or Embedded Data fields are required. JavaScript access must be enabled for your Qualtrics account.

## Edit the scale

The settings at the top of `question.js` control the graph:

```javascript
title: "Consumption (log)",
unit: "Log points relative to control",
min: -0.10,
max: 0.30,
tick: 0.10,
step: 0.01,
decimals: 2,
```

These are **example limits**, not limits chosen by the study team. This is an asymmetric range with a single linear scale: zero is one quarter of the way up the plot, and a 0.10 change always occupies the same distance. It does not stretch the negative and positive halves differently. Keep a range containing zero, a positive tick/step, and limits aligned with the step. Values outside the range are rejected rather than silently clipped; dragging stops at the limits.

For a mental-health demonstration you could use:

```javascript
title: "Mental health (s.d.)",
unit: "Standard deviations relative to control",
min: -0.50,
max: 1.00,
tick: 0.25,
step: 0.01,
decimals: 2,
```

Replace the consumption example in the question text with: “Enter the treatment–control difference in standard deviation units. For example, 0.20 means the mental-health index is 0.20 standard deviations higher in that treatment arm than in Control.” Add whether higher scores represent better or worse mental health after checking your index definition. Standard deviations are not percentage changes.

For consumption, the graph uses a linear axis measured in **log points**, not a logarithmic axis. If the dependent variable is the natural logarithm, 0.10 log points corresponds to `100 * (exp(0.10) - 1) ≈ 10.5%`.

## Response behavior and exports

- All 18 markers start at zero but remain hollow and unanswered. Clicking a marker confirms its current value; typing zero or pressing Enter on an unanswered marker explicitly records zero. Blank responses are not converted to zero.
- Editing one prediction preserves the others. Native answer fields supply previously saved values when Qualtrics restores a page; the graph reads them on load. The survey's own Back button setting still applies.
- Arrow keys change a focused marker by 0.01. Shift + arrow changes it by 0.10. Home/End choose the limits; Delete clears it. Numeric entry also accepts a decimal comma and normalizes it to a decimal point on blur.
- Every prediction must be valid before the Next button is enabled. Force Response is still required in Qualtrics as a fallback if JavaScript is unavailable. This is client-side validation; use numeric/range validation in Qualtrics too if your survey requires enforcement without JavaScript.
- The native matrix stays visible. Its export contains one column per cell, generally `[question]_[row]_[column]`. With a newly created question, row 1 is Period 1 and columns 1–3 are S–C, P–C, R–C. Verify the names in your own export.
- On narrow screens the graph scrolls sideways so marker controls and axis labels remain legible. The numeric table supplies an alternative to dragging.

If the graph reports missing fields, first check the layout and six-by-three question structure. If rows/columns have been deleted and recreated, their internal IDs may no longer be 1–6 and 1–3. Update `rowIds` and `columnIds` at the top of the code to match the question, or create a fresh question. Do not infer IDs from randomized screen order.

## What came from the Word document

I reviewed `Revising the SSPP Outcomes 7.17.26.docx` and its comments, alongside the older `Income_Instability.qsf`, from the project's Social Sciences Prediction Platform folder. The original files are unchanged.

The Word file proposes draggable coefficients, shape-plus-colour distinctions, zero starting positions, mental health before consumption, and numeric entry as a possible alternative. This prototype implements those interaction ideas for the S–C / P–C / R–C comparison.

The Word file mostly specifies pooled windows 1–2, 1–4, and 1–6. This prototype instead uses **six individual periods**, following your current request. These are different estimands: the individual-period answers are not automatically the coefficients from pooled regressions. If you intended six cumulative windows, change both the labels and the question wording before use.

The Word file leaves scale limits blank and mixes percentage-change language with standard-deviation and log outcomes. The prototype keeps those units distinct. It does not implement the other proposed mechanism comparisons, ranking screens, results disclosure, or a separate revision round that preserves first and second answers. Those are broader survey changes, and several are tentative in the Word file. Ordinary edits in this question retain only the latest answer in each native field.

## References and checks

- [Original vertical-slider discussion](https://community.qualtrics.com/custom-code-12/program-eq-5d-vas-scale-3204): useful background on custom sliders; its EQ-5D question is a different instrument.
- [Qualtrics JavaScript instructions](https://www.qualtrics.com/support/survey-platform/survey-module/question-options/add-javascript/): editor location, Preview, lifecycle callbacks, and layout differences.
- [Qualtrics Matrix Table documentation](https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/matrix-table/): native text-entry matrices and exports.

The standalone preview uses a simulated Qualtrics page. It can check interaction, validation, and marker-to-field mapping, but cannot establish compatibility with your live theme or prove that Qualtrics saved a response. Treat this as a tested local prototype pending a real survey preview and export check.
