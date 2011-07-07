#!/usr/bin/env node

(function () {
    var args, classes, fs, parser, topdir;
    fs = require('fs');
    args = process.argv;
    if (args.length !== 3) {
        console.log("missing required directory argument");
        process.exit(1);
    }
    topdir = args.pop();
    parser = require("../lib/extjs4ctags");
    fs.stat(topdir, function (err, stats) {
        if (err) {
            throw (err)
        }
        if (stats.isFile()) {
            parser.parseFile(topdir, function (classData) {
                console.dir(classData);
            });
        } else if (stats.isDirectory) {
            parser.parseDir(topdir, function (err, classes) {
                console.dir(classes);
            });
        }
    });
}).call(this);
