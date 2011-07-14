/*jslint node:true */
/*global exports */
(function () {

    var typeTokens = {
        'function': 'f',
        'class': 'c',
        'variable': 'v',
        'note': 'i',
        'property': 'p'
    };

    var TERM = ';"';

    function genTagsFromClassObj(classObj) {
        var tags = [];
        //class tag
        if (classObj.fullClassName) {
            tags.push(classObj.fullClassName + '\t' + classObj.filePath + '\t/^' + classObj.classDefineLine + '$/' + TERM + '\t' + 'c');
        }
        //constructor fn tag
        if (classObj.constructorFn) {
            tags.push(classObj.fullClassName + '\t' + classObj.filePath + '\t/^' + classObj.constructorFn.line + '$/' + TERM + '\t' + 'f');
        }
        return tags;
    }
    exports.genCTags = function (classes, callback) {
        var i, ctags = [];
        if (classes) {
            for (i = 0; i < classes.length; i++) {
                ctags = ctags.concat(genTagsFromClassObj(classes[i]));
            }
        }
        return ctags;
    };
}());
