Ext.define("life.Animal", {
    constructor: function (name) {
        this.name = name;
    },
    /***
     * foo function () {
     *
     * }
     */
    foobar: {
        a: 1,
        b: 2,
        donNotIndex: function () {
            this.a = 1 + 1;
        }
    },
    breathe: function () {


    }
});
