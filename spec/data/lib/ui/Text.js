/*global canvasutils */
Ext.define('ui.Text', {

    extend: 'ui.Component',
    constructor: function (props) {
        this.callParent(this.applyProps(props, {
            text: 'Text'
        }));
    },

    draw: function () {

        this.beforeDraw();

        var m = this.ctx.measureText(this.text); //gets width only... height is font size
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillStyle = "#00FF00";
        this.ctx.fillText(this.text, 0, (this.height) / 2);

        this.afterDraw();
    }
});
