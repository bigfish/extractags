/*jslint node:true */
/*global describe it expect waitsFor runs*/
(function () {
    describe("parse Ext JS 4 source files", function () {
        var main, fileText;
        main = null;

        it('should parse a directory', function () {
            var err, parseComplete, parsedClasses;
            main = require('../lib/main');
            parsedClasses = null;
            err = null;
            parseComplete = false;
            main.parseDir('./spec/testfiles', function (error, classes) {
                main = require('../lib/main');
                err = error;
                parsedClasses = classes;
                parseComplete = true;
            });
            waitsFor(function () {
                return parseComplete;
            }, "parsing did not complete", 1000);
            runs(function () {
                expect(err).toBe(null);
                expect(parsedClasses).toNotBe(null);
                expect(parsedClasses.length).toBe(3);
                expect(parsedClasses[0].fullClassName).toBe("life.Animal");
                expect(parsedClasses[1].fullClassName).toBe("life.cats.Tiger");
            });
        });
        it('should parse a file', function () {
            var parsed, parsed_data, parsed_file;
            main = require('../lib/main');
            parsed = false;
            parsed_data = null;
            parsed_file = main.parseFile('./spec/testfiles/Animal.js', function (err, classObj) {
                if (err) {
                    throw err;
                }
                parsed = true;
                parsed_data = classObj;
            });
            waitsFor(function () {
                return parsed;
            });
            return runs(function () {
                expect(parsed_data.fullClassName).toBe('life.Animal');
            });
        });

        it('should output ctags with the symbols exported by a file', function () {
            var parsed, generatedCTags, parsed_file, TAB = "\t";
            main = require('../lib/main');
            parsed = false;
            generatedCTags = null;
            parsed_file = main.genCTags('./spec/testfiles/Animal.js', function (ctags) {
                parsed = true;
                generatedCTags = ctags;
            });
            waitsFor(function () {
                return parsed;
            });
            return runs(function () {
                expect(generatedCTags[0]).toBe('life.Animal\t./spec/testfiles/Animal.js\t/^Ext.define("life.Animal", {$/;"');
            });
        });

        it('should output no tags when given a file without an Ext.define declaration', function () {
            var parsed, generatedCTags, parsed_file, TAB = "\t";
            main = require('../lib/main');
            parsed = false;
            generatedCTags = null;
            parsed_file = main.genCTags('./spec/testfiles/dogs/Greyhound.js', function (ctags) {
                parsed = true;
                generatedCTags = ctags;
            });
            waitsFor(function () {
                return parsed;
            });
            return runs(function () {

                expect(generatedCTags.length).toBe(0);
            });

        });
    });
}());
