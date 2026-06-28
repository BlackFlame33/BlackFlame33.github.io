import {Terminal} from "@xterm/xterm";
import {FitAddon} from "@xterm/addon-fit";
import {WebLinksAddon} from "@xterm/addon-web-links";

/**
 * Pick a font size for the current viewport. Discrete breakpoints keep the
 * desktop value at exactly 20px (a continuous formula risks sub-pixel drift),
 * so desktop rendering stays pixel-identical to the original.
 * @returns {number}
 */
export function computeFontSize() {
    const w = window.innerWidth;
    if (w >= 769) return 20; // desktop: unchanged
    if (w >= 600) return 18; // tablet
    if (w >= 400) return 16; // large phone
    return 14;               // small phone
}

/**
 * Create the xterm Terminal, load its addons, mount it, and wire up the
 * responsive resize/orientation handling.
 * @param {HTMLElement} container
 * @returns {Terminal}
 */
export function createTerminal(container) {
    const term = new Terminal({
        cursorBlink: true,
        scrollback: 1000,
        tabStopWidth: 4,
        fontFamily: "'Fira Code', monospace",
        fontSize: computeFontSize(),
        theme: {
            background: "#282a36",
            // Current Line
            selectionBackground: "#44475a",
            foreground: "#f8f8f2",
            // Comment
            cyan: "#8be9fd",
            brightCyan: "#8be9fd",
            green: "#50fa7b",
            brightGreen: "#50fa7b",
            // Orange
            // Pink
            // Purple
            cursor: "#cccccc",
            cursorAccent: "#c7157a",
            brightMagenta: "#c7157a",
            red: "#ff5555",
            brightRed: "#ff5555",
            yellow: "#f1fa8c",
            brightYellow: "#f1fa8c",
            // [16]Orange, [17]Pink, [18]Purple
            // extendedAnsi: ['#ffb86c','#ff79c6','#bd93f9'],
        },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(container);

    // The bordered box shrink-wraps the terminal, so fitAddon.fit() — which
    // measures that box — would feed the terminal's own width back into the
    // next fit and ratchet it narrower on every call. On mobile this is very
    // visible: hiding the address bar by scrolling fires a resize, so the
    // terminal shrank on every swipe. Resetting to the default column count
    // first lets the box expand back to the real available width before
    // measuring; the result is stable and identical to before on desktop.
    const DEFAULT_COLS = 80;

    function safeFit() {
        term.resize(DEFAULT_COLS, term.rows);
        fitAddon.fit();
    }

    safeFit();

    // Re-fit only when the viewport WIDTH (or font size) actually changes.
    // Height-only changes — mobile address bar showing/hiding during a scroll —
    // must not trigger a re-fit, debounced via rAF.
    let raf = null;
    let lastWidth = window.innerWidth;

    function onViewportChange() {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            const width = window.innerWidth;
            const fontSize = computeFontSize();
            const fontChanged = term.options.fontSize !== fontSize;
            if (width === lastWidth && !fontChanged) {
                return;
            }
            lastWidth = width;
            if (fontChanged) {
                term.options.fontSize = fontSize;
            }
            safeFit();
        });
    }

    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);

    // Re-fit once the web font has loaded to avoid a first-frame metric glitch.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => safeFit());
    }

    return term;
}
