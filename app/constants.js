// Octal codes are not allowed in strict mode.
// Hence, the hexadecimal escape sequence
// Dracula Theme Color Palette
//   \x1b[38;2;r;g;bm - foreground
//   \x1b[48;2;r;g;bm - background
export const TermColors = {
    Reset: "\x1B[38;2;235;235;235m",
    ForeReset: "\x1B[48;2;40;42;54m",
    // Cyan: "\x1B[38;2;139;233;253m",
    Green: "\x1B[38;2;80;250;123m",
    // Orange: "\x1B[38;2;255;184;108m",
    // Pink: "\x1B[38;2;255;121;198m",
    Purple: "\x1B[38;2;189;147;249m",
    ForePurple: "\x1B[48;2;189;147;249m",
    Red: "\x1B[38;2;255;85;85m",
    Yellow: "\x1B[38;2;241;250;140m",
    Icon: "\x1B[38;2;95;135;175m",
    ForeIcon: "\x1B[48;2;95;135;175m",
    Black: "\x1B[38;2;0m",
};
export const SHELL_HISTORY =
    TermColors.Green + "❯ " + TermColors.Reset;

export function getSHELL_PROMPT() {
    return TermColors.Reset + "╭─" +
        TermColors.ForeIcon + "  " +
        TermColors.ForePurple + TermColors.Icon + "" + TermColors.Black + "  ~ " +
        TermColors.ForeReset + TermColors.Purple + "" + TermColors.Yellow + getTime() +
        TermColors.Reset + "\r\n" + "╰─" + TermColors.Green + "❯ " +
        TermColors.Reset;
}

function getTime() {
    const time = new Date();
    const H = time.getHours() + ':';
    const M = time.getMinutes() + ':';
    const S = time.getSeconds();
    return H + M + S;
}

export const HistorySize = 100;