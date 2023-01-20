const clear = {
    id: "clear",
    description: "clear terminal screen.",
    usage: "clear",
    args: 0,
    async exec(term) {
        term.clear();
    },
};

export default clear