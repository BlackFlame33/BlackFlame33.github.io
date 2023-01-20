import {sleep} from "../utils.js";

const exit = {
    id: "exit",
    args: 0,
    description: 'terminate current session',
    async exec(term, _args) {
        term.writeln('terminating session...');
        await sleep(1000);
        window.location.href = '';
    },
};

export default exit;