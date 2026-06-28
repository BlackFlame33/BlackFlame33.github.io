import {TermColors} from "./constants.js";

const downloadElement = document.getElementById("download");

export function downloadFile(file, name) {
    downloadElement.setAttribute("href", file);
    downloadElement.setAttribute("download", name);
    downloadElement.click();
}

export function colorize(color, text) {
    return `${color}${text}${TermColors.Reset}`;
}

export function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function getSpacing(spacing, spacer = " ") {
    const ret = [];
    let i = spacing;

    while (i > 0) {
        ret.push(spacer);
        i -= 1;
    }
    return ret.join("");
}

/**
 * @param {KeyboardEvent.keyCode} keyCode
 */
export function isPrintableKeyCode(keyCode) {
    return (
        keyCode === 32 ||
        (keyCode >= 48 && keyCode <= 90) ||
        (keyCode >= 96 && keyCode <= 111) ||
        (keyCode >= 186 && keyCode <= 222)
    );
}

/**
 * @param {string} input
 * @returns {string}
 */
export function handleBackspace(term, input) {
    if (input.length === 0) return input;

    const buffer = term.buffer.active;
    if (buffer.cursorX === 0 && buffer.cursorY > 0) {
        // Move up
        term.write("\x1b[A");
        // Move to the end
        term.write("\x1b[" + term.cols + "G");
        term.write(" ");
    } else {
        term.write("\b \b");
    }
    return input.substring(0, input.length - 1);
}