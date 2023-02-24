import {TermColors} from "../constants.js";
import {colorize} from "../utils.js";

const LAST_UPDATE = "2023-2-24";

const whoami = {
    id: "whoami",
    args: 0,
    description: "display effective developer info",
    async exec(term, _args) {
        term.writeln(colorize(TermColors.Green, "name: ") + "BlackFlame33");
        term.writeln(
            colorize(TermColors.Green, "current position: ") +
            "Java 后端开发工程师"
        );
        // term.writeln(
        //   colorize(TermColors.Green, "company: ") +
        //     "Heartbeat Medical Solutions < https://heartbeat-med.de >"
        // );
        term.writeln(colorize(TermColors.Green, "location: ") + "成都");
        term.writeln(
            colorize(TermColors.Green, "fav languages: ") +
            "[Java, C, Python]"
        );
        term.writeln(
            colorize(TermColors.Green, "hobbies: ") +
            "[编程，棒球，ACG]"
        );
        term.writeln(
            colorize(TermColors.Green, "blog: ") + "https://blackflame33.cn"
        );
        term.writeln(colorize(TermColors.Green, "last update: ") + LAST_UPDATE);
    },
};

export default whoami;