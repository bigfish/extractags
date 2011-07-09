/*jslint node:true */
/*global exports */
(function () {
    var classes, finder, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending, parser;
    fs = require('fs');
    finder = require('./finder');
    parser = require("./parser");
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
                return callback(null, classObj);
            } else {
                return callback("unable to parse file: " + file);
            }
        });
    };
    outputCTags = function (classes) {
        var classObj, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
            classObj = classes[_i];
            _results.push(console.dir(classObj));
        }
        return _results;
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
    exports.parseDir = parseDir;
    exports.parseFile = parseFile;

}());
