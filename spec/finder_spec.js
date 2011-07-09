/*jslint node:true */
/*global describe it expect waitsFor runs*/
(function () {
    describe("file finder finds files", function () {
        it("should find all files in a directory", function () {
            var error, fileFound, finder, foundFile;
            finder = require('../lib/utils/finder');
            foundFile = false;
            error = null;
            fileFound = null;
            finder.find('./spec/testfiles', null, function (err, file) {
                foundFile = true;
                error = err;
                fileFound = file;
            });
            waitsFor(function () {
                return foundFile;
            }, "find did not find anything after a second", 1000);
            return runs(function () {
                expect(fileFound).toBeDefined();
            });
        });
        it("should pass the 'finished' argument when finished finding", function () {
            var find_finished, finder, found_files;
            finder = require('../lib/utils/finder');
            find_finished = false;
            found_files = [];
            finder.find('./spec/testfiles', null, function (err, file, finished) {
                var error;
                error = err;
                found_files.push(file);
                find_finished = finished;
            });
            waitsFor(function () {
                return find_finished;
            }, "find did not finish after a second", 1000);
            return runs(function () {
                expect(found_files.length).toBe(4);
            });
        });
        return it("should filter files", function () {
            var find_finished, finder, found_files;
            finder = require('../lib/utils/finder');
            find_finished = false;
            found_files = [];
            finder.find('./spec/testfiles', /\.js$/, function (err, file, finished) {
                var error;
                error = err;
                found_files.push(file);
                find_finished = finished;
            });
            waitsFor(function () {
                return find_finished;
            }, "find did not finish after a second", 1000);
            return runs(function () {
                expect(found_files.length).toBe(3);
            });
        });
    });
}());
