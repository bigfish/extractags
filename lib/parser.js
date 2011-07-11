/*jslint node:true */
/*global exports */
(function () {
    var classes, finder, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending, parser;
    fs = require('fs');
    finder = require('./finder');
    pending = 0;
    classes = [];
    onComplete = null;
    parseText = function (fileStr) {
        var cur_class, line, lines, parseLine, _i, _len;
        cur_class = {};
        lines = fileStr.split('\n');
        parseLine = function (line) {
            var define_res, extend_res;
            define_res = /^\s*Ext\.define\(\s*['"]([^'"]*)['"]/.exec(line);
            if (define_res) {
                cur_class.fullClassName = define_res[1];
            }
            extend_res = /extend\s*\:\s*["']([^"']*)['"]/.exec(line);
            if (extend_res) {
                cur_class.extend = extend_res[1];
            }
        };
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
            line = lines[_i];
            parseLine(line);
        }
        return cur_class;
    };
    exports.parseText = parseText;
}());
