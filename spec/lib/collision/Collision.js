/*global canvasutils */
//requires this.ctx === Canvas 2D context
Ext.define('collision.Collision', {
    requires: ['canvasutils.CanvasUtils'],
    containsPoint: function (x, y) {
        var result;
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        //activate by drawing a path with points
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 0; i < this.points.length; i++) {
            var pt = this.points[i];
            this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.closePath();
        result = canvasutils.CanvasUtils.isPointInPath(this.ctx, x, y, this.x, this.y);
        this.ctx.restore();
        return result;
    },

    intersects: function (otherShape) {
        return canvasutils.CanvasUtils.polygonsIntersect(this.ctx, this, otherShape);
    }

});
