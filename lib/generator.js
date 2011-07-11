/*jslint node:true */
/*global exports */
(function () {
/*
    f  functions,methods 
    p  properties 
    v  variables 
    c  classes 
    i  {Notes} 
    i  {To do} 
    p  prototype 
*/
    function genTagsFromClassObj(classObj) {
        var tags = [];
        //class tag
        if (classObj.fullClassName) {
            tags.push(classObj.fullClassName + '\t' + classObj.filePath + '\t/^' + classObj.classDefineLine + '$/;"');
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
