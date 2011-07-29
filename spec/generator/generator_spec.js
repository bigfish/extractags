/*jslint node:true white:false*/
/*global describe it expect waitsFor runs*/
(function () {
    describe("generator generates ctags from parsed class value objects", function () {
        var gen = require("../../lib/generator");

        it("should generate static tags", function () {
            var tags;
            var classObj = {
                fullClassName: null,
                constructorFn: null,
                filePath: 'afile',
                line: "constructor: function() {",
                methods: [],
                props: [],
                statics: {
                    methods: [{
                        name: 'doStuff',
                        line: 'someLine'
                    }],
                    props: [{
                        name: 'someProp',
                        line: 'aline'
                    }]
                }
            };
            tags = gen.genCTags([classObj]);
            //console.log("TAGS: ", tags);
            expect(tags.indexOf('someProp\tafile\t/^aline$/;"\tp\tfile:')).toNotBe(-1);
        });


    });
}());
