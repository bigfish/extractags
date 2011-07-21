/*jslint node:true */
/*global describe it expect waitsFor runs*/
(function () {
    var fs = require('fs');
    describe("file watcher watches files", function () {
        it("should watch a file and call the callback when it changes", function () {
            var error, fileChanged, watcher;
            fileChanged = undefined;
            watcher = require('../lib/watcher');
            watcher.watchFiles('./spec/test_watcher_files/afile.js', function (file, curr, prev) {
                fileChanged = file;
            });

            waitsFor(function () {
                return fileChanged !== undefined;
            }, "watch did not get callback after file changed", 1000);
            //change file
            fs.writeFileSync('./spec/test_watcher_files/afile.js', 'foo', 'UTF-8');
            return runs(function () {
                expect(fileChanged).toBe('./spec/test_watcher_files/afile.js');
            });
        });
    });
}());
