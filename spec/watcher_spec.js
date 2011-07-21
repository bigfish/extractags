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
                console.log("file changed");
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

        it("should watch a dir and call the callback when a file in it gets created", function () {
            var fileChanged, watcher;
            fileChanged = undefined;
            watcher = require('../lib/watcher');
            //ensure the file to be created does not exist
            fs.unlinkSync('./spec/test_watcher_files/adir/yetAnotherFile.txt');
            //watch dir
            watcher.watchFiles('./spec/test_watcher_files/adir', function (file, curr, prev) {
                console.log("file created");
                fileChanged = file;
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

        it("should watch a dir and call the callback when a file in it deleted", function () {
            var fileChanged, watcher;
            fileChanged = undefined;
            watcher = require('../lib/watcher');
            //ensure the file to be created exists
            fs.writeFileSync('./spec/test_watcher_files/adir/someAnotherFile.txt', 'foo', 'UTF-8');
            //watch dir
            watcher.watchFiles('./spec/test_watcher_files/adir', function (file, curr, prev) {
                console.log("file deleted");
                fileChanged = file;
            });
            //wait for callback
            waitsFor(function () {
                return fileChanged !== undefined;
            }, "watch did not get callback after file changed", 1000);
            //delete file
            fs.unlinkSync('./spec/test_watcher_files/adir/someAnotherFile.txt');
            return runs(function () {
                expect(fileChanged).toBe('./spec/test_watcher_files/adir/someAnotherFile.txt');
            });
        });
    });
}());
