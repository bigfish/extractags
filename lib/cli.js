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
    topdir = args.pop();
    fs.stat(topdir, function (err, stats) {
        if (err) {
            throw (err);
        }
        if (stats.isFile()) {
            main.parseFile(topdir, function (err, classData) {
                console.dir(classData);
            });
        } else if (stats.isDirectory) {
            main.parseDir(topdir, function (err, classes) {
                console.dir(classes);
            });
        }
    });
};
