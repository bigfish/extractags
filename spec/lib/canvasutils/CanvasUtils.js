Ext.namespace("canvasutils");
(function () {
    var IS_POINT_IN_PATH_MODE = 'none';
    var isPointInPath;

    var canvas, context;
    canvas = document.createElement('canvas');
    if (canvas && canvas.getContext) {
        context = canvas.getContext('2d');
        context.save();
        context.translate(10, 10);
        context.rect(0, 0, 10, 10);
        if (context.isPointInPath(5, 5)) {
            IS_POINT_IN_PATH_MODE = 'local';
        } else if (context.isPointInPath(15, 15)) {
            IS_POINT_IN_PATH_MODE = 'global';
        }

        //define function dynamically based on mode
        isPointInPath = function () {
            if (IS_POINT_IN_PATH_MODE === 'global') {
                //this version will ignore the x_offset, y_offset arguments
                //since they are not needed
                return function (ctx, x, y) {
                    return ctx.isPointInPath(x, y);
                };
            } else if (IS_POINT_IN_PATH_MODE === 'local') {
                //x_offset, y_offset are the global coordinates of the origin
                //of the local transformation matrix
                //you will have to keep track of this yourself
                //since Canvas does not provide it
                //eg. by using sprites which have global x,y properties
                //or some means of obtaining them
                return function (ctx, x, y, x_offset, y_offset) {
                    return ctx.isPointInPath(x - x_offset, y - y_offset);
                };
            }
        }();
    }

    function _polygonsIntersect(ctx, shape1, shape2) {
        var intersect = false;
        var pts1 = shape1.points,
            pts2 = shape2.points;
        var pt, pt2;
        ctx.save();
        ctx.translate(shape1.x, shape1.y);
        //activate shape1 by drawing a path with its points
        ctx.beginPath();
        ctx.moveTo(pts1[0].x, pts1[0].y);
        for (var i = 1; i < pts1.length; i++) {
            pt = pts1[i];
            ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        //check if any of shape2's points intersect with it
        for (var j = 0; j < pts2.length; j++) {
            pt2 = pts2[j];
            if (isPointInPath(ctx, shape2.x + pt2.x, shape2.y + pt2.y, shape1.x, shape1.y)) {
                intersect = true;
                break;
            }
        }
        ctx.restore();
        return intersect;
    }

    function polygonsIntersect(ctx, shape1, shape2) {
        return _polygonsIntersect(ctx, shape1, shape2) || _polygonsIntersect(ctx, shape2, shape1);
    }

    //export the utility methods
    Ext.define('canvasutils.CanvasUtils', {
        statics: {
            isPointInPath: isPointInPath,
            polygonsIntersect: polygonsIntersect
        }
    });

})();
