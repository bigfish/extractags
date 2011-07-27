Ext.define('drawable.DrawableLine', {
    extend: 'geometry.Line',
    mixins: ['drawable.Drawable'],
    constructor: function (props) {
        this.callParent([props]);
        //this is a base drawable class -- set context (required property)
        this.initDrawable(this.context);
    },
    draw: function (ctx) {
        this.beforeDraw(ctx);
        this.ctx.beginPath();
        this.ctx.moveTo(this.start.x, this.start.y);
        this.ctx.lineTo(this.end.x, this.end.y);
        this.ctx.stroke();
        this.afterDraw(ctx);
    }
});
