/*jslint node:true white:false*/
/*global describe it expect waitsFor runs*/
(function () {
    describe("generator generates ctags from parsed class value objects", function () {
        var gen = require("../../lib/generator");

        it("should generate static tags", function () {
            var tags;
            var classObj = {
                fullClassName: 'bar.Grand',
                className: 'Grand',
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
            expect(tags.indexOf('someProp\tafile\t/^aline$/;"\tp\tfile:\tclass:bar.Grand')).toNotBe(-1);
        });

        it("should generate the class extended attribute", function () {
            var tags;
            var classObj = {
                fullClassName: 'foo.Awesome',
                className: 'Awesome',
                classDefineLine: 'Ext.define("foo.Awesome", {',
                constructorFn: null,
                filePath: 'afile',
                line: "constructor: function() {",
                methods: [{
                    name: 'doStuff',
                    line: 'someLine'
                }],
                props: [{
                    name: 'someProp',
                    line: 'aline'
                }],
                statics: {
                    methods: [{
                        name: 'doStaticStuff',
                        line: 'someLine2'
                    }],
                    props: [{
                        name: 'someStaticProp',
                        line: 'anoterline'
                    }]
                }
            };
            tags = gen.genCTags([classObj]);
            console.log("TAGS: ", tags);
            expect(tags.indexOf('Awesome\tafile\t/^Ext.define("foo.Awesome", {$/;"\tc')).toNotBe(-1);
            expect(tags.indexOf('doStuff\tafile\t/^someLine$/;"\tf\tclass:foo.Awesome')).toNotBe(-1);
            expect(tags.indexOf('someProp\tafile\t/^aline$/;"\tp\tclass:foo.Awesome')).toNotBe(-1);
            expect(tags.indexOf('someStaticProp\tafile\t/^anoterline$/;"\tp\tfile:\tclass:foo.Awesome')).toNotBe(-1);
            expect(tags.indexOf('doStaticStuff\tafile\t/^someLine2$/;"\tp\tfile:\tclass:foo.Awesome')).toNotBe(-1);
        });


    });
}());
