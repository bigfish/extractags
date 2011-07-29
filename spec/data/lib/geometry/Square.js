/*global geometry */
Ext.define('geometry.Square', {

    extend: 'geometry.Shape',
    requires: ['geometry.Point'],
    constructor: function (props) {
        this.callParent([Ext.applyIf(props, {
            width: 100,
            height: 100
        })]);

        this.setPointsFromArray([{
            x: 0,
            y: 0
        },
        {
            x: this.width,
            y: 0
        },
        {
            x: this.width,
            y: this.height
        },
        {
            x: 0,
            y: this.height
        }]);
    }

});
