Ext.define('interactive.Clickable', {

    onClick: function (fn, ctx) {
        if (fn) {
            this.click = Ext.Function.bind(fn, ctx);
        }
    },

    noClick: function () {
        this.click = null;
    }
});
