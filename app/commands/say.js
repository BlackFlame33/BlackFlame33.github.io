import {getSpacing} from "../utils.js";

const say = {
    id: "say",
    args: -1,
    description: 'say nice things. max 20 chars',
    usage: 'say [something ...]',
    async exec(term, args) {
        const max = 20;
        const say = args.join(' ').slice(0, max);
        let spacing = 12 - Math.floor(say.length / 2);
        term.writeln('                    ,,. .');
        term.writeln('               ,,::,,,.    .');
        term.writeln('              ..           ..,');
        term.writeln('              :,....       ..,,     ii');
        term.writeln('              :,,.....      ..,: ;;;iii:');
        term.writeln('              ;:,,....      ...,::::;;::');
        term.writeln('              ;:,,.....       GGC.,,,,,.');
        term.writeln('       ;iiiiiiiii.,... CLLL@   ........');
        term.writeln('      tttttttttttttttt1...........');
        term.writeln('               000fffffff00@.   i800');
        term.writeln('              fffftt80L000000fG0fL  /' + getSpacing(max + 4, '-') + ' /');
        term.writeln('                ,i1i;;0fffG00fffff1/' + getSpacing(spacing) + say + getSpacing(say.length % 2 !== 0 ? spacing - 1 : spacing) + ' /');
        term.writeln('                   1i;;t1;,::,.;i1/' + getSpacing(max + 4, '-') + ' /');
        term.writeln('                     t1ii;;::;;ii');
        term.writeln('                         Ltii;i;');
        // usr@BlackFlame33
        // OS: LikourinOs
        // Kernel: 7.10.0-693.2.2.el7.x86_64
        // Shell: LikourinShell 1.0.0
        // Uptime: 2d 11h 41m 51s
        // Resolution: 1920x1080
        // Font: Cutive Mono

    },
};

export default say;