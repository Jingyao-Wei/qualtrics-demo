/* Paste this WHOLE file into the question's JavaScript editor.
   Use a NEW Matrix Table > Text Entry question: 6 rows, 3 columns.
   Keep row/column order fixed. See SETUP.md for instructions.
   This adapter targets the classic Qualtrics layout, not Simple layout.
*/
Qualtrics.SurveyEngine.addOnReady(function () {
    "use strict";

    // EDIT THESE SETTINGS. Bounds are demonstration values, not study decisions.
    var config = {
        title: "Consumption (log)",
        unit: "Log points relative to control",
        min: -0.10,
        max: 0.30,
        tick: 0.10,
        step: 0.01,
        decimals: 2,
        periods: ["1", "2", "3", "4", "5", "6"],
        rowIds: [1, 2, 3, 4, 5, 6],
        columnIds: [1, 2, 3],
        series: [
            { label: "S–C", name: "Stable minus Control", fill: "#f5d342", stroke: "#8c7410", shape: "circle" },
            { label: "P–C", name: "Predictable minus Control", fill: "#ba263c", stroke: "#871b2c", shape: "square" },
            { label: "R–C", name: "Risky minus Control", fill: "#418a60", stroke: "#235237", shape: "triangle" }
        ]
    };

    var question = this;
    var container = question.getQuestionContainer();
    var host = container.querySelector(".six-period-plot");
    if (!host) return;
    host.textContent = "";

    var count = config.periods.length * config.series.length;
    var cells = [];
    config.rowIds.forEach(function (row, r) {
        config.columnIds.forEach(function (column, s) {
            var id = "QR~" + question.questionId + "~" + row + "~" + column + "~TEXT";
            var input = document.getElementById(id);
            if (input && container.contains(input)) cells.push({ input: input, period: r, series: s });
        });
    });
    if (cells.length !== count) {
        host.textContent = "The graph could not find its answer fields. You can use the table below. Survey editor: check the layout and row/column IDs in SETUP.md.";
        return;
    }

    var ns = "http://www.w3.org/2000/svg";
    var width = 900, height = 450;
    var left = 78, right = 876, top = 48, bottom = 350;
    var plotHeight = bottom - top;
    var markers = [];
    var activeDrag = null;
    var disposers = [];

    function listen(target, event, handler) {
        target.addEventListener(event, handler);
        disposers.push(function () { target.removeEventListener(event, handler); });
    }
    function element(tag, attributes, text, parent) {
        var node = document.createElementNS(ns, tag);
        Object.keys(attributes || {}).forEach(function (key) { node.setAttribute(key, attributes[key]); });
        if (text !== undefined) node.textContent = text;
        (parent || svg).appendChild(node);
        return node;
    }
    function y(value) {
        // Unequal bounds, ONE linear scale: equal changes occupy equal distances.
        return bottom - (value - config.min) / (config.max - config.min) * plotHeight;
    }
    function format(value) {
        return (Math.abs(value) < config.step / 2 ? 0 : value).toFixed(config.decimals);
    }
    function read(input) {
        var raw = input.value.trim();
        if (raw === "") return { value: null, error: "" };
        // Accept a decimal comma too; normalize it before submission.
        if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw)) {
            return { value: null, error: "Enter a number." };
        }
        var value = Number(raw.replace(",", "."));
        if (!Number.isFinite(value) || value < config.min || value > config.max) {
            return { value: null, error: "Use a value from " + format(config.min) + " to " + format(config.max) + "." };
        }
        var steps = (value - config.min) / config.step;
        if (Math.abs(steps - Math.round(steps)) > 0.000001) {
            return { value: null, error: "Use increments of " + format(config.step) + "." };
        }
        return { value: value, error: "" };
    }
    function shape(series, parent, x, yy, fill) {
        var attrs = { fill: fill, stroke: series.stroke, "stroke-width": 2 };
        if (series.shape === "circle") {
            return element("circle", Object.assign(attrs, { cx: x, cy: yy, r: 7 }), undefined, parent);
        }
        if (series.shape === "square") {
            return element("rect", Object.assign(attrs, { x: x - 7, y: yy - 7, width: 14, height: 14 }), undefined, parent);
        }
        return element("polygon", Object.assign(attrs, { points: x + "," + (yy - 9) + " " + (x - 9) + "," + (yy + 7) + " " + (x + 9) + "," + (yy + 7) }), undefined, parent);
    }

    var style = document.createElement("style");
    style.textContent = ".six-period-plot{font-family:Arial,sans-serif;color:#243746}.six-period-plot .sp-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}.six-period-plot svg{display:block;width:100%;min-width:760px;height:auto}.six-period-plot .sp-handle{cursor:ns-resize;touch-action:none;outline:none}.six-period-plot .sp-handle:focus .sp-hit{stroke:#2563eb;stroke-width:2;fill:#2563eb;fill-opacity:.08}.six-period-plot .sp-help{font-size:14px;line-height:1.5;margin:8px 0}.six-period-plot .sp-status{font-size:14px;font-weight:600;margin:8px 0}.six-period-plot .sp-error{color:#a1122a}.six-period-plot .sp-legend{display:flex;gap:10px 22px;flex-wrap:wrap;justify-content:center;font-size:14px}.six-period-plot .sp-key{display:inline-flex;align-items:center;gap:7px}.six-period-plot .sp-key svg{width:24px;height:24px;min-width:24px}";
    host.appendChild(style);
    var scroll = document.createElement("div");
    scroll.className = "sp-scroll";
    scroll.tabIndex = 0;
    scroll.setAttribute("aria-label", "Six-period prediction graph; scroll horizontally on smaller screens.");
    host.appendChild(scroll);
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", config.title + ": enter predictions for six individual periods.");
    scroll.appendChild(svg);

    element("text", { x: width / 2, y: 25, "text-anchor": "middle", "font-size": 21, "font-weight": 600 }, config.title);
    for (var t = 0; config.min + t * config.tick <= config.max + 0.000001; t++) {
        var value = Number((config.min + t * config.tick).toFixed(8));
        element("line", { x1: left, x2: right, y1: y(value), y2: y(value), stroke: Math.abs(value) < 0.000001 ? "#76828b" : "#e4e7eb", "stroke-width": Math.abs(value) < 0.000001 ? 1.5 : 1 });
        element("text", { x: left - 13, y: y(value) + 5, "text-anchor": "end", "font-size": 15, fill: "#435366" }, format(value));
    }
    element("text", { x: width / 2, y: 411, "text-anchor": "middle", "font-size": 17 }, "Time period (each period is two weeks)");
    element("text", { x: width / 2, y: 437, "text-anchor": "middle", "font-size": 14, fill: "#536273" }, config.unit);
    config.periods.forEach(function (period, r) {
        var x = left + (r + 0.5) * (right - left) / config.periods.length;
        element("line", { x1: x, x2: x, y1: top, y2: bottom, stroke: "#eff1f4" });
        element("text", { x: x, y: bottom + 27, "text-anchor": "middle", "font-size": 16 }, period);
    });

    var legend = document.createElement("div");
    legend.className = "sp-legend";
    config.series.forEach(function (series) {
        var key = document.createElement("span");
        key.className = "sp-key";
        var icon = document.createElementNS(ns, "svg");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-hidden", "true");
        shape(series, icon, 12, 12, series.fill);
        key.appendChild(icon);
        key.appendChild(document.createTextNode(series.label + "  " + series.name));
        legend.appendChild(key);
    });
    host.appendChild(legend);
    var help = document.createElement("p");
    help.className = "sp-help";
    help.textContent = "Drag each marker vertically or type a value in the table. Hollow markers have not been answered. Click a marker at zero to explicitly predict zero. Keyboard: use arrow keys to change a marker, Enter to confirm zero, or Delete to clear it. On small screens, scroll the graph sideways.";
    host.appendChild(help);
    var status = document.createElement("p");
    status.className = "sp-status";
    status.setAttribute("aria-live", "polite");
    host.appendChild(status);

    function update() {
        var answered = 0, firstError = "";
        cells.forEach(function (cell, i) {
            var answer = read(cell.input);
            var valid = answer.value !== null;
            if (valid) answered++;
            if (answer.error && !firstError) firstError = "Period " + config.periods[cell.period] + ", " + config.series[cell.series].label + ": " + answer.error;
            cell.input.setAttribute("aria-invalid", answer.error ? "true" : "false");
            cell.input.setCustomValidity(answer.error);
            var marker = markers[i];
            marker.group.setAttribute("transform", "translate(" + marker.x + "," + y(valid ? answer.value : 0) + ")");
            marker.symbol.setAttribute("fill", valid ? config.series[cell.series].fill : "white");
            marker.symbol.setAttribute("stroke-dasharray", valid ? "none" : "3 2");
            marker.group.setAttribute("aria-valuenow", valid ? answer.value : 0);
            marker.group.setAttribute("aria-valuetext", valid ? format(answer.value) : "Not answered; starting position zero");
            marker.tooltip.textContent = marker.label + ": " + (valid ? format(answer.value) : "not answered");
        });
        status.className = "sp-status" + (firstError ? " sp-error" : "");
        status.textContent = firstError || (answered + " of " + count + " predictions entered. " + (answered === count ? "You can continue." : "Enter every prediction before continuing."));
        // Put this question alone on its page; it controls that page's Next button.
        if (answered === count && !firstError) question.enableNextButton();
        else question.disableNextButton();
    }
    function setAnswer(i, value) {
        var input = cells[i].input;
        if (value === null) input.value = "";
        else {
            var rounded = config.min + Math.round((value - config.min) / config.step) * config.step;
            input.value = format(Math.min(config.max, Math.max(config.min, rounded)));
        }
        // Notify Qualtrics as well as the graph when a marker changes an answer.
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function dragValue(event) {
        var point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        var local = point.matrixTransform(svg.getScreenCTM().inverse());
        return config.min + (bottom - local.y) / plotHeight * (config.max - config.min);
    }

    cells.forEach(function (cell, i) {
        var series = config.series[cell.series];
        var x = left + (cell.period + 0.5) * (right - left) / config.periods.length + (cell.series - (config.series.length - 1) / 2) * 31;
        var label = "Period " + config.periods[cell.period] + ", " + series.name;
        var group = element("g", { "class": "sp-handle", tabindex: 0, role: "slider", "aria-label": label, "aria-orientation": "vertical", "aria-valuemin": config.min, "aria-valuemax": config.max });
        var tooltip = element("title", {}, label, group);
        element("rect", { x: -15, y: -20, width: 30, height: 40, rx: 5, fill: "transparent", "class": "sp-hit" }, undefined, group);
        var symbol = shape(series, group, 0, 0, "white");
        markers.push({ group: group, symbol: symbol, tooltip: tooltip, x: x, label: label });
        cell.input.setAttribute("aria-label", label + "; " + config.unit);
        cell.input.setAttribute("inputmode", "decimal");
        listen(cell.input, "input", update);
        listen(cell.input, "change", update);
        listen(cell.input, "blur", function () {
            var answer = read(cell.input);
            if (answer.value !== null) setAnswer(i, answer.value);
        });
        listen(group, "pointerdown", function (event) {
            if (event.button !== 0) return;
            event.preventDefault();
            group.focus();
            group.setPointerCapture(event.pointerId);
            var answer = read(cell.input);
            // A click confirms the current value, without jumping to the edge of the hitbox.
            activeDrag = { i: i, id: event.pointerId, start: dragValue(event), value: answer.value === null ? 0 : answer.value };
            setAnswer(i, activeDrag.value);
        });
        listen(group, "pointermove", function (event) {
            if (activeDrag && activeDrag.i === i && activeDrag.id === event.pointerId) {
                setAnswer(i, activeDrag.value + dragValue(event) - activeDrag.start);
            }
        });
        function stopDrag(event) {
            if (activeDrag && activeDrag.id === event.pointerId) activeDrag = null;
        }
        listen(group, "pointerup", stopDrag);
        listen(group, "pointercancel", stopDrag);
        listen(group, "lostpointercapture", stopDrag);
        listen(group, "keydown", function (event) {
            var answer = read(cell.input);
            var value = answer.value === null ? 0 : answer.value;
            var step = config.step * (event.shiftKey ? 10 : 1);
            if (event.key === "ArrowUp" || event.key === "ArrowRight") value += step;
            else if (event.key === "ArrowDown" || event.key === "ArrowLeft") value -= step;
            else if (event.key === "Home") value = config.min;
            else if (event.key === "End") value = config.max;
            else if (event.key === "Delete" || event.key === "Backspace") value = null;
            else if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            setAnswer(i, value);
        });
    });
    update();
    Qualtrics.SurveyEngine.addOnUnload(function () {
        disposers.forEach(function (dispose) { dispose(); });
        activeDrag = null;
    });
});
