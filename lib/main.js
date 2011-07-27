/*jslint node:true */
/*global exports */
/*
 * This module provides the entry point to the application: processInput(dirOrFile, callback)
 * It will call the callback with the parsed array of classes
 */
(function () {
    var classes, finder, watcher, fs, onComplete, outputCTags, parseDir, parseFile, parseText, parser, generator;
    fs = require('fs');
    finder = require('./finder');
    watcher = require('./watcher');
    parser = require("./parser");
    generator = require("./generator");
    classes = [];
    onComplete = null;

    parseFile = function (file, callback) {
        fs.readFile(file, 'utf8', function (err, fileText) {
            var classObj;
            if (err) {
                throw err;
            }
            classObj = parser.parseText(fileText);
            if (classObj) {
                classObj.filePath = file;
                callback(null, classObj);
            } else {
                callback("unable to parse file: " + file);
            }
        });
    };

    parseDir = function (topdir, callback) {
        onComplete = callback;
        classes = [];
        finder.find(topdir, /\.js$/, function (err, file, finished) {
            //console.log("found file: " + file + "; finished = " + finished);
            if (err) {
                throw err;
            }
            if (file) {
                parseFile(file, function (err, classObj) {
                    if (err) {
                        throw err;
                    }
                    classes.push(classObj);
                });
            }
            if (finished) {
                callback(null, classes);
            }
        });
    };

    function genCTags(topdir, callback) {
        fs.stat(topdir, function (err, stats) {
            if (err) {
                throw (err);
            }
            if (stats.isFile()) {
                parseFile(topdir, function (err, classData) {
                    callback(generator.genCTags([classData]));
                });
            } else if (stats.isDirectory) {
                parseDir(topdir, function (err, classes) {
                    callback(generator.genCTags(classes));
                });
            }
        });
    }

    function autoGenCTags(topdir, callback) {
        genCTags(topdir, function (classes) {
            callback(classes);
            //wait until the ctags are first generated before watching
            watcher.watchFiles(topdir, function (file, curr, prev) {
                //console.log("curr.mtime: " + curr.mtime);
                //console.log("prev.mtime: " + prev.mtime);
                if (curr.mtime === prev.mtime) {
                    return;
                }
                if (!/\.js$/.test(file)) {
                    return;
                }
                classes = [];
                genCTags(topdir, callback);
            });
        });
    }

    function stopWatching() {
        watcher.unWatchFiles();
    }

    exports.parseDir = parseDir;
    exports.parseFile = parseFile;
    exports.genCTags = genCTags;
    exports.autoGenCTags = autoGenCTags;
    exports.stopWatching = stopWatching;

}());
