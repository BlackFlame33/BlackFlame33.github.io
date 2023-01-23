import {parseFeed} from "https://deno.land/x/rss/mod.ts";

const response = await fetch(
    "https://blackflame33.cn/atom.xml",
);
const xml = await response.text();
const feed = await parseFeed(xml);

const output = [];
for (const {title, content, links} of feed.entries.slice(0, 5)) {
    output.push(`# ${title.value}\r\n${links[0].href}\r\n`);
}
await Deno.stdout.write(new TextEncoder().encode(output.join('\n')));