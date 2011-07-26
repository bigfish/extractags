/*jslint node:true white:false*/
/*global describe it expect waitsFor runs*/
(function () {
    describe("parse Ext JS 4 source files", function () {
        var main, fileText, fs;
        main = null;
        fs = require('fs');

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
            }, "parsing did not complete", 3000);
            runs(function () {
                expect(err).toBe(null);
                expect(parsedClasses).toNotBe(null);
                expect(parsedClasses.length).toBe(4);
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
            runs(function () {
                expect(parsed_data.fullClassName).toBe('life.Animal');
            });
        });

        it('should output a tag for the class which is defined in a file', function () {
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
            runs(function () {
                expect(generatedCTags[0]).toBe('Animal\t./spec/testfiles/Animal.js\t/^Ext.define("life.Animal", {$/;"\tc');
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
            runs(function () {

                expect(generatedCTags.length).toBe(0);
            });

        });
        it('should output a tag for the constructor function which is defined in a file', function () {
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
            runs(function () {
                expect(generatedCTags[1]).toBe('Animal\t./spec/testfiles/Animal.js\t/^    constructor: function (name) {$/;"\tf');
            });
        });

        it('should output a tag for a method function which is defined in a file', function () {
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
            runs(function () {
                expect(generatedCTags[2]).toBe('breathe\t./spec/testfiles/Animal.js\t/^    breathe: function () {$/;"\tf');
            });
        });

        it('should not output tags for code inside comments', function () {
            var parsed, generatedCTags, parsed_file, TAB = "\t";
            main = require('../lib/main');
            parsed = false;
            generatedCTags = null;
            parsed_file = main.genCTags('./spec/testfiles/Vegetable.js', function (ctags) {
                parsed = true;
                generatedCTags = ctags;
            });
            waitsFor(function () {
                return parsed;
            });
            runs(function () {
                expect(generatedCTags.length).toBe(4);
            });

        });

        it('should not output tags for code inside object literals (other than the Ext.define() config object)', function () {
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
            runs(function () {
                expect(generatedCTags.length).toBe(4);
            });
        });

        it('should output tags for properties of the class defined in the file)', function () {
            var parsed, generatedCTags, parsed_file, TAB = "\t";
            main = require('../lib/main');
            parsed = false;
            generatedCTags = null;
            parsed_file = main.genCTags('./spec/testfiles/Vegetable.js', function (ctags) {
                parsed = true;
                generatedCTags = ctags;
            });
            waitsFor(function () {
                return parsed;
            });
            runs(function () {
                expect(generatedCTags.length).toBe(4);
            });

        });

        it("should parse a dir with only dirs in it", function () {
            var parsed, generatedCTags, parsed_file, TAB = "\t";
            main = require('../lib/main');
            parsed = false;
            generatedCTags = null;
            parsed_file = main.genCTags('./spec/lib', function (ctags) {
                parsed = true;
                generatedCTags = ctags;
            });
            waitsFor(function () {
                return parsed;
            }, 1000);
            runs(function () {
                expect(generatedCTags.length).toBe(181);
            });

        });
/*
        it('should regenerate tags when autoGenCTags is called', function () {
            var parsed, generatedCTags, parsed_file, TAB = "\t";
            main = require('../lib/main');
            parsed = false;
            generatedCTags = null;
            parsed_file = main.autoGenCTags('./spec/test_watcher_files/adir', function (ctags) {
                parsed = true;
                generatedCTags = ctags;
            });
            waitsFor(function () {
                return parsed;
            });
            runs(function () {
                expect(generatedCTags.length).toBe(4);
            });
            //now lets check that when a file is changed, the tags are regenerated
            //remove the file if it exists
            fs.unlinkSync('./spec/test_watcher_files/adir/NewClass.js');
            parsed = false;
            waitsFor(function () {
                return parsed;
            });
            //write the file which should trigger regeneration
            fs.writeFileSync('./spec/test_watcher_files/adir/NewClass.js', [
                "Ext.define('adir.NewClass', {"
                , "})"].join("\n"), 'UTF-8');
            runs(function () {
                expect(generatedCTags.length).toBe(5);
                //remove the file again
                //fs.unlinkSync('./spec/test_watcher_files/adir/NewClass.js');
            });
        });
*/
    });
}());
