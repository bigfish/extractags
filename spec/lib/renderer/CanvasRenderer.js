/**
 * renders Shapes to a Context2D
 */
Ext.define('renderer.CanvasRenderer', {

    extend: 'oop.InitProps',
    constructor: function (props) {
        this.callParent([props]);
    },

    clear: function () {
        this.context.ctx.reset();
    },

    render: function (plane) {
        var shape;
        if (this.plane && this.context) {
            for (var i = 0; i < this.plane.shapes.length; i++) {
                shape = this.plane.shapes[i];
                if (shape.active === false) {
                    continue;
                } else {
                    shape.draw(this.context.ctx);
                }
            }
        }
    }

});
