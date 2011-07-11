/*jslint node:true */
/*global exports */
(function () {

    function genTagsFromClassObj(classObj) {
        var tags = [];
        //class tag
        tags.push(classObj.fullClassName + '\t' + classObj.filePath);
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
