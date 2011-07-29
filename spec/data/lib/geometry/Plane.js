/**
 * Plane is a 2D surface
 * if 'wrap' is true, shapes will 
 * wrap their positions if they 
 * move out of the boundaries of the plane
 */
Ext.define('geometry.Plane', {
    extend: 'geometry.Square',
    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            wrap: false
        }));
    }
});
