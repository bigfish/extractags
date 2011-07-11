/*jslint node:true */
/*global exports */
(function () {
    function genTagsFromClassObj(classObj) {
        var tags = [];
        tags.push(classObj.fullClassName);
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
