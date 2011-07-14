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
        var header = ["!_TAG_FILE_FORMAT\t2\t/extended format; --format=1 will not append ;\" to lines/",
                            "!_TAG_FILE_SORTED\t1\t/0=unsorted, 1=sorted, 2=foldcase/",
                            "!_TAG_PROGRAM_AUTHOR\tDarren Hiebert\t/dhiebert@users.sourceforge.net/",
                            '!_TAG_PROGRAM_AUTHOR\tDavid Wilhelm\t/dewilhelm@gmail.com/',
                            '!_TAG_PROGRAM_NAME\textjs4ctags/',
                            '!_TAG_PROGRAM_URL\thttp://github.com/bigfish/extjs4ctags official site/',
                            '!_TAG_PROGRAM_VERSION  0.1 //'].join('\n');
        console.log(header);
        console.log(ctags.sort().join('\n'));
    });
};
