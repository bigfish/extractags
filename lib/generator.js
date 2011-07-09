/*jslint node:true */
/*global exports */
(function () {
    function genTagsFromClassObj(classObj) {
        return "CTAG:TODO";
    }
    exports.genCTags = function (classes, callback) {
        var i, ctags = [];
        if (classes) {
            for (i = 0; i < classes.length; i++) {
                ctags[i] = genTagsFromClassObj(classes[i]);
            }
        }
        return ctags.join('\n');
    };
}());
