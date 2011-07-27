Ext.define('sprites.ShipFragment', {
    extend: 'sprites.Sprite',
    constructor: function (props) {
        this.callParent([Ext.applyIf(props, {
            strokeStyle: '#FF0000'
        })]);
    },
    update: function () {
        this.move();
    },
    draw: function () {
        this.beforeDraw();
        this.ctx.save();
        this.ctx.translate(0, -this.length / 2);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, this.length);
        this.ctx.restore();
        this.ctx.stroke();
        this.afterDraw();
    }
});
