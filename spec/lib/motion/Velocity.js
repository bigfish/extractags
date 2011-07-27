Ext.define('motion.Velocity', {
    //setVelocity must be called before move()
    //or an error will occur
    setVelocity: function (vx, vy, av) {
        this.vx = vx;
        this.vy = vy;
        //av is optional
        if (av !== undefined) {
            this.av = av;
        }
    },

    move: function () {
        this.x += this.vx;
        this.y += this.vy;
        //angular velocity
        if (this.av) {
            this.rotation += this.av;
        }
    }
});
