/*jslint node:true white:false */
/*global module:false */
module.exports = function () {
    var args, arg, main, classes, fs, sys, topdir, cli, help, output, HEADER_TEXT, watch;
    watch = false;
    fs = require('fs');
    sys = require('sys');
    main = require('./main');
    output = 'stdout';

    HEADER_TEXT = [
        "!_TAG_FILE_FORMAT\t2\t/extended format; /"
        , "!_TAG_FILE_SORTED\t1\t/0=unsorted, 1=sorted, 2=foldcase/"
        , '!_TAG_PROGRAM_AUTHOR\tDavid Wilhelm\t/dewilhelm@gmail.com/'
        , '!_TAG_PROGRAM_NAME\textractags/'
        , '!_TAG_PROGRAM_URL\thttp://github.com/bigfish/extractags /'
        , '!_TAG_PROGRAM_VERSION  0.1 //'
        ];

    function showHelp() {
        sys.print([
            'USAGE: extract [--help|-h] [--output|-o ctags_file] [--file|-f file] [--dir|-d directory] [file|dir]'
            , ''
            , 'Options:'
            , '  --help          - this help'
            , '  --file          - file to parse'
            , '  --dir           - dir to parse'
            , '  --output        - ctags output file'
            , ''
            ].join("\n"));

        process.exit(1);
    }
    //parse arguments
    args = process.argv.slice(2);
    while (args.length) {
        arg = args.shift();
        switch (arg) {

        case '-o':
        case '--output':
            output = args.shift();
            break;

        case '-f':
        case '--file':
            topdir = args.shift();
            break;

        case '-d':
        case '--dir':
            topdir = args.shift();
            break;

        case '-h':
        case '--help':
            showHelp();
            break;

        case '-w':
        case '--watch':
            watch = true;
            break;

        default:
            if (arg.match(/^--/)) {
                help();
            }
            //default argument is file or folder to parse
            topdir = arg;
            break;
        }
    }
    if (!topdir) {
        showHelp();
        process.exit(1);
    }
    if (watch) {
        main.autoGenCTags(topdir, function (ctags) {
            var buffer = HEADER_TEXT.concat(ctags.sort()).join('\n');
            if (output === 'stdout') {
                sys.print(buffer);
            } else {
                fs.writeFile(output, buffer, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('ctags generated to ' + output);
                    }
                });
            }
        });
    } else {
        main.genCTags(topdir, function (ctags) {
            var buffer = HEADER_TEXT.concat(ctags.sort()).join('\n');
            if (output === 'stdout') {
                sys.print(buffer);
            } else {
                fs.writeFile(output, buffer, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('ctags generated to ' + output);
                    }
                });
            }
        });

    }


};
