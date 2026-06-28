# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

这是 BlackFlame33 的个人主页（部署在 GitHub Pages，自定义域名见 `CNAME`：`about.blackflame33.cn`）。它把整个页面伪装成一个交互式的终端（"LikourinShell"），访客通过输入命令来探索作者的信息。

项目是**纯静态站点**，使用原生 ES Modules，**无构建步骤、无包管理器、无测试框架**。前端终端 UI 由 [xterm.js](https://xtermjs.org/) 提供（vendored 在 `xterm/` 目录中，不要手动编辑）。

## 本地开发与运行

没有构建/编译环节。直接用任意静态文件服务器在仓库根目录提供服务即可（命令通过 `fetch` 加载 `.md` 文件，所以**不能直接用 `file://` 打开** `index.html`）：

```bash
python3 -m http.server 8000   # 然后访问 http://localhost:8000
# 或者
npx serve .
```

部署：推送到 `master` 分支后由 GitHub Pages 自动发布，无需手动操作。

## 架构

入口是 `index.html` → 通过 `<script type="module" src="./app/main.js">` 加载。各部分职责：

- **`app/main.js`** — 应用引导与终端会话循环。创建 xterm `Terminal` 实例、加载 addon（fit / web-links）、在 `onKey` 回调里逐字符处理用户输入，并维护命令历史（持久化在 `localStorage` 的 `"history"` 键，上限 `HistorySize=100`）。回车时调用 `commands/index.js` 的 `exec()`。
- **`app/commands/index.js`** — 命令注册表与调度器。`SystemCommands` 数组是**唯一的命令真相来源**；`exec()` 按空格切分输入、做参数校验、再调用对应命令的 `exec`。`help` / `id` / `man` 这三个命令直接内联定义在此文件，其余命令各自一个文件。
- **`app/commands/*.js`** — 每个文件 `export default` 一个命令对象（见下方"命令对象约定"）。
- **`app/file-system.js`** — 模拟文件系统。`Files` 数组是硬编码的文件清单（`blog.md`、`intro.md`、`resume.pdf`、`projects.md`）。`.md` 文件在页面加载时通过 `fetch` 拉取真实内容；带 `deleted: true` 的文件默认不可见（`resume.pdf`、`projects.md` 当前即为隐藏，是给访客探索的"彩蛋"）。`rm` 命令只是把 `deleted` 置为 `true`（内存态，刷新即恢复）。
- **`app/constants.js`** — 终端颜色（Dracula 配色，用 `\x1b[38;2;r;g;bm` 真彩色转义序列）、shell 提示符（`getSHELL_PROMPT()` 含实时时钟）等常量。
- **`app/utils.js`** — 工具函数：`colorize()`、`sleep()`、`downloadFile()`、键盘相关的 `isPrintableKeyCode()` / `handleBackspace()`。

数据流：`main.js`(按键) → `exec()`(调度+校验) → 具体命令(操作 `term` 与 `fileSystem`)。

## 命令对象约定

新增命令的标准做法：在 `app/commands/` 下新建文件，`export default` 一个对象，然后在 `app/commands/index.js` 的 `import` 和 `SystemCommands` 数组中注册。命令对象字段：

- `id`（string）— 命令名（用户输入的关键字）。
- `description`（string）— 一行说明，会被 `help` 列出。
- `usage`（string，可选）— 用法，会被 `man <cmd>` 显示。
- `args`（number）— 参数个数校验规则：`0` = 不接受参数；正数 = 必须恰好这么多个；`-1` = 接受任意数量但**至少一个**。校验由 `exec()` 统一处理，命令内部无需重复校验。
- `async exec(term, args, onProcessExit)` — 命令逻辑。用 `term.write` / `term.writeln` 输出（用 `colorize()` 上色）。
- `process`（可选）— 若为真值，`exec()` 会返回 `command.id` 作为"进程 ID"，表示这是长驻进程；此时主循环会阻塞后续输入，直到命令调用 `onProcessExit`。普通命令不要设置它。

注意：`clear` 命令在 `main.js` 的回车分支里被**特殊硬编码**了一份（见该处 `TO-DO` 注释），与 `commands/clear.js` 存在重复，改动 clear 行为时两处都要留意。

## 内容更新（非代码）

- **`blog.md`** — 由 GitHub Actions 自动生成，**不要手动编辑**。`.github/workflows/blog.yml` 每周日（及 push 到 master / 手动触发）运行 `.github/workflows/rss.ts`（Deno 脚本），抓取 `https://blackflame33.cn/atom.xml` 的最新 5 篇文章并覆写 `blog.md`，commit message 固定为 `docs: update last blog posts`。
- **`files/intro.md`** — 作者自我介绍，`cat intro.md` 会展示，可手动编辑。
- 站内的外链/Web 应用（blog、github、bilibili 等）维护在 `app/commands/open.js` 的 `WebApps` 数组里。

## 约定

- 全部使用原生 ES Modules（`import` / `export`），无打包器。新代码请沿用现有的无依赖、原生 JS 风格。
- 终端输出统一走 xterm 的 `term.write` / `term.writeln`，颜色通过 `constants.js` 的 `TermColors` + `utils.js` 的 `colorize()`，不要直接写裸转义序列。
- 提交信息遵循 Conventional Commits（如 `docs:`、`ci:`、`chore:`、`feat:`），与现有 git 历史保持一致。
