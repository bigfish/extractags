Ext.define('drawable.Layer', {

    extend: 'canvasutils.Context2D',

    mixins: ['collection.Collection'],

    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            items: []
        }));
    },

    update: function () {
        this.forEach(function (shape) {
            if (shape.active === false) {
                return;
            }
            if (shape.update) {
                shape.update();
            }
        });
    },

    render: function () {
        var shape;
        for (var i = 0; i < this.items.length; i++) {
            shape = this.items[i];
            if (shape.active === false) {
                continue;
            } else {
                shape.draw();
            }
        }
    }


});
