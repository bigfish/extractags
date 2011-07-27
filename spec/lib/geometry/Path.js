/*global geometry */
Ext.define('geometry.Path', {

    extend: 'geometry.Point',

    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            points: []
        }));
    },

    addPoint: function (pt) {
        return this.points.push(pt) - 1;
    },

    getPoint: function (idx) {
        return this.points[idx];
    },
    
    removePoint: function(idx) {
        this.points.splice(idx, 1);
    },

    clearPoints: function () {
        this.points = [];
    },

    setPointsFromArray: function (array) {
        this.clearPoints();
        Ext.Array.forEach(array, function (p) {
            this.addPoint(new geometry.Point({
                x: p.x,
                y: p.y
            }));
        }, this);
    }

});
