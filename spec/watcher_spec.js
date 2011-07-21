/*jslint node:true */
/*global describe it expect waitsFor waits runs*/
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
            }, "watch did not get callback after file changed", 2000);
            //change file
            fs.writeFileSync('./spec/test_watcher_files/afile.js', 'foo', 'UTF-8');
            return runs(function () {
                expect(fileChanged).toBe('./spec/test_watcher_files/afile.js');
                watcher.unWatchFiles();
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
            }, "watch did not get callback after file changed", 2000);
            //change file
            fs.writeFileSync('./spec/test_watcher_files/adir/anotherFile.txt', 'foo', 'UTF-8');
            return runs(function () {
                expect(fileChanged).toBe('./spec/test_watcher_files/adir/anotherFile.txt');
                watcher.unWatchFiles();
            });
        });

        it("should watch a dir and call the callback when a file in it gets created", function () {
            var fileChanged, watcher;
            var WATCH_DIR = './spec/test_watcher_files/adir';
            var WATCH_FILE = WATCH_DIR + "/yetAnotherFile.js";
            fileChanged = undefined;
            watcher = require('../lib/watcher');
            //ensure the file to be created does not exist
            //fs.unlinkSync(WATCH_FILE);
            //watch dir
            watcher.watchFiles(WATCH_DIR, function (file, curr, prev) {
                fileChanged = file;
            });

            //create a file
            fs.writeFileSync(WATCH_FILE, 'foo', 'UTF-8');

            //wait for callback
            waitsFor(function () {
                return fileChanged !== undefined;
            }, "watch did not get callback after file changed", 2000);


            runs(function () {
                expect(fileChanged).toBe(WATCH_FILE);
                watcher.unWatchFiles();
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
            //delete file
            waits(1000);
            runs(function () {
                fs.unlink('./spec/test_watcher_files/adir/someAnotherFile.txt');
            });

            //wait for callback
            waitsFor(function () {
                return fileChanged !== undefined;
            }, "watch did not get callback after file changed", 2000);

            runs(function () {
                expect(fileChanged).toBe('./spec/test_watcher_files/adir/someAnotherFile.txt');
                watcher.unWatchFiles();
            });
        });
    });
}());
