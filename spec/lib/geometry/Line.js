/*global geometry */
Ext.define('geometry.Line', {
    extend: 'geometry.Point',
    constructor: function (props) {
        this.callParent([Ext.applyIf(props, {
            start: new geometry.Point({
                x: 0,
                y: 0
            }),
            end: new geometry.Point({
                x: 100,
                y: 100
            })
        })]);
    },
    length: function () {
        var dx = this.end.x - this.start.x;
        var dy = this.end.y - this.start.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
});
