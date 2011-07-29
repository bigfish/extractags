/*jslint node:true white:false*/
/*global describe it expect waitsFor runs*/
(function () {
    describe("parse Ext JS 4 source files", function () {
        var extags, fileText;
        var fs = require("fs");
        extags = null;

        it('should parse the class name from a String', function () {
            fileText = "Ext.define(\"some.Class\", {\n    \n});";
            var parsed_class;
            extags = require('../../lib/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.fullClassName).toBe("some.Class");
        });

        it('should parse the constructor function with no params', function () {
            fileText = [
                "Ext.define(\"some.Class\", {"
                , "constructor: function () {"
                , "}"
                , "});"].join("\n");
            var parsed_class;
            extags = require('../../lib/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.constructorFn.params.length).toBe(0);
        });
        it('should parse the constructor function with 1 param', function () {
            fileText = [
                "Ext.define(\"some.Class\", {"
                , "constructor: function (arg) {"
                , "this.foo = arg;"
                , "}"
                , "});"].join("\n");
            var parsed_class;
            extags = require('../../lib/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.constructorFn.params.length).toBe(1);
            expect(parsed_class.constructorFn.params[0]).toBe('arg');
        });
        it('should parse the constructor function with multiple param', function () {
            fileText = [
                "Ext.define(\"some.Class\", {"
                , "constructor: function (arg1, arg2) {"
                , "this.foo = arg1;"
                , "this.bar = arg2;"
                , "}"
                , "});"].join("\n");
            var parsed_class;
            extags = require('../../lib/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.constructorFn.params.length).toBe(2);
            expect(parsed_class.constructorFn.params[0]).toBe('arg1');
            expect(parsed_class.constructorFn.params[1]).toBe('arg2');
        });
        it('should parse the constructor function with multiple params and exclude comments', function () {
            fileText = [
                "Ext.define(\"some.Class\", {"
                , "constructor: function (arg1, arg2/*foo*/) {"
                , "this.foo = arg1;"
                , "this.bar = arg2;"
                , "}"
                , "});"].join("\n");
            var parsed_class;
            extags = require('../../lib/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.constructorFn.params.length).toBe(2);
            expect(parsed_class.constructorFn.params[0]).toBe('arg1');
            expect(parsed_class.constructorFn.params[1]).toBe('arg2');
        });
        it('should parse the constructor function with multiple params and exclude multiple comments', function () {
            fileText = [
                "Ext.define(\"some.Class\", {"
                , "constructor: function (/*some comment*/arg1,/*another comment*/ arg2/*foo*/) {"
                , "this.foo = arg1;"
                , "this.bar = arg2;"
                , "}"
                , "});"
                ].join("\n");
            var parsed_class;
            extags = require('../../lib/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.constructorFn.params.length).toBe(2);
            expect(parsed_class.constructorFn.params[0]).toBe('arg1');
            expect(parsed_class.constructorFn.params[1]).toBe('arg2');
        });

        it("should parse the static methods and properties of the class", function () {
            fileText = fs.readFileSync("./spec/data/statics/Observable.js", "UTF-8");
            var parsed_class;
            extags = require('../../lib/parser');
            parsed_class = extags.parseText(fileText);
            expect(parsed_class.statics.props.length).toBe(0);
            expect(parsed_class.statics.methods.length).toBeGreaterThan(0);
        });

    });
}());
