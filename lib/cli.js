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

    main.processInput(topdir, function (ctags) {
        //ctags are sent to std out
        console.log(ctags);
    });
};
