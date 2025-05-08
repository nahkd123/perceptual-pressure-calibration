import { applyCurve, consumeInput, finishConsumeInput, updateDisplay } from "./calibrate.js";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas#draw-canvas");
const resizeObserver = new ResizeObserver(() => {
    setupCanvas();
});
resizeObserver.observe(canvas);
canvas.addEventListener("pointerdown", e => {
    onInput(e);

    const pointerMove = e => {
        e.getCoalescedEvents().forEach(onInput);
    };

    const pointerUp = e => {
        onInput(e);
        document.removeEventListener("pointermove", pointerMove);
        document.removeEventListener("pointerup", pointerUp);
    };

    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerup", pointerUp);
});

/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext("2d");
/** @type {PenInput | undefined} */ let lastInput;

function setupCanvas() {
    const scale = devicePixelRatio;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    ctx.resetTransform();
    ctx.scale(scale, scale);
}

let calibrateMode = false;
export function setCalibrateMode(enable) { calibrateMode = enable; }

/**
 * @param {PointerEvent} e Pointer event.
 */
function onInput(e) {
    e.preventDefault();
    updateDisplay(e.pressure);
    const canvasRect = canvas.getBoundingClientRect();
    /** @type {PenInput} */ const currentInput = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
        pressure: applyCurve(e.pressure)
    };

    const size = 30;
    ctx.fillStyle = "black";
    ctx.globalCompositeOperation = e.buttons & 32 ? "destination-out" : "source-over";

    if (!lastInput) {
        const radiEnd = currentInput.pressure * size;
        ctx.beginPath();
        ctx.moveTo(currentInput.x, currentInput.y);
        ctx.ellipse(currentInput.x, currentInput.y, radiEnd, radiEnd, 0, 0, Math.PI * 2);
        ctx.fill();
    } else {
        const spacing = 0.5;
        const length = Math.sqrt((currentInput.x - lastInput.x) ** 2 + (currentInput.y - lastInput.y) ** 2);

        for (let d = 0; d <= length; d += spacing) {
            const p = d / length;
            const pressure = lastInput.pressure * (1 - p) + currentInput.pressure * p;
            const radi = pressure * size;
            const x = lastInput.x * (1 - p) + currentInput.x * p;
            const y = lastInput.y * (1 - p) + currentInput.y * p;
            ctx.beginPath();
            ctx.moveTo(currentInput.x, currentInput.y);
            ctx.ellipse(x, y, radi, radi, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    if (e.type == "pointerup") {
        if (calibrateMode) finishConsumeInput();
        lastInput = undefined;
    } else {
        if (calibrateMode) {
            const distance = lastInput ? Math.sqrt((currentInput.x - lastInput.x) ** 2 + (currentInput.y - lastInput.y) ** 2) : 0;
            consumeInput(e.pressure, distance);
        }

        lastInput = currentInput;
    }
}

export function eraseDrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}