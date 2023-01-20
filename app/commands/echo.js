const echo = {
    id: "echo",
    args: -1,
    description: 'write arguments to the standard output.',
    usage: 'echo [something ...]',
    async exec(term, args) {
        const say = args.join(' ');
        term.writeln(say);
    },
};

export default echo;