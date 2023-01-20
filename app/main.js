import {getSHELL_PROMPT, HistorySize, SHELL_HISTORY, TermColors} from "./constants.js";
import fileSystem from "./file-system.js";
import {colorize, handleBackspace, isPrintableKeyCode, sleep} from "./utils.js";
import {exec} from "./commands/index.js";

function printError(term, error) {
    term.write(TermColors.Red + error);
}

function prompt(term) {
    term.write("\r\n" + getSHELL_PROMPT());
}

function promptHistory(term) {
    term.write("\r\n" + SHELL_HISTORY);
}


function deleteCurrentInput(term, input) {
    let i = 0;
    while (i < input.length) {
        term.write("\b \b");
        i++;
    }
}

async function initTerminalSession(term) {
    term.writeln("Hi Guys. Welcome to LikourinShell.\r\n" + "This page is inspired by " + colorize(TermColors.Red, "https://sourl.cn/kkHiEn") + " It's so cool!\r\n" + "Try to find more information about me!\r\n" + "type \"help\" to see the available commands.\r\n" + "Have fun :)\r\n");
    term.writeln(colorize(TermColors.Green, "creating new session..."));
    await sleep(1300);
    term.write(getSHELL_PROMPT());
}

function pushCommandToHistory(store, command) {
    // Avoid duplicates with last command
    if (store.length > 0 && store[store.length - 1] === command) {
        return;
    }
    store.push(command);
    if (store.length > HistorySize) {
        store.shift();
    }
    setTimeout(() => localStorage.setItem("history", JSON.stringify(store)), 0);
}

function loadCommandHistory() {
    const data = localStorage.getItem("history");
    if (!data) {
        return [];
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to parse command history", e);
        return [];
    }
}


function createOnKeyHandler(term) {
    // Track the user input
    let userInput = "";
    // Track command history
    let commandHistory = loadCommandHistory();
    let currentHistoryPosition = commandHistory.length;
    // Only one process at a time
    let currentProcessId = null;

    function onProcessExit() {
        prompt(term);
        currentProcessId = null;
    }

    return async ({key, domEvent: ev}) => {
        if (currentProcessId !== null) {
            return;
        }

        switch (ev.key) {
            case "ArrowUp":
            case "ArrowDown": {
                if (commandHistory.length === 0) {
                    return;
                }

                if (ev.key === "ArrowDown") {
                    if (currentHistoryPosition === commandHistory.length) return;

                    currentHistoryPosition = Math.min(
                        commandHistory.length,
                        currentHistoryPosition + 1
                    );
                } else {
                    currentHistoryPosition = Math.max(0, currentHistoryPosition - 1);
                }

                deleteCurrentInput(term, userInput);
                if (currentHistoryPosition === commandHistory.length) {
                    userInput = "";
                } else {
                    userInput = commandHistory[currentHistoryPosition];
                }
                term.write(userInput);
                return;
            }

            case "c": {
                if (ev.ctrlKey) {
                    prompt(term);
                    userInput = "";
                    currentHistoryPosition = commandHistory.length;
                    return;
                }
                break;
            }

            case "l": {
                if (ev.ctrlKey) {
                    term.clear();
                    return;
                }
                break;
            }

            case "Backspace": {
                userInput = handleBackspace(term, userInput);
                return;
            }

            case "Enter": {
                userInput = userInput.trim();
                if (userInput.length === 0) {
                    userInput = "";
                    prompt(term);
                    return;
                }
                // TO-DO : 重复定义 clear 命令，期待后续改进。
                if (userInput === "clear") {
                    term.clear();
                    term.write("\r" + getSHELL_PROMPT());
                    userInput = "";
                    return;
                }
                promptHistory(term);
                try {
                    currentProcessId = await exec(term, userInput, onProcessExit);
                } catch (e) {
                    printError(term, e.message);
                }

                pushCommandToHistory(commandHistory, userInput);
                currentHistoryPosition = commandHistory.length;
                userInput = "";
                if (currentProcessId === null) {
                    prompt(term);
                }
                return;
            }
        }

        const hasModifier = ev.altKey || ev.altGraphKey || ev.ctrlKey || ev.metaKey;

        if (!hasModifier && isPrintableKeyCode(ev.keyCode)) {
            term.write(key);
            userInput += key;
        }
    };
}

async function runTerminal() {
    const container = document.getElementById("term");
    const term = new Terminal({
        cursorBlink: "block",
        scrollback: 1000,
        tabStopWidth: 4,
        fontFamily: "'Fira Code', monospace",
        fontSize: 20,
        theme: {
            background: "#282a36",
            // Current Line
            selection: "#44475a",
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

    const fitAddon = new window.FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new window.WebLinksAddon.WebLinksAddon());

    term.open(container);

    fitAddon.fit();
    term.focus();

    await initTerminalSession(term);

    term.onKey(createOnKeyHandler(term));
}

window.onload = function () {
    fileSystem.load().catch(console.error);
    runTerminal().catch(console.error);
};