/**
 * keeps track of a drag operation
 * start: Point
 * end: Point
 * dragTo(x, y);
 */
Ext.define('interactive.Drag', {
    extend: 'oop.InitProps',
    constructor: function (props) {
        this.callParent(this.applyProps(props, {}));
    },
    dragTo: function (x, y) {
        this.end.x = x;
        this.end.y = y;
    },
    getOffsetX: function () {
        return this.end.x - this.start.x;
    },
    getOffsetY: function () {
        return this.end.y - this.start.y;
    },
    distance: function () {
        var dx = this.getOffsetX();
        var dy = this.getOffsetY();
        return Math.sqrt(dx * dx + dy * dy);
    }

});
