Ext.define('sprites.Point', {
    extend: 'drawable.DrawableSquare',
    mixins: ['motion.Velocity', 'collision.Collision'],
    constructor: function (props) {
        this.callParent([props]);
    }

});
