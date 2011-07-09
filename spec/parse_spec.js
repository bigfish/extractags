/*jslint node:true */
/*global describe it expect waitsFor runs*/
(function () {
    describe("parse Ext JS 4 source files", function () {
        var extags, fileText;
        extags = null;
        fileText = "Ext.define(\"some.Class\", {\n    \n});";
        it('should parse the class name from a String', function () {
            var parsed_class;
            extags = require('../lib/parser/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.fullClassName).toBe("some.Class");
        });
        it('should parse a directory', function () {
            var err, parseComplete, parsedClasses;
            extags = require('../lib/parser/parser');
            parsedClasses = null;
            err = null;
            parseComplete = false;
            extags.parseDir('./spec/testfiles', function (error, classes) {
                extags = require('../lib/parser/parser');
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
            extags = require('../lib/parser/parser');
            parsed = false;
            parsed_data = null;
            parsed_file = extags.parseFile('./spec/testfiles/Animal.js', function (err, classObj) {
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
    });
}());
