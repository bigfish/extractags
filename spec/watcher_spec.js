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
        it("should watch a dir and call the callback when a file in it changes", function () {
            var fileChanged, watcher;
            fileChanged = undefined;
            watcher = require('../lib/watcher');
            //watch dir
            watcher.watchFiles('./spec/test_watcher_files/adir', function (file, curr, prev) {
                fileChanged = file;
            });
            //wait for callback
            waitsFor(function () {
                return fileChanged !== undefined;
            }, "watch did not get callback after file changed", 1000);
            //change file
            fs.writeFileSync('./spec/test_watcher_files/adir/anotherFile.txt', 'foo', 'UTF-8');
            return runs(function () {
                expect(fileChanged).toBe('./spec/test_watcher_files/adir/anotherFile.txt');
            });
        });
        it("should watch a dir and call the callback when a file in it created", function () {
            var fileChanged, watcher;
            fileChanged = undefined;
            watcher = require('../lib/watcher');
            //ensure the file to be created does not exist
            fs.unlinkSync('./spec/test_watcher_files/adir/yetAnotherFile.txt');
            //watch dir
            watcher.watchFiles('./spec/test_watcher_files/adir', function (file, curr, prev) {
                fileChanged = file;
                console.log(file + " changed");
            });
            //wait for callback
            waitsFor(function () {
                return fileChanged !== undefined;
            }, "watch did not get callback after file changed", 1000);
            //create a file
            fs.writeFileSync('./spec/test_watcher_files/adir/yetAnotherFile.txt', 'foo', 'UTF-8');
            return runs(function () {
                expect(fileChanged).toBe('./spec/test_watcher_files/adir/yetAnotherFile.txt');
            });
        });
    });
}());
