Ext.define('interactive.ClickableLayer', {
    extend: 'drawable.Layer',
    constructor: function (props) {
        this.callParent([props]);
        //assume W3C event model
        //does not support IE < 9 since it has no canvas anyways... use Chrome Frame
        var layer = this;
        var surface = this.canvas;

        //this.canvas.addEventListener('mousedown', Ext.Function.bind(this.onMouseDown, this), false);
        //this.canvas.addEventListener('mousemove', Ext.Function.bind(this.onMouseMove, this), false);
        //this.canvas.addEventListener('mouseup', Ext.Function.bind(this.onMouseUp, this), false);
        this.canvas.addEventListener('click', Ext.Function.bind(this.onClick, this), false);

        this.canvas.addEventListener('click', function (event) {
            layer.handleEvent('click', event);
        }, false);
    },

/*onMouseDown: function (event) {
        this.handleEvent('mousedown', event);
    },

    onMouseMove: function (event) {
        this.handleEvent('mousemove', event);
    },

    onMouseUp: function (event) {
        this.handleEvent('mouseup', event);
    },*/

    onClick: function (event) {
        this.handleEvent('click', event);
    },

    handleEvent: function (evtName, evtObject) {
        //get coords realtive to the canvas
        var x = event.clientX - this.canvas.offsetLeft;
        var y = event.clientY - this.canvas.offsetTop;
        //detect if any shapes contain the event position
        this.items.forEach(function (shape) {
            if (shape.active && shape[evtName]) {
                if (shape.containsPoint(x, y)) {
                    //fire event
                    shape[evtName](x - shape.x, y - shape.y);
                }
            }
        });

    }
});
