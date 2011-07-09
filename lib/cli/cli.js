/*jslint node:true */
/*global module:false */
module.exports = function () {
    var args, classes, fs, parser, topdir;
    fs = require('fs');
    args = process.argv;
    if (args.length !== 3) {
        console.log("missing required directory argument");
        process.exit(1);
    }
    topdir = args.pop();
    parser = require("../parser/parser");
    fs.stat(topdir, function (err, stats) {
        if (err) {
            throw (err);
        }
        if (stats.isFile()) {
            parser.parseFile(topdir, function (err, classData) {
                console.dir(classData);
            });
        } else if (stats.isDirectory) {
            parser.parseDir(topdir, function (err, classes) {
                console.dir(classes);
            });
        }
    });
};
