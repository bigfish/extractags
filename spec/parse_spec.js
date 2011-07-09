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
    });
}());
