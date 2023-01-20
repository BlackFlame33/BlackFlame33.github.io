import {SHELL_HISTORY, TermColors} from "../constants.js";
import {colorize, sleep} from "../utils.js";

// const api = 'https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json';
const api = 'https://api.waifu.pics/sfw/waifu';


const waifus = {
    id: "waifus",
    description: 'wanna see my waifu? Well, never gonna let you down~',
    args: 0,
    async exec(term, _args) {
        term.writeln(colorize(TermColors.Green, 'Soul soul = new Soul(blackflame33.heart)...'));
        await sleep(1000);
        term.write(SHELL_HISTORY);
        term.writeln(colorize(TermColors.Green, 'myGirlfriend = new Waifu(soul)...'));
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(api);
            clearTimeout(id);
            if (!res.ok) {
                term.writeln(colorize(TermColors.Red, `[error] She's too busy right now :( -- ${res.statusText}`));
            } else {
                const waifu = await res.json();
                term.write(SHELL_HISTORY);
                term.writeln(colorize(TermColors.Green, 'blackflame33.takePhoto(myGirlfriend)...'));
                await sleep(1000);
                window.open(waifu.url);
            }
        } catch (e) {
            term.writeln(colorize(TermColors.Red, `[error] She's too busy right now :( -- ${e.message}`));
        }
    },
};

export default waifus;