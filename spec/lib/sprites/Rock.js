/*global canvasutils canvasteroids*/
(function () {

    var TWO_PI = Math.PI * 2;
    var RND = function (max) {
        return Math.random() * max;
    };

    Ext.define('sprites.Rock', {
        extend: 'sprites.Sprite',
        requires: ['canvasutils.CanvasUtils'],
        constructor: function (props) {
            this.callParent([Ext.applyIf(props, {
                active: true,
                size: 3
            })]);
            //some properties must be derived
            this.init(props);
        },

        init: function (o) {

            var parent = o.parent;
            this.clearPoints();
            this.size = o.size; //3 -> big, 2 -> med, 1 -> small, 0 - dormant
            if (this.size === 3) {
                this.num_points = 16;
                this.radius = 60;
            } else if (this.size === 2) {
                this.num_points = 12;
                this.radius = 30;
            } else if (this.size === 1) {
                this.num_points = 6;
                this.radius = 8;
            } else {
                //log bad size found
            }
            var min_radius = this.radius * 0.7;
            var var_radius = this.radius * 0.3;
            this.ang_incr = TWO_PI / this.num_points;
            var r = 0;
            for (var p = 0; p < this.num_points; p++) {
                r += this.ang_incr;
                var radius = min_radius + RND(var_radius);
                this.addPoint({
                    x: radius * Math.cos(r),
                    y: radius * Math.sin(r)
                });
            }
            if (parent) {
                this.bearing = (parent.bearing + RND(TWO_PI)) / 2;
                this.vx = (parent.vx + o.speed) * Math.cos(this.bearing);
                this.vy = (parent.vy + o.speed) * Math.sin(this.bearing);
            } else {
                this.bearing = RND(TWO_PI);
                this.vx = o.speed * Math.cos(this.bearing);
                this.vy = o.speed * Math.sin(this.bearing);
            }

        },

        update: function () {
            this.move();
            this.checkWrap();
        },

        checkWrap: function () {
            var buffer = this.radius;
            var canvas_width = this.context.canvas_width;
            var canvas_height = this.context.canvas_height;

            if (this.x > canvas_width + buffer) {
                this.x = -buffer;
            } else if (this.x < -buffer) {
                this.x = canvas_width + buffer;
            }

            if (this.y > canvas_height + buffer) {
                this.y = -buffer;
            } else if (this.y < -buffer) {
                this.y = canvas_height + buffer;
            }
        }
    });

})();
