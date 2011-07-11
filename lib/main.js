/*jslint node:true */
/*global exports */
/*
 * This module provides the entry point to the application: processInput(dirOrFile, callback)
 * It will call the callback with the parsed array of classes
 */
(function () {
    var classes, finder, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending, parser, generator;
    fs = require('fs');
    finder = require('./finder');
    parser = require("./parser");
    generator = require("./generator");
    pending = 0;
    classes = [];
    onComplete = null;

    parseFile = function (file, callback) {
        return fs.readFile(file, 'utf8', function (err, fileText) {
            var classObj;
            if (err) {
                throw err;
            }
            classObj = parser.parseText(fileText);
            if (classObj) {
                classObj.filePath = file;
                return callback(null, classObj);
            } else {
                return callback("unable to parse file: " + file);
            }
        });
    };

    parseDir = function (topdir, callback) {
        onComplete = callback;
        classes = [];
        pending = 0;
        return finder.find(topdir, /\.js$/, function (err, file, finished) {
            if (err) {
                throw err;
            }
            if (file) {
                return parseFile(file, function (err, classObj) {
                    if (err) {
                        throw err;
                    }
                    classes.push(classObj);
                    if (finished) {
                        return callback(null, classes);
                    }
                });
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
                    callback(classes);
                });
            }
        });

    }
    exports.parseDir = parseDir;
    exports.parseFile = parseFile;
    exports.genCTags = genCTags;

}());
