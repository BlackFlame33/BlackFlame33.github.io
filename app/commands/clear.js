import {getSHELL_PROMPT} from "../core/constants.js";

const clear = {
    id: "clear",
    description: "clear terminal screen.",
    usage: "clear",
    args: 0,
    // Owns its prompt flow: clears the screen and redraws a fresh prompt on the
    // top line (see the managesPrompt handling in main.js).
    managesPrompt: true,
    async exec(term) {
        term.clear();
        term.write("\r" + getSHELL_PROMPT());
    },
};

export default clear
