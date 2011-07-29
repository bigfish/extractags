/*global canvasutils */
/**
 * Shape is a geometrical object
 * with more than one Point
 * a position, rotation, and scale
 */
Ext.define('geometry.Shape', {

    extend: 'geometry.Path',
    requires: ['canvasutils.CanvasUtils'],
    constructor: function (props) {
        this.callParent([Ext.applyIf(props, {
            rotation: 0,
            scale: 1
        })]);
    },

});
