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
        var method, i, prop;
        //class tag
        if (classObj.fullClassName) {
            tags.push(classObj.className + '\t' + classObj.filePath + '\t/^' + classObj.classDefineLine + '$/' + TERM + '\t' + 'c');
        }
        //constructor fn tag
        if (classObj.constructorFn) {
            tags.push(classObj.className + '\t' + classObj.filePath + '\t/^' + classObj.constructorFn.line + '$/' + TERM + '\t' + 'f');
        }
        //methods
        for (i = 0; i < classObj.methods.length; i++) {
            method = classObj.methods[i];
            tags.push(method.name + '\t' + classObj.filePath + '\t/^' + method.line + '$/' + TERM + '\t' + 'f');
        }
        //properties
        for (i = 0; i < classObj.props.length; i++) {
            prop = classObj.props[i];
            tags.push(prop.name + '\t' + classObj.filePath + '\t/^' + prop.line + '$/' + TERM + '\t' + 'p');
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
