/*jslint node:true */
/*global exports */
(function () {
    var classes, finder, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending, parser, stripComments, isIdentifier, getLastPart, parseFunctionParams;
    fs = require('fs');
    finder = require('./finder');
    pending = 0;
    classes = [];
    onComplete = null;
    stripComments = function (str) {
        return str.replace(/\/\*[^\/]*\*\//g, '');
    };
    isIdentifier = function (str) {
        return str.match(/^[A-Za-z$_0-9]+$/);
    };
    getLastPart = function (str) {
        if (str.indexOf('.') !== -1) {
            return str.split(/\./).pop();
        } else {
            return str;
        }
    };
    parseFunctionParams = function (result) {
        var params_str, params = [];
        //if has params...
        if (result.length > 1) {
            params = [];
            params_str = result[1];
            //stripComments
            params_str = stripComments(params_str);
            //single param -- params only contains chars allowed in identifiers
            if (isIdentifier(params_str)) {
                params.push(params_str);
            } else {
                //multiple params
                if (params_str.indexOf(',') !== -1) {
                    params = params_str.split(/\s*\,\s*/);
                }
            }
        }
        return params;
    };
    parseText = function (fileStr) {
        var cur_class, line, lines, parseLine, _i, _len;
        cur_class = {};
        lines = fileStr.split('\n');
        parseLine = function (line) {
            var define_res, extend_res, cons_res, params_str, params;
            define_res = /^\s*Ext\.define\(\s*['"]([^'"]*)['"]/.exec(line);
            if (define_res) {
                cur_class.classDefineLine = line;
                cur_class.fullClassName = define_res[1];
                cur_class.className = getLastPart(define_res[1]);
                return;
            }
            extend_res = /extend\s*\:\s*["']([^"']*)['"]/.exec(line);
            if (extend_res) {
                cur_class.extend = extend_res[1];
                return;
            }
            //constructor
            cons_res = /^\s*constructor\s*:\s*function\s*\(\s*([^)]*)\s*\)/.exec(line);
            if (cons_res) {
                params = parseFunctionParams(cons_res);
                cur_class.constructorFn = {
                    line: line,
                    params: params
                };
                return;
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
