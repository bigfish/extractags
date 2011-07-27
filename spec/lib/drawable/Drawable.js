/**
 * enables drawing of a shape to a canvas context
 * requires the class mixed into is a subclass of Path
 * and has a 'ctx' property which is a Canvas2D context
 */
Ext.define('drawable.Drawable', {

    initDrawable: function (context) {
        if (!context.ctx) {
            throw new Error("Sprite requires a context property");
        }
        this.ctx = context.ctx;
    },

    beforeDraw: function () {
        this.ctx.save();
        //apply shape transform to context
        this.ctx.translate(this.x, this.y);
        if (this.strokeStyle) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        if (this.fillStyle) {
            this.ctx.fillStyle = this.fillStyle;
        }
        if (this.rotation && this.rotation) {
            this.ctx.rotate(this.rotation);
        }
    },
    //default draw method assumes Path implementation
    draw: function () {
        this.beforeDraw();

        //draw closed path
        var startPoint = this.getPoint(0);
        var pathPoints = this.points.slice(1);
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.x, startPoint.y);
        Ext.Array.forEach(pathPoints, function (pt, idx, arr) {
            this.ctx.lineTo(pt.x, pt.y);
        }, this);
        this.ctx.closePath();
        this.ctx.stroke();

        this.afterDraw();
    },

    afterDraw: function () {
        this.ctx.restore();
    }
});
