import { getCurve, resetCurve } from "./calibrate.js";
import { eraseDrawCanvas, setCalibrateMode } from "./draw.js";

setCalibrateMode(false);
/** @type {HTMLButtonElement} */ const testBtn = document.querySelector("button#test");
/** @type {HTMLButtonElement} */ const calibrateBtn = document.querySelector("button#calibrate");

testBtn.addEventListener("click", () => {
    testBtn.disabled = true;
    calibrateBtn.disabled = false;
    setCalibrateMode(false);
});

calibrateBtn.addEventListener("click", () => {
    calibrateBtn.disabled = true;
    testBtn.disabled = false;
    setCalibrateMode(true)
});

document.querySelector("button#erase").addEventListener("click", () => eraseDrawCanvas());
document.querySelector("button#reset").addEventListener("click", () => resetCurve());
document.querySelector("button#export").addEventListener("click", () => {
    const curve = getCurve();
    const rows = curve.map(([input, output]) => `${input},${output}`);
    const csv = `Input,Output\n${rows.join("\n")}`;
    const blob = new Blob([csv]);
    const elem = document.createElement("a");
    elem.download = `Pressure Calibration Profile - ${new Date()}.csv`;
    elem.href = URL.createObjectURL(blob);
    elem.click();
    URL.revokeObjectURL(elem.href);
});