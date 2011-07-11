/*jslint node:true */
/*global module:false */
module.exports = function () {
    var args, main, classes, fs, topdir;
    fs = require('fs');
    main = require('./main');
    args = process.argv;
    if (args.length !== 3) {
        console.log("missing required directory argument");
        process.exit(1);
    }
    //the first argument may be a file or directory
    topdir = args.pop();

    main.genCTags(topdir, function (ctags) {
        //ctags are sent to std out
        console.log(['!_TAG_FILE_FORMAT 2   /extended format/',
                    '!_TAG_FILE_SORTED  1   /0=unsorted, 1=sorted, 2=foldcase/',
                    '!_TAG_PROGRAM_AUTHOR   David Wilhelm /dewilhelm@gmail.com/',
                    '!_TAG_PROGRAM_NAME extjs4ctags/',
                    '!_TAG_PROGRAM_URL  http://github.com/bigfish/extjs4ctags official site/',
                    '!_TAG_PROGRAM_VERSION  0.1 //'].join('\n'));
        console.log(ctags.sort().join('\n'));
    });
};
