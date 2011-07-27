Ext.define('interactive.Draggable', {

    onStartDrag: function (fn, ctx) {
        if (fn) {
            this.startdrag = Ext.Function.bind(fn, ctx);
        }
    },

    noStartDrag: function () {
        this.startdrag = null;
    },

    onDrag: function (fn, ctx) {
        if (fn) {
            this.drag = Ext.Function.bind(fn, ctx);
        }
    },

    noDrag: function () {
        this.drag = null;
    },

    onEndDrag: function (fn, ctx) {
        if (fn) {
            this.enddrag = Ext.Function.bind(fn, ctx);
        }
    },

    noEndDrag: function () {
        this.enddrag = null;
    }
});
