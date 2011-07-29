/*jslint node:true */
/*global exports */
(function () {
    var classes, finder, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending, parser, stripComments, isIdentifier, getLastPart, parseFunctionParams;
    var checkComments, insideComment = false,
        insideStatics = false;
    var stack, updateStack, getNextBrace;
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
    getNextBrace = function (line, pos) {
        var startBlockIdx = line.indexOf('{', pos);
        var endBlockIdx = line.indexOf('}', pos);
        if (startBlockIdx === -1 && endBlockIdx === -1) {
            return ['', -1];
        } else if (startBlockIdx === -1) {
            return ['}', endBlockIdx];
        } else if (endBlockIdx === -1) {
            return ['{', startBlockIdx];
        } else {
            return startBlockIdx < endBlockIdx ? ['{', startBlockIdx] : ['}', endBlockIdx];
        }
    };
    updateStack = function (line) {
        var nextBraceArr = getNextBrace(line, 0);
        var nextBrace = nextBraceArr[0];
        var nextBracePos = nextBraceArr[1];
        while (nextBrace) {
            if (nextBrace === '{') {
                stack.push(nextBrace);
            } else {
                stack.pop();
            }
            nextBraceArr = getNextBrace(line, nextBracePos + 1);
            nextBrace = nextBraceArr[0];
            nextBracePos = nextBraceArr[1];
        }
    };

    parseText = function (fileStr) {
        var cur_class, line, lines, parseLine, _i, _len, defineStackDepth, staticsStackDepth;
        insideComment = false;
        insideStatics = false;
        defineStackDepth = 0;
        staticsStackDepth = 0;
        cur_class = {
            methods: [],
            props: []
        };
        //stack is pushed every time we enter a function or object literal {
        //and is popped every time we see a }
        //note that this considers if/else/when blocks as well, but they don't matter
        stack = [];
        lines = fileStr.split('\n');
        parseLine = function (line) {
            var define_res, extend_res, cons_res, params_str, params, method_res, prop_res, statics_res, method, property;
            if (insideComment) {
                //check whether the comment is terminated on the current line,
                //before skipping to the next one
                checkComments(line);
                return;
            }
            //update whether the next line is within a multiline comment
            checkComments(line);

            //update whether we are in a statics block
            if (insideStatics) {

                if (stack.length > staticsStackDepth) {
                    //ignore stuff which is not static properties or method declarations
                    updateStack(line);
                    return;
                } else if (stack.length < staticsStackDepth) {
                    insideStatics = false;
                    staticsStackDepth = -1;
                }
            }

            define_res = /^\s*Ext\.define\(\s*['"]([^'"]*)['"]/.exec(line);
            if (define_res) {
                cur_class.classDefineLine = line;
                cur_class.fullClassName = define_res[1];
                cur_class.className = getLastPart(define_res[1]);
                updateStack(line);
                //Attempt to handle Ext.define() calls where the opening brace does not occur on the same line
                if (line.indexOf('{') !== -1) {
                    defineStackDepth = stack.length;
                } else {
                    defineStackDepth = stack.length + 1;
                }
                return;
            }


            //statics
            statics_res = /^\s*statics\s*:\s*\{\s*/.exec(line);
            if (statics_res) {
                insideStatics = true;
                cur_class.statics = {
                    methods: [],
                    props: []
                };
                updateStack(line);
                staticsStackDepth = stack.length;
                return;
            }
            //all previous calls to updateStack are followed by returns..
            //if we are here, we need to update stack depth
            updateStack(line);
            //Note: no further calls to updateStack should be placed after here!
            //extends
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
                method = {
                    name: method_res[1],
                    line: line,
                    params: params
                };
                if (insideStatics) {
                    cur_class.statics.methods.push(method);
                } else {
                    cur_class.methods.push(method);
                }
                return;
            }
            //properties
            prop_res = /^\s*([A-Za-z_$][0-9A-Za-z_$]*)\s*:\s*/.exec(line);
            if (prop_res) {
                property = {
                    name: prop_res[1],
                    line: line
                };

                if (insideStatics) {
                    cur_class.statics.props.push(property);
                } else {
                    cur_class.props.push(property);
                }
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
