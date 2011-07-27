/*global eventbus */
Ext.define('sprites.Bullet', {
    extend: 'sprites.Point',
    requires: ['eventbus.EventBus'],
    constructor: function (props) {
        var me = this;
        
        this.callParent([Ext.applyIf(props, {
            width: 2,
            height: 2,
            dx: 0,
            dy: 0,
            vx: 0,
            vy: 0
        })]);
        
        // expire bullet after time (rather than distance)
        setTimeout(function () {
            eventbus.EventBus.publish('bulletExpired', me);
        }, 2000);
    },

    update: function () {
        var plane_width = this.context.width;
        var plane_height = this.context.height;
        this.move();
        this.dx += Math.abs(this.vx);
        this.dy += Math.abs(this.vy);

        //do wrapping
        if (this.x < 0) {
            this.x += plane_width;
        } else if (this.x > plane_width) {
            this.x -= plane_width;
        }
        if (this.y < 0) {
            this.y += plane_height;
        } else if (this.y > plane_height) {
            this.y -= plane_height;
        }
    }

});
