Ext.define('motion.Velocity', {
    //NB: you must set this.vx, this.vy, or call setVelocity
    //before calling move()
    //or an error will occur
    setVelocity: function (vx, vy) {
        this.vx = vx;
        this.vy = vy;
    },
    move: function () {
        this.x += this.vx;
        this.y += this.vy;
    }
});
