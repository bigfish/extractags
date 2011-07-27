Ext.define('sprites.Sprite', {
    extend: 'geometry.Shape',
    mixins: ['motion.Velocity', 'drawable.Drawable', 'collision.Collision'],
    constructor: function (props) {
        this.callParent([props]);
        //this is a base drawable class -- set context (required property)
        this.initDrawable(this.context);
    }
});
