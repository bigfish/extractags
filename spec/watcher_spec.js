/*jslint node:true */
/*global describe it expect waitsFor afterEach waits runs*/
(function () {
    var fs = require('fs');
    afterEach(function () {
        try {
            fs.unlinkSync('./spec/test_watcher_files/adir/yetAnotherFile.js');
        } catch (e) {
            //ignore failure to delete if not exist
        }

    });
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
            }, "watch did not get callback after file changed", 3000);
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
            }, "watch did not get callback after file changed", 3000);
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
            //watch dir
            watcher.watchFiles(WATCH_DIR, function (file, curr, prev) {
                fileChanged = file;
            });
            //create a file
            fs.writeFileSync(WATCH_FILE, 'foo', 'UTF-8');

            //wait for callback
            waitsFor(function () {
                return fileChanged !== undefined;
            }, "watch did not get callback after file changed", 3000);


            runs(function () {
                expect(fileChanged).toBe(WATCH_FILE);
                watcher.unWatchFiles();
            });
        });

      
        it("should not die with a too many files open error", function () {
            var fileChanged, watcher;
            fileChanged = undefined;
            watcher = require('../lib/watcher');
            //watch dir with lots of files
            watcher.watchFiles('./spec/lib', function (file, curr, prev) {
                fileChanged = file;
            });

            //wait for callback
            waits(5000);

            runs(function () {
                watcher.unWatchFiles();
            });

        });
    });
}());
