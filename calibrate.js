/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas#curve-canvas");
const resizeObserver = new ResizeObserver(() => {
    setupCanvas();
});
resizeObserver.observe(canvas);

/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext("2d");

function setupCanvas() {
    const scale = devicePixelRatio;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    ctx.resetTransform();
    ctx.scale(scale, scale);
    renderCurve();
}

/** @type {[number, number][]} */ let curve = [[0, 0], [1, 1]];
/** @type {number} */ let currentPressure = 0;
/** @type {[number, number][]} */ let tape = []; // Recording tape

function renderCurve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.offsetHeight);
    for (const [x, y] of curve) ctx.lineTo(x * canvas.offsetWidth, (1 - y) * canvas.offsetHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(currentPressure * canvas.offsetWidth, 0);
    ctx.lineTo(currentPressure * canvas.offsetWidth, canvas.offsetHeight);
    ctx.stroke();

    const outputPressure = applyCurve(currentPressure);
    ctx.beginPath();
    ctx.moveTo(0, (1 - outputPressure) * canvas.offsetHeight);
    ctx.lineTo(canvas.offsetWidth, (1 - outputPressure) * canvas.offsetHeight);
    ctx.stroke();
}

/**
 * @param {number} x Normalized input pressure coming from input device.
 * @returns {number} Normalized output pressure mapped from the curve.
 */
export function applyCurve(x) {
    // TODO: binary search
    for (let i = 0; i < curve.length - 1; i++) {
        const [pin, pout] = curve[i];
        const [nin, nout] = curve[i + 1];

        if (x >= pin && x <= nin) {
            const p = (x - pin) / (nin - pin);
            return (nout - pout) * p + pout;
        }
    }
}

export function resetCurve() {
    curve = [[0, 0], [1, 1]];
    renderCurve();
}

export function updateDisplay(newPressure) {
    currentPressure = newPressure;
    renderCurve();
}

/**
 * @param {number} pressure The normalized pen logical pressure.
 * @param {number} distance The distance from previous point to next point.
 */
export function consumeInput(pressure, distance) {
    const [prevPressure, prevDist] = tape.at(-1) ?? [0, 0];
    if (pressure > prevPressure) tape.push([pressure, prevDist + distance]);
}

export function finishConsumeInput() {
    if (tape.length <= 1) return;
    const maxDistance = tape[tape.length - 1][1];
    curve = [[0, 0], [1, 1]];
    for (const [pressure, distance] of tape) curve.push([pressure, distance / maxDistance]);
    tape = [];
    curve.sort((a, b) => a[0] - b[0]);
    renderCurve();
}

export function getCurve() {
    return structuredClone(curve);
}