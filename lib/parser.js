/*jslint node:true */
/*global exports */
(function () {
    var classes, finder, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending, parser, stripComments, isIdentifier, getLastPart, parseFunctionParams;
    var checkComments, insideComment = false;
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
    //checkComments determines whether the *next* line
    //starts within a block level comment and sets the 'insideComment' flag accordingly
    //However since most block level, multiline comments will begin at the start of the
    //line,the current implementation ignores lines on which multiline comments start
    checkComments = function (lineStr) {
        var lastStartCommentIndex = 0;
        var i = lineStr.indexOf('/*');
        while (i !== -1) {
            lastStartCommentIndex = i + 2;
            insideComment = true;
            i = lineStr.indexOf('/*', lastStartCommentIndex);
        }
        if (lineStr.indexOf('*/', lastStartCommentIndex) !== -1) {
            insideComment = false;
        }
    };
    parseFunctionParams = function (result) {
        var params_str, params = [];
        //if has params...
        if (result.length > 1) {
            params = [];
            params_str = result[2];
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
        insideComment = false;
        cur_class = {
            methods: []
        };
        lines = fileStr.split('\n');
        parseLine = function (line) {
            var define_res, extend_res, cons_res, params_str, params, method_res;
            if (insideComment) {
                //check whether the comment is terminated on the current line,
                //before skipping to the next one
                checkComments(line);
                return;
            }
            //update whether the next line is within a multiline comment
            checkComments(line);
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
            cons_res = /^\s*(constructor)\s*:\s*function\s*\(\s*([^)]*)\s*\)/.exec(line);
            if (cons_res) {
                params = parseFunctionParams(cons_res);
                cur_class.constructorFn = {
                    line: line,
                    params: params
                };
                return;
            }
            //methods
            method_res = /^\s*([A-Za-z_$][0-9A-Za-z_$]*)\s*:\s*function\s*\(\s*([^)]*)\s*\)/.exec(line);
            if (method_res) {
                params = parseFunctionParams(method_res);
                cur_class.methods.push({
                    name: method_res[1],
                    line: line,
                    params: params
                });
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
