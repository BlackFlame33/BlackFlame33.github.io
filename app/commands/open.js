import {TermColors} from "../constants.js";
import {colorize, sleep} from "../utils.js";
import fileSystem from "../file-system.js";

const WebApps = [
    {
        name: "blog",
        url: "https://blackflame33.cn",
    },
    {
        name: "github",
        url: "https://github.com/BlackFlame33/",
    },
    {
        name: "source",
        url: "https://github.com/BlackFlame33/BlackFlame33.github.io",
    },
    {
        name: "bilibili",
        url: "https://space.bilibili.com/8314891/dynamic",
    }
];

const open = {
    id: "open",
    description: "open files or applications",
    usage: `\r\n\topen filename\r\n\topen [${WebApps.map((app) => app.name).join(
        " | "
    )}]`,
    args: 1,
    async exec(term, args) {
        let url = "";
        const file = fileSystem.get(args[0]);
        if (file) {
            url = `${window.location.origin}${file.path}`;
        } else {
            const app = WebApps.find((a) => a.name === args[0]);
            if (app) {
                url = app.url;
            }
        }

        if (url === "") {
            term.writeln(
                colorize(TermColors.Red, "[error]: ") +
                `"${args[0]}" no such file or application`
            );
            term.writeln(this.usage);
            return;
        }
        term.writeln(`opening ${args[0]}...`);
        await sleep(1000);
        window.open(url);
    },
};

export default open;